const mongoseDb = require("mongoose");
mongoseDb.set("strictQuery", true);

const connectMongoDb  = async()=>{
    try {
        await mongoseDb.connect(process.env.URL_DB,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("kết nối db thành công");
        
    } catch (error) {
        console.error("Lỗi kết nối DB", error);
    }
}
module.exports = connectMongoDb;