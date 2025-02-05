const mongoose = require('mongoose');
const connection = "mongodb://localhost:27017/liveAt";

const MongoDB = async () => {
    try{
        await mongoose.connect(connection);
        console.log("MongoDB Connected...")
    }catch(err){
        console.log(err.message)
    }
}

module.exports = MongoDB;