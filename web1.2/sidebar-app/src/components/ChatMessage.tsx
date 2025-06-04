import { Box, Typography, Paper } from '@mui/material';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import type { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
  isOutgoing: boolean;
}

export const ChatMessage = ({ message, isOutgoing }: ChatMessageProps) => {
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sent':
        return <DoneIcon fontSize="small" sx={{ opacity: 0.5 }} />;
      case 'delivered':
        return <DoneAllIcon fontSize="small" sx={{ opacity: 0.5 }} />;
      case 'read':
        return <DoneAllIcon fontSize="small" color="primary" />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOutgoing ? 'flex-end' : 'flex-start',
        mb: 1,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          p: 1.5,
          maxWidth: '70%',
          bgcolor: isOutgoing ? 'primary.light' : 'grey.100',
          borderRadius: 2,
        }}
      >
        {message.type === 'text' && (
          <Typography variant="body1">{message.text}</Typography>
        )}
        
        {message.type === 'image' && (
          <Box
            component="img"
            src={message.fileUrl}
            alt="Изображение"
            sx={{
              maxWidth: '100%',
              borderRadius: 1,
            }}
          />
        )}
        
        {message.type === 'file' && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 1,
              bgcolor: 'background.paper',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2">{message.fileName}</Typography>
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: 0.5,
            mt: 0.5,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            {message.timestamp}
          </Typography>
          {isOutgoing && getStatusIcon()}
        </Box>
      </Paper>
    </Box>
  );
}; 