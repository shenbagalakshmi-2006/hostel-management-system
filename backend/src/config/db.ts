import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export let isDbConnected = false;

export const connectDB = async (): Promise<boolean> => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/hostel_management';
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    isDbConnected = true;
    return true;
  } catch (error: any) {
    console.warn(`[Database Warning] Could not connect to local MongoDB (${error.message || 'connection failed'}).`);
    console.log(`[Database] 🚀 Switching seamlessly to In-Memory Demo Mode with realistic hostel records.`);
    isDbConnected = false;
    return false;
  }
};
