const mongoose = require('mongoose');
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(`mongodb://localhost:27017/BookMyCourt`, {
        useNewUrlParser: true,
      });
      console.log(`connectDB`);
    } catch (error) {
      console.error(error.message);
      process.exit(1);
    }
  }
  module.exports = connectDB;  