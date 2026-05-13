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
    console.log({ noteId })
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
    console.log({ noteData })
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