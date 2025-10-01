// Simple test server
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Simple chatbot test endpoint
app.post('/api/chatbot', (req, res) => {
  const { message } = req.body;
  
  res.json({
    success: true,
    data: {
      response: `Test response for: ${message}`,
      suggestions: ["Test suggestion 1", "Test suggestion 2"],
      powered_by: "Test Mode"
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on port ${PORT}`);
  console.log(`🌐 Accessible at http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('❌ Server error:', err);
});
