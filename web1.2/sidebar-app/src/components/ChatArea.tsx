import { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Avatar,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import type { Chat, Message } from '../types/chat';

interface ChatAreaProps {
  chat: Chat | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  isTyping?: boolean;
}

const MessageStatus = ({ status }: { status: Message['status'] }) => {
  switch (status) {
    case 'sent':
      return <DoneIcon fontSize="small" sx={{ opacity: 0.5, ml: 0.5 }} />;
    case 'delivered':
      return <DoneAllIcon fontSize="small" sx={{ opacity: 0.5, ml: 0.5 }} />;
    case 'read':
      return <DoneAllIcon fontSize="small" color="primary" sx={{ ml: 0.5 }} />;
    default:
      return null;
  }
};

export const ChatArea = ({ chat, messages, onSendMessage, isTyping }: ChatAreaProps) => {
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMultiline, setIsMultiline] = useState(false);

  // Автопрокрутка к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Обработчик отправки сообщения
  const handleSendMessage = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
      setIsMultiline(false);
    }
  };

  // Обработчик нажатия Enter
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  if (!chat) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          bgcolor: 'background.default'
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Выберите чат для начала общения
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Шапка чата */}
      <Paper
        elevation={1}
        sx={{
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          borderRadius: 0,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        {chat.isAI ? (
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
            <SmartToyIcon />
          </Avatar>
        ) : (
          <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>{chat.name[0]}</Avatar>
        )}
        <Box>
          <Typography variant="subtitle1">{chat.name}</Typography>
          <Typography variant="caption" color="text.secondary">
            {isTyping ? 'печатает...' : 'в сети'}
          </Typography>
        </Box>
      </Paper>

      {/* Область сообщений */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          bgcolor: 'grey.50'
        }}
      >
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.senderId === 'user' ? 'flex-end' : 'flex-start',
              alignItems: 'flex-end',
              gap: 1,
            }}
          >
            {message.senderId !== 'user' && (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: chat.isAI ? 'primary.main' : 'secondary.main'
                }}
              >
                {chat.isAI ? <SmartToyIcon sx={{ fontSize: 18 }} /> : chat.name[0]}
              </Avatar>
            )}
            <Paper
              elevation={0}
              sx={{
                p: 2,
                maxWidth: '70%',
                bgcolor: message.senderId === 'user' ? 'primary.light' : 'background.paper',
                borderRadius: 2,
                position: 'relative'
              }}
            >
              <Typography variant="body1">{message.text}</Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  mt: 0.5
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {message.timestamp}
                </Typography>
                {message.senderId === 'user' && <MessageStatus status={message.status} />}
              </Box>
            </Paper>
          </Box>
        ))}
        {isTyping && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main'
              }}
            >
              <SmartToyIcon sx={{ fontSize: 18 }} />
            </Avatar>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <CircularProgress size={16} />
              <Typography variant="caption" color="text.secondary">
                печатает...
              </Typography>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      {/* Поле ввода */}
      <Paper
        elevation={1}
        sx={{
          p: 2,
          borderTop: 1,
          borderColor: 'divider',
          borderRadius: 0
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={messageText}
            onChange={(e) => {
              setMessageText(e.target.value);
              setIsMultiline(e.target.value.includes('\n'));
            }}
            onKeyPress={handleKeyPress}
            placeholder="Введите сообщение..."
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />
          <IconButton
            color="primary"
            onClick={handleSendMessage}
            disabled={!messageText.trim()}
            sx={{
              alignSelf: isMultiline ? 'flex-end' : 'center'
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}; 