import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required:[true,'Please add a userName']
    },
    password: {
        type: String,
        required:[true,'plz add a password']
    }



},
{
    timestamps: true
});

const User = mongoose.model("User", userSchema);
export default User;