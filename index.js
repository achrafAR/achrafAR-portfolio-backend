import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';

dotenv.config();

const app = express();

// MongoDB connection URI
const uri = process.env.MONGODB_URI;

// Connect to MongoDB without deprecated options
mongoose.connect(uri)
  .then(() => {
    console.log('Connected to MongoDB');
    // Start your Express server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use(cors());

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.send('Hello world');
});
