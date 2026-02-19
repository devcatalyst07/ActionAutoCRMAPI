import mongoose from 'mongoose';
import { env } from './env';

let isConnected = false;

export const connectDatabase = async (): Promise<void> => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(env.MONGODB_URI);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error);
    throw error;
  }

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB runtime error:', err);
    isConnected = false;
  });

  mongoose.connection.on('disconnected', () => {
    console.warn('MongoDB disconnected.');
    isConnected = false;
  });
};