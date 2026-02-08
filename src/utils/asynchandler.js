const asyncHandler=(requesthandler)=>{
   return  (req,res,next)=>{
        Promise.resolve(requesthandler(req,res,next)).catch((error)=>{
            next(error);
        });
    }
//async handler returns another function the 
//requesthandler is a funtcn stored in it 
//it tells that treat whatever is returned from reqhandler as a promise and then .cathc for rejected promise
//

}


export {asyncHandler}