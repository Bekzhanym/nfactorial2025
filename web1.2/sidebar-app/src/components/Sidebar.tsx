import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  useMediaQuery,
  TextField,
  IconButton,
  Typography,
  Divider,
  Badge,
  Avatar,
  Box,
  InputAdornment,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import type { Chat } from "../types/chat";
import { NewChatDialog } from "./NewChatDialog";
import { useState } from "react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  chats: Chat[];
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onCreateChat: (name: string, isAI: boolean) => void;
}

export const Sidebar = ({ 
  open, 
  onClose, 
  chats, 
  selectedChatId, 
  onChatSelect,
  onCreateChat 
}: SidebarProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [searchQuery, setSearchQuery] = useState("");
  const [newChatDialogOpen, setNewChatDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<'regular' | 'ai'>('regular');

  // Фильтрация чатов по поиску
  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chat.lastMessage && chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const aiChats = filteredChats.filter(chat => chat.isAI);
  const humanChats = filteredChats.filter(chat => !chat.isAI);

  const handleAddChat = () => {
    setDialogType('regular');
    setNewChatDialogOpen(true);
  };

  const handleAddAIChat = () => {
    setDialogType('ai');
    setNewChatDialogOpen(true);
  };

  return (
    <>
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? open : true}
        onClose={onClose}
        sx={{
          width: 320,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 320,
            boxSizing: "border-box",
          },
        }}
      >
        {/* Поиск */}
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Поиск по чатам и сообщениям..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: searchQuery ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => setSearchQuery("")}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ) : null,
            }}
          />
          {searchQuery && (
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ display: 'block', mt: 1 }}
            >
              Найдено результатов: {filteredChats.length}
            </Typography>
          )}
        </Box>

        {/* Кнопки добавления */}
        <Box sx={{ px: 2, pb: 2, display: 'flex', gap: 1 }}>
          <Box
            onClick={handleAddChat}
            sx={{ 
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              py: 1,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <AddIcon color="primary" />
            <Typography color="primary" variant="button">Новый чат</Typography>
          </Box>
          <Box
            onClick={handleAddAIChat}
            sx={{ 
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
              py: 1,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <SmartToyIcon color="primary" />
            <Typography color="primary" variant="button">AI чат</Typography>
          </Box>
        </Box>

        <Divider />

        {/* Список AI чатов */}
        {aiChats.length > 0 && (
          <>
            <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
              AI Ассистенты
            </Typography>
            <List>
              {aiChats.map((chat) => (
                <ListItem key={chat.id} disablePadding>
                  <ListItemButton
                    onClick={() => onChatSelect(chat.id)}
                    selected={selectedChatId === chat.id}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        <SmartToyIcon />
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body1">{chat.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {chat.lastMessageTime}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "180px"
                            }}
                          >
                            {chat.lastMessage}
                          </Typography>
                          {chat.unreadCount > 0 && (
                            <Badge
                              badgeContent={chat.unreadCount}
                              color="primary"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider />
          </>
        )}

        {/* Список обычных чатов */}
        {humanChats.length > 0 && (
          <>
            <Typography variant="subtitle2" sx={{ px: 2, py: 1, color: 'text.secondary' }}>
              Люди
            </Typography>
            <List>
              {humanChats.map((chat) => (
                <ListItem key={chat.id} disablePadding>
                  <ListItemButton
                    onClick={() => onChatSelect(chat.id)}
                    selected={selectedChatId === chat.id}
                  >
                    <ListItemIcon>
                      <Avatar sx={{ bgcolor: 'secondary.main' }}>
                        {chat.name[0]}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body1">{chat.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {chat.lastMessageTime}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: "180px"
                            }}
                          >
                            {chat.lastMessage}
                          </Typography>
                          {chat.unreadCount > 0 && (
                            <Badge
                              badgeContent={chat.unreadCount}
                              color="primary"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
        )}
      </Drawer>
      <NewChatDialog
        open={newChatDialogOpen}
        onClose={() => setNewChatDialogOpen(false)}
        onCreateChat={onCreateChat}
        type={dialogType}
      />
    </>
  );
};