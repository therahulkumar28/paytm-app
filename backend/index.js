const express = require('express');
const app = express();
const mainRouter = require('./routes/index');
const dotenv = require("dotenv");
const connectDB = require('./config/db')
const cors = require('cors');

app.use(cors());
app.use(express.json());

dotenv.config();

connectDB();


// Using the mainRouter for all routes starting with '/api'
app.use('/api', mainRouter);

// Start the server
app.get('/', function (req, res) {
  res.send("Hi there");
});

const PORT =3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

