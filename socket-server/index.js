const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

const app = express();
app.use(express.json());

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  const { clinicId, queueId } = socket.handshake.query;

  if (clinicId) socket.join(`clinic:${clinicId}`);
  if (queueId) socket.join(`queue:${queueId}`);

  socket.on('subscribe_queue', (qId) => socket.join(`queue:${qId}`));
  socket.on('unsubscribe_queue', (qId) => socket.leave(`queue:${qId}`));
});

app.post('/emit', (req, res) => {
  const { type, clinicId, queueId, entryId, timestamp } = req.body;

  if (!type || !clinicId || !queueId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const event = { type, clinicId, queueId, entryId, timestamp: timestamp || new Date().toISOString() };

  io.to(`clinic:${clinicId}`).emit('queue_event', event);
  io.to(`queue:${queueId}`).emit('queue_event', event);

  res.json({ success: true });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', clients: io.engine.clientsCount });
});

httpServer.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
