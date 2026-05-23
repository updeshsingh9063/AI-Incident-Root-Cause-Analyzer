import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.DATABASE_URL || 'mongodb://localhost:27017/incidents';
    const conn = await mongoose.connect(mongoURI);
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: any) {
    logger.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
