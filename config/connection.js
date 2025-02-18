const mongoose = require('mongoose');
const connection = "mongodb+srv://ishimwechristia94:Password%401@cluster0.lm0fi.mongodb.net/liveatrwanda";
// const connection = "mongodb://localhost:27017/liveAt";

const MongoDB = async () => {
    try{
        await mongoose.connect(connection);
        console.log("MongoDB Connected...")
    }catch(err){
        console.log(err.message)
    }
}

module.exports = MongoDB;