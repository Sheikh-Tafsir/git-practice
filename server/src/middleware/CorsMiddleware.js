const cors = require('cors');
import dotenv from "dotenv";

dotenv.config();

const corsOptions = {
  origin: process.env.CLIENT_PATH || "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Add the HTTP methods you need
  allowedHeaders: ["Content-Type", "Authorization"], // Add the headers you want to allow
  credentials: true,
};

const CorsMiddleware = cors(corsOptions);

export default CorsMiddleware
