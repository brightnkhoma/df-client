
export const fn = async(state : boolean, setState : (x : boolean)=> void, callback : ()=> Promise<void> |void)=>{
    try {
        if(state) return;
        setState(true)
        return await callback();
        
    } catch (error) {
        console.log(error);
        
    }finally{
        setState(false)
    }

}