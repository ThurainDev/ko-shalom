
const mongoose = require('mongoose');
require('dotenv').config();
const Content = require('./models/Content');

const main = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to the database');

    const contents = await Content.find();
    console.log('Contents:', JSON.stringify(contents, null, 2));

    await mongoose.disconnect();
    console.log('Disconnected from the database');
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
