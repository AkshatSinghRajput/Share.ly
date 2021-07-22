// require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://ChromeCorp:QWErty@765@cluster0.efepk.mongodb.net/FileSharing?retryWrites=true&w=majority", { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false }).then(() => {
    console.log('DataBase Connected!');
}).catch((error => {
    console.log('Connection failed: ' + error);
}));

