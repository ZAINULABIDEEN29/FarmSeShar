import mongoose, {Schema,Document} from "mongoose";
export interface BToken extends Document{
    token:string;
}
const tokenSchema:Schema<BToken> = new Schema({
    token:{
        type:String,
        required:[true,"Token is required"]
    }
},
{
    timestamps:true
}
)
const Token = mongoose.model<BToken>("Token",tokenSchema)
export default Token;