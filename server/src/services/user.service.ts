import User from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";


interface UserService{
    firstName:string;
    lastName:string;
    email:string;
    phoneNumber:string;
    password:string;
    verifyCode:string;
    verifyCodeExpire:Date;
    isVerified:boolean;
}
export const registerService = async ({firstName,lastName,email,phoneNumber,password,verifyCode,verifyCodeExpire,isVerified}: UserService) => {
    if(!firstName || !lastName || !email || !phoneNumber || !password){
        throw new ApiError(400,"All fields are required")
    }
  const user = new User({
    fullName:{
        firstName,
        lastName
    },
    email,
    phoneNumber,
    password,
    verifyCode,
    verifyCodeExpire,
    isVerified
  });
  await user.save()
  return user;
};
