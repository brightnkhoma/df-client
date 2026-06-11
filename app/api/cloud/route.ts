import { getCloudinarySignature } from "@/app/lib/api/cloudinaray";


export async function GET(){
    return await getCloudinarySignature();
}