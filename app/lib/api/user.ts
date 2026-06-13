import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { mainPath } from "@/constants";
import { cookies } from "next/headers";
import { onGet, onPost } from "./api";

export async function login(data: any) {
  try {
    
    const res = await axios.post(`${mainPath}/auth/login`, data.props);

    const token = res.data.token;

    if (token) {
      const response = NextResponse.json({
        success: true,
        message: res.data.message || "Login success",
      });

      response.cookies.set({
        name: "df",
        value: token,
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    return NextResponse.json({
      success: false,
      message: res.data.message || "Login Failed",
    });

  } catch (error: any) {

    const message =
      error.response?.data?.message ||
      error.message ||
      "Login Failed, Something went wrong";

    return NextResponse.json({
      success: false,
      message,
    });
  }
}

export const otp = async(data : any)=>{
 
  
  
  const res =await axios.post(`${mainPath}/auth/otp`,data);
        if (res.status === 200) {
      const token = res.data.token;
      if (token) {
        const response = NextResponse.json({ success: true, message:res.data.message || "Login success" });

        response.cookies.set({
            name: "df-otp-token",
            value: token,
            httpOnly: true,
            secure: false,      
            sameSite: "lax",      
            path: "/",
            maxAge: 60 * 20,
            });


        return response;
      }
    }

    return NextResponse.json({
      success: false,
      message:res.data.message || "Signup Failed, Please make sure credentials are correct",
    });
}

export const logout = async () => {
   (await cookies()).delete("watch-otp-token");
   return NextResponse.json({
    success: true,
    message: "Logout successful"
   });
}
export const verifyotp = async (data: any) => {
  try {
    const token = (await cookies()).get("df-otp-token")?.value;

    const endpoint = `${mainPath}/auth/otp/verify`;

    const res = await axios.post(endpoint, data, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return NextResponse.json({
      success: true,
      message: res.data.message || "Login success"
    });

  } catch (error: any) {

    const message =
      error.response?.data?.message ||
      error.message ||
      "OTP Verification Failed";

    return NextResponse.json({
      success: false,
      message
    });
  }
};





export const signUp = async(data : any)=>{
    const endpoint = `auth/signup`;
    return await onPost(endpoint,data,"success",false)
}


export const me = async ()=>{
    return await onGet("auth/me","user")
}
export const isAdmin = async ()=>{
    return await onGet("auth/admin","isAdmin")
}