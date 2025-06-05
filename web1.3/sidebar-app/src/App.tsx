import { useState, useEffect } from "react";
import { Box, CssBaseline, IconButton, ThemeProvider, createTheme } from "@mui/material";
import { Brightness4, Brightness7 } from '@mui/icons-material';
import { Sidebar } from "./components/Sidebar";
import { ChatArea } from "./components/ChatArea";
import type { Chat, Message } from "./types/chat";
import OpenAI from 'openai';
import { QueryClient, QueryClientProvider, useMutation } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

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

function AppContent() {
  // UI State
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return (savedMode as 'light' | 'dark') || 'light';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Chat State
  const [selectedChatId, setSelectedChatId] = useState<string | null>(() => {
    return localStorage.getItem('selectedChatId');
  });
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem('chats');
    return savedChats ? JSON.parse(savedChats) : DEMO_CHATS;
  });
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    const savedMessages = localStorage.getItem('messages');
    return savedMessages ? JSON.parse(savedMessages) : DEMO_MESSAGES;
  });
  const [isTyping, setIsTyping] = useState(false);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('theme-mode', mode);
  }, [mode]);

  useEffect(() => {
    if (selectedChatId) {
      localStorage.setItem('selectedChatId', selectedChatId);
    }
  }, [selectedChatId]);

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

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

  // AI Chat Mutation
  const aiChatMutation = useMutation({
    mutationFn: async (text: string) => {
      const completion = await ai.chat.completions.create({
        messages: [
          { role: "system", content: "Вы - дружелюбный и полезный ассистент." },
          { role: "user", content: text }
        ],
        model: "gpt-3.5-turbo",
      });
      return completion.choices[0]?.message?.content || "Извините, я не смог сформулировать ответ.";
    },
    onError: (error: Error) => {
      console.error('OpenAI API error:', error);
      // Не возвращаем строку, просто логируем ошибку
    }
  });

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
        const aiResponseText = await aiChatMutation.mutateAsync(text);
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          senderId: 'ai',
          status: 'read',
          type: 'text'
        };

        // Добавляем индикатор ошибки если она есть
        if (aiChatMutation.isError) {
          const errorMessage: Message = {
            id: Date.now().toString(),
            text: "Произошла ошибка при получении ответа",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            senderId: 'system',
            status: 'error',
            type: 'error'
          };
          
          setMessages(prev => ({
            ...prev,
            [selectedChatId]: [...(prev[selectedChatId] || []), errorMessage]
          }));
          return;
        }

        setMessages(prev => ({
          ...prev,
          [selectedChatId]: [...(prev[selectedChatId] || []), aiResponse]
        }));

        setChats(prev => prev.map(chat => 
          chat.id === selectedChatId 
            ? { ...chat, lastMessage: aiResponseText, lastMessageTime: aiResponse.timestamp }
            : chat
        ));
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
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <IconButton
          sx={{ position: 'fixed', right: 16, top: 16, zIndex: 2000 }}
          onClick={() => setMode(prevMode => prevMode === 'light' ? 'dark' : 'light')}
          color="inherit"
        >
          {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
        </IconButton>
        
        <Sidebar
          chats={chats}
          selectedChatId={selectedChatId}
          onChatSelect={handleChatSelect}
          onCreateChat={handleCreateChat}
          open={sidebarOpen}
          onOpenChange={setSidebarOpen}
        />
        
        <ChatArea
          chat={selectedChat}
          messages={currentMessages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
        />
      </Box>
    </ThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;

