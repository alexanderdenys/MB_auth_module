import { connect, set } from 'mongoose';
import { getMongoUri } from './config/mongo.config.js';

export const connectDB = () => {
  try {
    set('strictQuery', true);
    connect(getMongoUri());
    console.log('DB connected');
  } catch (e) {
    console.log('DB NOT connected');
    console.log(`Error: ${e.message}`);
  }
};
