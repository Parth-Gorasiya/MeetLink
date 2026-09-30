import mongoose , {Schema} from "mongoose";

const meetingSchema = new Schema({

    user_Id : {
        type: String
    },
    meetingCode : {
        type : String,
        required : true
    },
    date: {
        type : String,
        required : true,
        default: Date.now
    }
});

const Meeting = mongoose.model("Meeting", meetingSchema);

export {Meeting};