import mongoose from "mongoose";





const Schema = mongoose.Schema;


const schema = new Schema(
    {
        tgId: { type: Number, required: true, unique: true },
        language: String,
        login: String,
        email: String,
        phone: String,
        direction: String,
        place: String,
        status: String
    }
);





const Account = mongoose.model("Account", schema);





export { Account };