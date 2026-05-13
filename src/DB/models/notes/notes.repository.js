import { DBRepository } from "../../db.repository.js";
import { Notes } from "./notes.model.js";

class NotesRepository extends DBRepository{
    constructor(){
       super(Notes);
    }
}

export const notesRepository=new NotesRepository();