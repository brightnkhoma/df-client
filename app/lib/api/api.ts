
import { mainPath } from "@/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


const onError = (error : any)=>{
     console.error("Server Error Details:", {
    status: error?.response?.status,
    statusText: error?.response?.statusText,
    data: error?.response?.data,
    headers: error?.response?.headers,
    config: error?.config
  });

  let errorMessage = "Something went wrong, please try again later.";
  
  if (error?.response?.data) {
    const serverResponse = error.response.data;
    
    if (typeof serverResponse === 'object') {
      if (serverResponse.message && serverResponse.message !== "Request failed with status code 500") {
        errorMessage = serverResponse.message;
      } else if (serverResponse.error) {
        errorMessage = serverResponse.error;
      } else if (serverResponse.details) {
        errorMessage = serverResponse.details;
      } else if (Object.keys(serverResponse).length > 0) {
        const firstKey = Object.keys(serverResponse)[0];
        if (typeof serverResponse[firstKey] === 'string') {
          errorMessage = serverResponse[firstKey];
        }
      }
    } else if (typeof serverResponse === 'string') {
      errorMessage = serverResponse;
    }
  } else if (error?.code === 'ERR_BAD_RESPONSE') {
    errorMessage = "Server returned an invalid response. Please try again.";
  } else if (error?.message && !error.message.includes("Request failed with status code")) {
    errorMessage = error.message;
  }

    return NextResponse.json({success : false, message : errorMessage || "Something went wrong, please try again later."})
}


const onGetToken = async()=>{
    const token = (await cookies()).get("watch")?.value;
    if(!token) throw new Error("Token not found");
    return token;
}

export async function onPatch<T>(endPoint : string,data : Record<string,string>,key : string) {
    try {
        const path = mainPath + "/" + endPoint;
        const token = await onGetToken()
        const res = await axios.patch(path,data,{headers : {Authorization : `Bearer ${token}`}});
        if(res.status == 200 && res.data.success){
            return NextResponse.json({success : true,[key] : res.data[key] as T})
        }
        return onError(res)
        
    } catch (error) {
        console.log(error);
        return onError(error)
        
    }
    
}

export async function onPost<T>(endPoint : string,data : Record<string,string>,key : string,requireToken : boolean = true) {
    try {
        console.log("llllllllllllllllllllllllllllllllllll");
        
        const path = mainPath + "/" + endPoint;
        const token = requireToken ? await onGetToken() : ""
        const res = await axios.post(path,data,{headers : {Authorization : `Bearer ${token}`}});
        if(res.status == 200 && res.data.success){
            return NextResponse.json({success : true,[key] : res.data[key] as T})
        }
        return onError(res)
        
    } catch (error) {
        console.log(error);
        return onError(error)
        
    }
    
}

export async function onPut<T>(endPoint : string,data : Record<string,string>,key : string) {
    try {
        const path = mainPath + "/" + endPoint;
        const token = await onGetToken()
        const res = await axios.put(path,data,{headers : {Authorization : `Bearer ${token}`}});
        if(res.status == 200 && res.data.success){
            return NextResponse.json({success : true,[key] : res.data[key] as T})
        }
        return onError(res)
        
    } catch (error) {
        console.log(error);
        return onError(error)
        
    }
    
}
export async function onDelete(endPoint : string) {
    try {
        const path = mainPath + "/" + endPoint;
        const token = await onGetToken()
        const res = await axios.delete(path,{headers : {Authorization : `Bearer ${token}`}});
        if(res.status == 200 && res.data.success){
            return NextResponse.json({success : true})
        }
        return onError(res)
        
    } catch (error) {
        console.log(error);
        return onError(error)
        
    }
    
}




export async function onGet(endPoint : string,key : string,sendToken :boolean = true) {
      try {
        const path = mainPath + "/" + endPoint;
        let token = ""
        if(sendToken){
           token = await onGetToken()
        }else{
            try {
                token = await onGetToken()
            } catch (error) {
                console.log(error);
                
            }
        }
        const res = await axios.get(path,{headers : {Authorization : `Bearer ${token}`}});
        if(res.status == 200 && res.data.success){            
            return NextResponse.json({success : true,[key] : res.data[key] })
        }
        return onError(res)
        
    } catch (error) {
        console.log(error);
        return onError(error)
        
    }
}
export async function onQuery(endPoint : string,data : any,key : string,sendToken :boolean = true) {
      try {
        
        const path = mainPath + "/" + endPoint;
        let token = ""
        if(sendToken){
           token = await onGetToken()
        }
        const res = await axios.get(path,{headers : {Authorization : `Bearer ${token}`},params : {query : data}});
        if(res.status == 200 && res.data.success){            
            return NextResponse.json({success : true,[key] : res.data[key] })
        }
        return onError(res)
        
    } catch (error) {
        console.log(error);
        return onError(error)
        
    }
}



