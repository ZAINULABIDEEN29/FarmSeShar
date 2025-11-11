import axios, {AxiosError} from "axios";
import config from "@/conf/conf";


export const api = axios.create({
    baseURL: config.backenedURL,
    withCredentials: true,
    headers:{
        "Content-Type":"application/json"
    }
})


api.interceptors.response.use(
    (response) => response,
    (error:AxiosError)=> {
        if(error.response?.status === 401){
            const currentPath = window.location.pathname;
            if(currentPath !== "/login" && currentPath !== "/register"){
                window.location.href = "/login"
            }
        }
        return Promise.reject(error)
    }
)


export default api;

