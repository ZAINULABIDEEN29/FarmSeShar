import Token from "../models/blackListToken.model.js";
import User from "../models/user.model.js";




export const findUserById = async (id:string)=>{
    return await User.findById(id).select("+password")
}


export const findUserByEmail = async (email:string,includePassword:boolean=false)=>{
    if(includePassword){
        return await User.findOne({email}).select("+password")
    }
    return await User.findOne({email})
}


export const findDeletedToken = async (token:string)=>{
    return await Token.findOne({token:token})
}