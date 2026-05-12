import { Router } from "express";
import { deleteUser, getUserData, login, signUp, updateData } from "./users.service.js";
import { SYS_MESSAGE } from "../../common/constant/message.constant.js";

const router = Router();

router.post('/signup', async (req, res, next) => {
    const userData = await signUp(req.body);
    return res.status(201)
        .json({
            message: SYS_MESSAGE.users.created
            , success: true
            , data: { userData }
        })
})

router.post('/login', async (req, res, next) => {
    const { refreshToken, accessToken } = await login(req.body);
    return res.status(201).json({ message: SYS_MESSAGE.users.login, token: refreshToken });
})

router.patch('/', async (req, res, next) => {
    const { authorization } = req.headers;
    const data = req.body;
    await updateData(data, authorization);
    return res.status(201)
        .json({
            message: 'User updated'
            , success: true
        })
})

router.delete('/', async (req, res, next) => {
    const { authorization } = req.headers;
    await deleteUser(authorization);
    return res.status(200)
        .json({
            message: "User deleted"
            , success: true
        })
})

router.get('/',async(req,res,next)=>{
    const {authorization}=req.headers;
    const userData=await getUserData(authorization);
    return res.status(200).json({message:'done',success:true,data:{userData}});
})

export default router;