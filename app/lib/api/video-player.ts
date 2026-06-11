import { RefObject } from "react";
import { Video } from "../types/video";
import { Server } from "./server";
import { BaseManager } from "./baseManager";
import { TXN } from "../types/txn";



export class VideoPlayerManager{
    ref : RefObject<HTMLVideoElement | null> ;
    video : Video | null =null
    updateLoadingState : ((state : boolean)=>void);
    db : BaseManager<Video>;
    txnDb : BaseManager<TXN>;
    constructor(ref : RefObject<HTMLVideoElement | null>,db :BaseManager<Video>,txnDb : BaseManager<TXN>,onVideoFetch : (state : boolean)=>void){
        this.db = db;
        this.txnDb = txnDb;
        this.ref = ref
        this.updateLoadingState = onVideoFetch
        this.updateLoadingState = this.updateLoadingState.bind(this)
        this.addListener = this.addListener.bind(this);
        this.removeListener = this.removeListener.bind(this);
    }

    async loadVideo(){
        if(this.video){
            const name = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
            const uri =`https://res.cloudinary.com/${name}/video/upload/${this.video.publicId}.m3u8`
             if(this.ref.current){
                this.ref.current.src = uri
                await this.ref.current.load();
                await this.ref.current.play()
             }
        }
    }

    async setVideoById(id : string){
        try {
            this.updateLoadingState(true)
        this.video = await this.db.get(id)
        } catch (error) {
            console.log(error);
        }finally{
            this.updateLoadingState(false)
        }

    }


    addListener<K extends keyof HTMLVideoElementEventMap>(target : K ,onListen : (this: HTMLVideoElement, ev: HTMLVideoElementEventMap[K]) =>void){
        try {
            if(this.ref && this.ref.current){
                const v = this.ref.current;
                v.addEventListener(target,onListen)
            }
        } catch (error) {
            console.log(error);
        }
        
    }
    removeListener<K extends keyof HTMLVideoElementEventMap>(target : K ,onListen : (this: HTMLVideoElement, ev: HTMLVideoElementEventMap[K]) =>void){
        try {
            if(this.ref && this.ref.current){
                const v = this.ref.current;
                v.removeEventListener(target,onListen)
            }
        } catch (error) {
            console.log(error);
        }
        
    }


}