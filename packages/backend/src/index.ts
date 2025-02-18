// import express from "express";
// import cors from "cors";

// const app = express();
// app.use(cors());
// app.use(express.json());

// app.post("/login", (req, res) => {
//   res.json({ message: "Login successful" });
// });

// const PORT = 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

/////

//const dotenv = require('dotenv');
import app from "./app";

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// dotenv.config();

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  // console.log(err.name, err.message);
  console.log(process.env.MONGO_USER);
  console.log(process.env.MONGO_PASS);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
