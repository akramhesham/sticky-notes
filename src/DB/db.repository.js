export class DBRepository{
    nModel;
    constructor(model){
        this.nModel=model;
    }
    async create(item){
        const doc=new this.nModel(item);
        return await doc.save();
    }
    async update(filter,update,options={new:true}){
        return await this.nModel.findOneAndUpdate(filter,update,options);
    }
    async replace(filter,data,options={new:true}){
        return await this.nModel.findOneAndReplace(filter,data,options);
    }
    async updateAll(filter={},data){
        return await this.nModel.updateMany(filter,data);
    }
    async getOne(filter,projection={},options={}){
        return await this.nModel.findOne(filter,projection,options);
    }
    async getAll(filter,projection={},options={}){
        return await this.nModel.find(filter,projection,options);
    }
    async deleteOne(filter){
        return await this.nModel.deleteOne(filter)
    }
    async deleteMany(filter){
        return await this.nModel.deleteMany(filter);
    }
}