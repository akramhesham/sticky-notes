import { Types } from "mongoose";
import { ConflictException } from "../../common/utils/error.utils.js";
import { notesRepository } from "../../DB/models/notes/notes.repository.js";
import { tokenHead } from "../users/users.service.js"

export const createNote = async (body) => {
    const noteData = await notesRepository.create(body);
    return noteData;
}

export const createSingleNote = async (body, authorization) => {
    const userId = await tokenHead(authorization);
    body.userId = userId;
    const data = await createNote(body);
    return data;
}

export const noteExist = async (noteId) => {
    return await notesRepository.getOne(noteId);
}

export const updateNote = async (authorization, noteId, data) => {
    const headUserId = await tokenHead(authorization);
    const noteData = await noteExist({ _id: noteId });
    if (!noteData) {
        throw new ConflictException('Note not found');
    }
    const NoteUserId = noteData.userId.toString();
    if (headUserId != NoteUserId) {
        throw new ConflictException('You are not the owner');
    }
    return await notesRepository.update({ _id: noteId }, data)
}

export const replaceNote = async (authorization, noteId, data) => {
    const headUserId = await tokenHead(authorization);
    const noteData = await noteExist({ _id: noteId });
    if (!noteData) {
        throw new ConflictException('Note not found');
    }
    const NoteUserId = noteData.userId.toString();
    if (headUserId != NoteUserId) {
        throw new ConflictException('You are not the owner');
    }
    return await notesRepository.replace({ _id: noteId }, data);
}

export const updateAllFields = async (authorization, data) => {
    const headUserId = await tokenHead(authorization);
    const noteData = await noteExist({ userId: new Types.ObjectId(headUserId) });
    if (!noteData) {
        throw new ConflictException('No note found');
    }
    await notesRepository.updateAll({ userId: headUserId }, data);
}
export const checkOwnerNotes = async (authorization, noteId) => {
    const headUserId = await tokenHead(authorization);
    const noteData = await noteExist({ _id: noteId });
    if (!noteData) {
        throw new ConflictException('Note not found');
    }
    const noteUserId = noteData.userId.toString();
    if (headUserId != noteUserId) {
        throw new ConflictException('You are not the owner');
    }
    return noteData;
}
export const deleteNote = async (authorization, noteId) => {
    const noteData = await checkOwnerNotes(authorization, noteId);
    await notesRepository.deleteOne({ _id: noteId });
    return noteData;
}

export const getNote = async (authorization, noteId) => {
    const noteData = await checkOwnerNotes(authorization, noteId);
    await notesRepository.getOne({_id:noteId});
    return noteData;
}

export const getNoteByContent=async(authorization,content)=>{
    const headUserId = await tokenHead(authorization);
    const notes=await notesRepository.getOne({content});    
    if(!notes){
        throw new ConflictException('No note found');
    }
    return notes;
}

export const paginatedSort=async(authorization,page,limit)=>{
    const headUserId=await tokenHead(authorization);
    const noteData=await notesRepository.getAll({userId:new Types.ObjectId(headUserId)},{},{
        sort:{createdAt:-1},
        limit,
        skip:(page-1)*limit
    })
    if(!noteData.length){
        throw new ConflictException('No notes found')
    }
    return noteData;
}

export const noteWithUser=async(authorization)=>{
    const headUserId=await tokenHead(authorization);
    const noteData=await notesRepository.getAll({userId:new Types.ObjectId(headUserId)},{
        title:1,userId:1,createdAt:1
    },{
        populate:{
            path:'userId',
            select:'email -_id'
        }
    })
    if(!noteData.length){
        throw new ConflictException('No note found')
    }
    return noteData;
}

export const aggregateNotesByTitle=async(authorization,title)=>{
    const headUserId=await tokenHead(authorization);
    const noteData=await notesRepository.getAll({title},{
        title:1,userId:1,createdAt:1,user:1
    },{
        populate:{
            path:'userId',
            select:'name email'
        }
    })
    const result=noteData.map((note)=>{
        const noteObject=note.toObject();
        return {
            title:noteObject.title,
            userId:noteObject.userId._id,
            createdAt:noteObject.createdAt,
            user:{
                name:noteObject.userId.name,
                email:noteObject.userId.email
            }
        }
    })
    if(!result.length){
        throw new ConflictException('No note found')
    }
    return result;    
}

export const deleteNotes=async(authorization)=>{
    const headUserId=await tokenHead(authorization);
    const deletedNote=await notesRepository.deleteMany({userId:new Types.ObjectId(headUserId)});
}