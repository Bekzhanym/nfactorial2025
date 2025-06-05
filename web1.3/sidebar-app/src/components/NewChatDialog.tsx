import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControlLabel,
  Switch
} from '@mui/material';
import { useState } from 'react';

interface NewChatDialogProps {
  open: boolean;
  onClose: () => void;
  onCreateChat: (name: string, isAI: boolean) => void;
  type: 'regular' | 'ai';
}

export const NewChatDialog = ({ open, onClose, onCreateChat, type }: NewChatDialogProps) => {
  const [name, setName] = useState('');
  const [isAI] = useState(type === 'ai');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreateChat(name.trim(), isAI);
      setName('');
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {type === 'ai' ? 'Новый AI чат' : 'Новый контакт'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={type === 'ai' ? 'Название AI чата' : 'Имя контакта'}
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            required
          />
          {type === 'ai' && (
            <FormControlLabel
              control={<Switch checked={true} disabled />}
              label="AI ассистент"
              sx={{ mt: 2 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Отмена</Button>
          <Button type="submit" variant="contained" disabled={!name.trim()}>
            Создать
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 