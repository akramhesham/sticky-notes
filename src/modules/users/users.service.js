import { SYS_MESSAGE } from "../../common/constant/message.constant.js";
import { compare, hash } from "../../common/utils/bcrypt.utils.js";
import { encryption } from "../../common/utils/encryption.utils.js";
import { ConflictException } from "../../common/utils/error.utils.js";
import { generateTokens, verifyToken } from "../../common/utils/jwt.utils.js";
import { usersRepository } from "../../DB/models/users/users.repository.js"

export const checkUserExist=async(filter)=>{
    return await usersRepository.getOne(filter);
}

export const createUser=async(body)=>{
    return await usersRepository.create(body);
}

export const signUp=async(body)=>{
    const {name,email}=body;
    const userCheck=await checkUserExist({
        $or:[{
            name:{$eq:name,$ne:null,$exists:true}
        },{
            email:{$eq:email,$ne:null,$exists:true}
        }]
    })
    if(userCheck){
        throw new ConflictException(SYS_MESSAGE.users.alreadyExist)
    }else{
        body.password=await hash(body.password);
        body.phone=encryption(body.phone);
        const data=await createUser(body);
        return data;
    }
}

export const login=async(body)=>{
    const {email,password}=body;
    const userCheck=await checkUserExist({email:{$eq:email,$ne:null,$exists:true}});
    const match=await compare(password,userCheck?.password||'sdfsdfdfdsfdsfsd');
    if(!userCheck){
        throw new ConflictException("Invalid email or password");
    }
    if(!match){
        throw new ConflictException("Invalid email or password");
    }
    const {accessToken,refreshToken}=generateTokens({sub:userCheck._id});
    const userData=JSON.parse(JSON.stringify(userCheck));
    delete userData.password;
    return {accessToken,refreshToken};
}

export const updateData=async(data,authorization)=>{
    const payload=verifyToken(authorization,'gdfggfdgfdgfd');
    const{email}=data;
    const userId=payload.sub;
    delete data.password;
    const isUserExist=await checkUserExist({_id:userId})
    if(!isUserExist){
        throw new ConflictException(`User ${SYS_MESSAGE.users.notFound}`)
    }
    const isAvailableMail=await checkUserExist({email:{$eq:email,$ne:null,$exists:true},_id:{$eq:userId}});
    if(isAvailableMail){
        throw new ConflictException(`Email ${SYS_MESSAGE.users.alreadyExist}`)
    }
        await usersRepository.update({_id:userId},data)
}

export const deleteUser=async(authorization)=>{
    const payload=verifyToken(authorization,'gdfggfdgfdgfd');
    const userId=payload.sub;
    const isUserExist=await checkUserExist({_id:userId});
    if(!isUserExist){
        throw new ConflictException(`User ${SYS_MESSAGE.users.notFound}`)
    }
    await usersRepository.deleteOne({_id:userId});
}

export const getUserData=async(authorization)=>{
    const payload=verifyToken(authorization,'gdfggfdgfdgfd');
    const userId=payload.sub;
    const isUserExist=await checkUserExist({_id:userId});
    if(!isUserExist){
        throw new ConflictException(`User ${SYS_MESSAGE.users.notFound}`)
    }
    const userData=await usersRepository.getOne({_id:userId});
    return userData;
}