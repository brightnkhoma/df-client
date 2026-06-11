import axios, { AxiosResponse } from "axios";
import { User } from "../types/user";
import { LoginProps } from "../types/loginProps";
import { SignUpProps } from "../types/signUpProps";
import { showToast } from "../toast/toast";

export class AppAuth{
      resReturn( res: AxiosResponse<any, any, {}>){
            if(!res.data.success){
                showToast("info",{description : res.data.message})
            }
            return res.data.success as boolean;
        }
    async me(){
        
        const res = await axios.get("/api/auth",{params : {type : "me"}});
        
        if(res.data.success){
            return res.data.user as User;
        }
        return null;
    }

    async login(props : LoginProps){
        const res = await axios.post(`/api/auth`,{props,type : "login"});
        return this.resReturn(res)
    }

    async getOTP(props : SignUpProps){
        const res = await axios.post(`/api/auth`,{props,type : "otp"});
        return res.data.success as boolean;
    }
    async verifyOTP(otp : string){
            const res = await axios.post(`/api/auth`,{otp,type : "verify"});
        return this.resReturn(res)
     
    }

    async logout(){
        try {
            const res = await axios.post(`/api/auth`,{type : "logout"});
            return this.resReturn(res)
        } catch (error) {
            console.log(error);
            return false;
            
        }
    }
}