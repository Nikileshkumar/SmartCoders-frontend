import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Paper,
  Stack,
  Slide,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';

interface AskLloydChatBotProps {
  journeyType?: string;
  appId?: number;
}

type SenderType = 'bot' | 'user';

interface Message {
  sender: SenderType;
  text: string;
}

const AskLloydChatBot: React.FC<AskLloydChatBotProps> = ({ journeyType, appId }) => {
  const [open, setOpen] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: "Hi! I'm Finly 🤖. Need help or have feedback?" }
  ]);
  const [input, setInput] = useState<string>('');
  const [submitted, setSubmitted] = useState<boolean>(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    const newMessages: Message[] = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');

    try {
      await axios.post('http://localhost:8080/api/customerfeedback', {
        applicationid: appId,
        feedback: input,
        timestamp: new Date().toISOString()
      });

      const botReply: Message = {
        sender: 'bot',
        text: 'Thanks! Feedback received by AskLLOYD.'
      };
      setMessages([...newMessages, botReply]);
      setSubmitted(true);
    } catch (error) {
      const errorReply: Message = {
        sender: 'bot',
        text: 'Oops! Something went wrong. Try again later.'
      };
      setMessages([...newMessages, errorReply]);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 16, right: 16, zIndex: 1300 }}>
      {open ? (
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <Paper elevation={4} sx={{ width: isMobile ? '90vw' : 320, height: 400, display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
            <Box
              sx={{
                bgcolor: 'success.main',
                color: 'white',
                px: 2,
                py: 1.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8
              }}
            >
              <Typography fontWeight={600}>Finly Chat</Typography>
              <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: 'white' }}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
            <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 1 }}>
              <Stack spacing={1}>
                {messages.map((msg, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      alignSelf: msg.sender === 'bot' ? 'flex-start' : 'flex-end',
                      bgcolor: msg.sender === 'bot' ? 'success.light' : 'primary.light',
                      color: 'black',
                      px: 1.5,
                      py: 1,
                      borderRadius: 1.5,
                      maxWidth: '80%'
                    }}
                  >
                    <Typography variant="body2">{msg.text}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
            {!submitted && (
              <Box sx={{ px: 2, py: 1, borderTop: '1px solid #ccc' }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Type your feedback..."
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  InputProps={{
                    endAdornment: (
                      <Button onClick={handleSend} sx={{ ml: 1 }} variant="contained" size="small">
                        Send
                      </Button>
                    )
                  }}
                />
              </Box>
            )}
          </Paper>
        </Slide>
      ) : (
        <IconButton
          color="success"
          sx={{ bgcolor: 'success.main', color: 'white', width: 56, height: 56 }}
          onClick={() => setOpen(true)}
        >
          <ChatIcon />
        </IconButton>
      )}
    </Box>
  );
};

export default AskLloydChatBot;
