export interface Chat {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime: string;
  unreadCount: number;
  isAI: boolean;
  avatar?: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
  status: 'sent' | 'delivered' | 'read' | 'error';
  type: 'text' | 'error';
  fileUrl?: string;
  fileName?: string;
} 