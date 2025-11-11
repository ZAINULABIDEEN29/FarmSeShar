import Farmer from "../models/farmer.model.js"


export const  findFarmerById = async(id:string)=>{
    return await Farmer.findById(id).select("+password")
}

export const findFarmerByEmail = async (email:string,includePassword:boolean=false) =>{
    if(includePassword){
        return await Farmer.findOne({email}).select("+password")
    }
    return await Farmer.findOne({email})
}