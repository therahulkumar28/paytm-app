const mongoose = require('mongoose');


console.log(process.env.MONGODB_URI)
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
          
          
        });

        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(); // Exit the process with failure (1 indicates failure)
    }
};

module.exports = connectDB;
