const mongoose = require('mongoose')

const DB = process.env.MONGODB_CONN;

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => {
    console.log(`******************Connection successful******************`);
}).catch((err) => {
    console.log(`No connection`, err);
})