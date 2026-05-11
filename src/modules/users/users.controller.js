import { Router } from "express";
import { signUp } from "./users.service.js";
import { SYS_MESSAGE } from "../../common/constant/message.constant.js";

const router=Router();

router.post('/signup',async(req,res,next)=>{
    const userData=await signUp(req.body);
    return res.status(201)
    .json({message:SYS_MESSAGE.users.created
        ,success:true
        ,data:{userData}})
})

export default router;