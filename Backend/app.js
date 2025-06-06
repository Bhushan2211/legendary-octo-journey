 const express = require('express');
 const mongoose = require('mongoose');
 const path = require('path');
 const cors = require('cors');
 require('dotenv').config();
 const authRoutes = require('./routes/authRoutes');
 const imageRoutes = require('./routes/imageRoutes');

 
 const app = express();
 app.use(cors());
 app.use(express.json());
 app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


 mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Database Connected'))
    .catch((err) => console.log('error', err));
      
app.use('/api/auth', authRoutes);
app.use('/api/images', imageRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>  console.log('Server running on port ${PORT}'));