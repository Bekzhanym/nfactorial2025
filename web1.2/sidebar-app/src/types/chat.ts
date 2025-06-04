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
  status: 'sent' | 'delivered' | 'read';
  type: 'text';
  fileUrl?: string;
  fileName?: string;
} 