import { Router } from "express";
import { aggregateNotesByTitle, createSingleNote, deleteNote, deleteNotes, getNote, getNoteByContent, noteWithUser, paginatedSort, replaceNote, updateAllFields, updateNote } from "./notes.service.js";
import { ConflictException } from "../../common/utils/error.utils.js";

const router=Router();

router.post('/',async(req,res,next)=>{
    const {authorization}=req.headers;
    const noteData=await createSingleNote(req.body,authorization);
    return res.status(200).json({message:"Note created",success:true,data:{noteData}})
})

router.patch('/all',async(req,res,next)=>{
    const {authorization}=req.headers;
    await updateAllFields(authorization,req.body);
    return res.status(201).json({message:'All notes updated',success:true});
})

router.patch('/:noteId',async(req,res,next)=>{
    const {authorization}=req.headers;
    const {noteId}=req.params;
    const noteData=await updateNote(authorization,noteId,req.body);
    return res.status(201).json({message:'updated',success:true,note:{noteData}})
})

router.patch('/replace/:noteId',async(req,res,next)=>{
    const {authorization}=req.headers;
    const {noteId}=req.params;
    const noteData=await replaceNote(authorization,noteId,req.body);
    return res.status(201).json({message:'updated',success:true,note:{noteData}})
})

router.delete('/:noteId',async(req,res,next)=>{
    const {authorization}=req.headers;
    const {noteId}=req.params;
    const deletedData=await deleteNote(authorization,noteId);
    return res.status(200).json({message:'deleted',success:true,note:deletedData});
})

router.get('/paginate-sort',async(req,res,next)=>{
    const {page,limit}=req.query;
    const {authorization}=req.headers;
    const noteData=await paginatedSort(authorization,page,limit);
    return res.status(201).json({message:noteData,success:true});
})

router.get('/note-by-content',async(req,res,next)=>{
    const {content}=req.query;
    const {authorization}=req.headers;
    const data=await getNoteByContent(authorization,content);
    return res.status(201).json({message:data,success:true});
})

router.get('/note-with-user',async(req,res,next)=>{
    const {authorization}=req.headers;
    const noteData=await noteWithUser(authorization);
    return res.status(201).json({message:noteData,success:true})
})

router.get('/aggregate',async(req,res,next)=>{
    const {authorization}=req.headers;
    const {title}=req.query;
    const noteData=await aggregateNotesByTitle(authorization,title);
    return res.status(201).json({message:noteData,success:true});
})

router.delete('/',async(req,res,next)=>{
    const {authorization}=req.headers;
    await deleteNotes(authorization);
    return res.status(200).json({message:'Deleted',success:true});
})

router.get('/:noteId',async(req,res,next)=>{
    const {authorization}=req.headers;
    const {noteId}=req.params;
    const noteData=await getNote(authorization,noteId);
    return res.status(200).json({message:noteData,success:true});
})

export default router;