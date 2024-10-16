const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

async function connectToDb() {
  try {
    await mongoose.connect(process.env.MONGO_URI.replace('<DB_PASSWORD>', process.env.DB_PASSWORD).replace('<DB_USERNAME>', process.env.DB_USERNAME));
    console.log('Connected to the database');
  } catch (error) {
    console.log('Connected to the database failed');
    
  }
}

module.exports = connectToDb;