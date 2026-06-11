import { isAdmin, login,me,signUp,otp,verifyotp, logout } from "@/app/lib/api/user";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function  POST(req : NextRequest) {
    const data = await req.json();
    const type = data.type as "login" | "signup" | "otp" | "verify" | "logout";
    switch(type){
        case "login": return await login(data);
        case "signup": return await signUp(data);
        case "otp": return await otp(data);
        case "verify": return await verifyotp(data);
        case "logout": return await logout();
    }
    
}
export async function  GET(req : NextRequest) {
    const type = req.nextUrl.searchParams.get("type") as "admin" | "me";
    switch(type){
        case "admin": return await isAdmin();
        case "me": return await me()
    }
       
}
export async function  DELETE(req : NextRequest) {
    (await cookies()).delete("watch");
    return NextResponse.json({success : true})
       
}