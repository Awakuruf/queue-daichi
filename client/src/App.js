import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';
import axios from 'axios';

// Custom styled component using Material-UI styling
const StyledContainer = styled(Container)({
  marginTop: '50px',
  textAlign: 'center',
});

const StyledPaper = styled(Paper)({
  padding: '20px',
  marginBottom: '20px',
  backgroundColor: '#f5f5f5',
});

const buttonVariants = {
  hover: {
    scale: 1.1,
    transition: { yoyo: Infinity, duration: 0.3 },
  },
};

function App() {
  const [name, setName] = useState('');
  const [questionTopic, setQuestionTopic] = useState('');
  const [queue, setQueue] = useState([]);

  // Fetch the queue from the server
  const fetchQueue = async () => {
    try {
      const response = await axios.get('https://queue-daichi-server.onrender.com/queue');
      setQueue(response.data);
    } catch (error) {
      console.error('Error fetching queue:', error);
    }
  };

  // Join the queue
  const joinQueue = async () => {
    if (name.trim() !== '' && questionTopic.trim() !== '') {
      try {
        await axios.post('https://queue-daichi-server.onrender.com/join', { name, questionTopic });
        setName(''); // Clear input fields
        setQuestionTopic('');
        fetchQueue(); // Update the queue
      } catch (error) {
        console.error('Error joining queue:', error);
      }
    }
  };

  // Move to the next student
  const nextStudent = async () => {
    try {
      await axios.post('https://queue-daichi-server.onrender.com/next');
      fetchQueue(); // Update the queue
    } catch (error) {
      console.error('Error removing student:', error);
    }
  };

  // Fetch queue on component mount
  useEffect(() => {
    fetchQueue();
  }, []);

  return (
    <StyledContainer maxWidth="sm">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 150 }}
      >
        <Typography variant="h3" gutterBottom>
          Cogs 300 L02 Queue
        </Typography>

        <Box sx={{ marginBottom: 2 }}>
          <TextField
            label="Enter your name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Enter your question topic"
            variant="outlined"
            value={questionTopic}
            onChange={(e) => setQuestionTopic(e.target.value)}
            fullWidth
          />
        </Box>

        <motion.div
          variants={buttonVariants}
          whileHover="hover"
        >
          <Button variant="contained" color="primary" onClick={joinQueue} fullWidth>
            Join Queue
          </Button>
        </motion.div>

        <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
          Queue List
        </Typography>
        
        <StyledPaper elevation={3}>
          {queue.length === 0 ? (
            <Typography variant="body1">Queue is empty</Typography>
          ) : (
            queue.map((student, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.2 }}
              >
                <Typography variant="body1">
                  {index + 1}. {student.name} - {student.questionTopic}
                </Typography>
              </motion.div>
            ))
          )}
        </StyledPaper>

        <motion.div
          variants={buttonVariants}
          whileHover="hover"
        >
          <Button variant="contained" color="secondary" onClick={nextStudent} fullWidth>
            Next Student
          </Button>
        </motion.div>
      </motion.div>
    </StyledContainer>
  );
}

export default App;
