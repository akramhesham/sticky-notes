import { SYS_MESSAGE } from "../../common/constant/message.constant.js";
import { hash } from "../../common/utils/bcrypt.utils.js";
import { encryption } from "../../common/utils/encryption.utils.js";
import { ConflictException } from "../../common/utils/error.utils.js";
import { usersRepository } from "../../DB/models/users/users.repository.js"

export const checkUserExist=async(email)=>{
    return await usersRepository.getOne(email);
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