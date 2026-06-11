import { NextResponse } from "next/server";
import crypto from "crypto";


export const getCloudinarySignature = async () => {
          const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = `timestamp=${timestamp}`;

    const signature = crypto
        .createHash("sha1")
        .update(paramsToSign + process.env.CLOUDINARY_API_SECRET)
        .digest("hex");
         return NextResponse.json({
        timestamp,
        signature,
        apiKey: process.env.CLOUDINARY_API_KEY,
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    });
}


