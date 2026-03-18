import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import fileRoutes from './routes/fileRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Middleware
const corsOptions = {
  origin: process.env.CLIENT_URL || '*', // Fallback to * if CLIENT_URL is not set for local dev
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// Routes
app.use('/api/files', fileRoutes);
app.use('/api/users', userRoutes);

// Root Status Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'online',
    message: 'MeghOS Backend Infrastructure is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Database Connection & Server Start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL ERROR: MONGO_URI environment variable is not defined.');
  process.exit(1);
}

mongoose.set('strictQuery', false); // Prepare for Mongoose 7/8 changes
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Server fully operational on port ${PORT}`);
      console.log(`🌐 Accepting requests from: ${process.env.CLIENT_URL || 'All Origins'}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
