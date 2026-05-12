const generateMessage=(entity)=>{
   return {
    alreadyExist:`already exists`,
    notFound:`not found`,
    login:`Login successfully`,
    failedToCreate:`${entity} failed to create`,
    failedToUpdate:`${entity} failed to update`,
    faildToDelete:`${entity} failed to delete`,
    created:`${entity} create successfully`,
    updated:`${entity} update successfully`,
    deleted:`${entity} delete successfully`
   }
}

export const SYS_MESSAGE={
    users:generateMessage('Users'),
    notes:generateMessage('Notes')
}