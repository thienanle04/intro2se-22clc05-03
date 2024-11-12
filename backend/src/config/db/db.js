const mongoose = require('mongoose')
const dotenv = require('dotenv')
const createAdminAccount = require('../adminConfig')

dotenv.config()

async function connectToDb() {
  console.log(process.env.MONGO_URI)
  try {
    await mongoose.connect(process.env.MONGO_URI
    ).then(() => {
      console.log('Connected to the database');
      createAdminAccount();
    });
  } catch (error) {
    console.log('Connected to the database failed with error: ', error);

  }
}

module.exports = connectToDb;