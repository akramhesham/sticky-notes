import { DBRepository } from "../../db.repository.js";
import { Users } from "./users.model.js";

class UsersRepository extends DBRepository{
      constructor(){
        super(Users);
      }
}

export const usersRepository=new UsersRepository(); 