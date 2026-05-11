import { DBRepository } from "../../db.repository.js";

class NotesRepository extends DBRepository{
    constructor(){
       super(Notes);
    }
}

export const notesRepository=new NotesRepository();