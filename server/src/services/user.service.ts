import User from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import type { RegisterInput, LoginInput } from "../validator/auth.schema.js";


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

// export const loginService = async (data: LoginInput) => {
//   const user = await User.findOne({ email: data.email }).select("+password");
//   if (!user) throw new Error("Invalid email or password");

//   const isMatch = await user.comparePassword(data.password);
//   if (!isMatch) throw new Error("Invalid email or password");

//   return user;
// };
