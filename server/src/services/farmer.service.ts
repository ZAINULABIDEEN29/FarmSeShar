import Farmer from "../models/farmer.model.js"
import { ApiError } from "../utils/ApiError.js"


export const registerFarmerService = async ({firstName,lastName,cnic,email,phoneNumber,farmName,farmLocation,farmDescription,accountHolderName,bankAccountNumber,verifyCode,verifyCodeExpire,isVerified,password}:any)=>{

    if(!firstName || !lastName || !cnic || !email || !phoneNumber || !farmName || !farmLocation || !farmDescription || !accountHolderName || !bankAccountNumber || !password){
        throw new ApiError(401,"All fields are required")
    }
    const farmer = new Farmer({
        fullName:{
            firstName,
            lastName
        },
        cnic,
        email,
        phoneNumber,
        farmName,
        farmLocation,
        farmDescription,
        accountHolderName,
        bankAccountNumber,
        verifyCode,
        verifyCodeExpire,
        isVerified,
        password
    })

    await farmer.save();
    return farmer;

}