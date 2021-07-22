//require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(MONGO_CONNECTION_URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
    console.log('DataBase Connected!');
}).catch((error => {
    console.log('Connection failed: ' + error);
}));

