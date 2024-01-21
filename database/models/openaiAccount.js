import mongoose from "mongoose";





const Schema = mongoose.Schema;


const schema = new Schema(
    {
        login: String,
        password: String,
        status: String
    }
);





const openaiAccount = mongoose.model("OpenaiAccount", schema);





export { openaiAccount };
