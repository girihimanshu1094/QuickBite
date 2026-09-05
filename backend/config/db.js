const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is missing');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('====================================');
    console.error('MongoDB CONNECTION FAILED');
    console.error('====================================');
    console.error(error.message);
    console.error('====================================');

    process.exit(1);
  }
};

module.exports = connectDB;