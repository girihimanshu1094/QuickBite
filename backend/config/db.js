const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.warn(`Local MongoDB connection failed (${error.message}).`);
    console.log('Attempting to start In-Memory MongoDB for seamless offline development/viva...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`MongoDB In-Memory Server connected successfully at: ${uri}`);
    } catch (memError) {
      console.error(`Failed to connect to MongoDB: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
