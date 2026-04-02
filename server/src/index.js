import dotenv from 'dotenv';

dotenv.config();

import app from './app.js';
import connectDatabase from './config/db.js';

const PORT = process.env.PORT || 5001;

const bootstrap = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error);
  process.exit(1);
});
