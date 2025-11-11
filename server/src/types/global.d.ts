import {User} from "../models/user.model.ts"
import Farmer from "../models/farmer.model.ts"
declare global{
    namespace Express {
        interface Request{
            user?:User,
            farmer?:farmer
        }
    
    }
}