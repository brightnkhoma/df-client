import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const token = (await cookies()).get("df")?.value;

    if (!token && req.nextUrl.pathname === "/") {
        
        return NextResponse.redirect(
            new URL("/login", req.url)
        );
    }
    

    return NextResponse.next();
}

export const config = {
    matcher: ["/"],
};