import app from './app.js';
import { connectDB } from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();

    app.listen(PORT, () => {
      console.log(`=============================================`);
      console.log(`🚀 Hostel Management Backend Running`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🛠  Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`=============================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
