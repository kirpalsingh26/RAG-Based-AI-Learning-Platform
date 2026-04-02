import mongoose from 'mongoose';

const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is missing in environment variables');
  }

  await mongoose.connect(mongoUri, {
    autoIndex: true,
  });

  // eslint-disable-next-line no-console
  console.log('MongoDB connected');
};

export default connectDatabase;
