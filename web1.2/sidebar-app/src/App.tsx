import { useState } from "react";
import { Box, CssBaseline, IconButton, ThemeProvider, createTheme } from "@mui/material";
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Sidebar } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";
import type { Chat, Message } from "./types/chat";
import OpenAI from 'openai';

// AI Configuration
const ai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

// Demo Data
const DEMO_CHATS: Chat[] = [
  {
    id: "1",
    name: "AI Ассистент",
    lastMessage: "Чем могу помочь?",
    lastMessageTime: "10:30",
    unreadCount: 0,
    isAI: true,
  },
  {
    id: "2",
    name: "Иван Петров",
    lastMessage: "Привет! Как дела?",
    lastMessageTime: "09:45",
    unreadCount: 2,
    isAI: false,
  },
];

const DEMO_MESSAGES: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      text: "Привет! Я AI ассистент. Чем могу помочь?",
      timestamp: "10:30",
      senderId: "ai",
      status: "read",
      type: "text"
    }
  ],
  "2": [
    {
      id: "1",
      text: "Привет! Как дела?",
      timestamp: "09:45",
      senderId: "ivan",
      status: "read",
      type: "text"
    }
  ]
};

function App() {
  // UI State
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Chat State
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>(DEMO_CHATS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(DEMO_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);

  // Theme
  const theme = createTheme({
    palette: {
      mode,
      primary: { main: '#1976d2' },
      secondary: { main: '#9c27b0' },
    },
  });

  // Derived State
  const selectedChat = selectedChatId ? chats.find(chat => chat.id === selectedChatId) ?? null : null;
  const currentMessages = selectedChatId ? messages[selectedChatId] || [] : [];

  // Chat Handlers
  const handleCreateChat = (name: string, isAI: boolean) => {
    const newChatId = Date.now().toString();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newChat: Chat = {
      id: newChatId,
      name,
      lastMessage: isAI ? "Привет! Чем могу помочь?" : "",
      lastMessageTime: timestamp,
      unreadCount: 0,
      isAI,
    };

    setChats(prev => [...prev, newChat]);
    
    if (isAI) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        text: "Привет! Чем могу помочь?",
        timestamp,
        senderId: 'ai',
        status: 'read',
        type: 'text'
      };
      
      setMessages(prev => ({
        ...prev,
        [newChatId]: [welcomeMessage]
      }));
    }

    setSelectedChatId(newChatId);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setChats(prev => prev.map(chat => 
      chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
    ));
  };

  const getAIResponse = async (text: string): Promise<string> => {
    try {
      const completion = await ai.chat.completions.create({
        messages: [
          { role: "system", content: "Вы - дружелюбный и полезный ассистент." },
          { role: "user", content: text }
        ],
        model: "gpt-3.5-turbo",
      });

      return completion.choices[0]?.message?.content || "Извините, я не смог сформулировать ответ.";
    } catch (error) {
      console.error('OpenAI API error:', error);
      return "Извините, произошла ошибка при обработке вашего запроса.";
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!selectedChatId) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      timestamp,
      senderId: 'user',
      status: 'sent',
      type: 'text'
    };

    // Add user message
    setMessages(prev => ({
      ...prev,
      [selectedChatId]: [...(prev[selectedChatId] || []), newMessage]
    }));

    // Update chat preview
    setChats(prev => prev.map(chat => 
      chat.id === selectedChatId 
        ? { ...chat, lastMessage: text, lastMessageTime: timestamp }
        : chat
    ));

    if (selectedChat?.isAI) {
      setIsTyping(true);
      
      try {
        const aiResponseText = await getAIResponse(text);
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          senderId: 'ai',
          status: 'read',
          type: 'text'
        };

        setMessages(prev => ({
          ...prev,
          [selectedChatId]: [...(prev[selectedChatId] || []), aiResponse]
        }));

        setChats(prev => prev.map(chat => 
          chat.id === selectedChatId 
            ? { ...chat, lastMessage: aiResponseText, lastMessageTime: aiResponse.timestamp }
            : chat
        ));
      } catch (error) {
        console.error('Error getting AI response:', error);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Simulate message delivery for regular chats
      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          [selectedChatId]: prev[selectedChatId].map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          )
        }));
      }, 1000);

      setTimeout(() => {
        setMessages(prev => ({
          ...prev,
          [selectedChatId]: prev[selectedChatId].map(msg =>
            msg.id === newMessage.id ? { ...msg, status: 'read' } : msg
          )
        }));
      }, 2000);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <CssBaseline />
        
        {/* Theme Toggle */}
        <IconButton
          sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1300 }}
          onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
          color="inherit"
        >
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>

        {/* Sidebar */}
        <Sidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)}
          chats={chats}
          selectedChatId={selectedChatId}
          onChatSelect={handleChatSelect}
          onCreateChat={handleCreateChat}
        />

        {/* Main Chat Area */}
        <Box component="main" sx={{ flexGrow: 1, bgcolor: 'background.default' }}>
          <ChatArea
            chat={selectedChat}
            messages={currentMessages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;