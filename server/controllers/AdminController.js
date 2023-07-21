const TryCatchHelper = require("../helpers/TryCatch")
const UsersModel = require("../models/Users")
const ResponseHandlers = require('../helpers/modelResponseHandlers');
const filterUserDetails = require("../helpers/filterUserDetails");

class AdminController{
    constructor(req,res){
        this.req = req,
        this.res = res,
        this.userId = req.params.userId
    }

    async getUsers(){
        const usersModel = new UsersModel();
        const [data,error] = await TryCatchHelper(() => usersModel.getUsers());
        if(error) return this.res.status(500).json({err: "Error while fetching users"});
        const filteredData = filterUserDetails(data);
        new ResponseHandlers(filteredData,this.res).getResponse();
    }

    async getUserById(){
        const usersModel = new UsersModel();
        const [data,error] = await TryCatchHelper(() => usersModel.getUserById(this.userId));
        if(error) return this.res.status(500).json({err: "Error while fetching user"});
        const filteredUserInfo = filterUserDetails(data);
        new ResponseHandlers(filteredUserInfo,this.res).getResponse();
    }

    async updateUser(){

    }

    async deleteUserById(){
        const usersModel = new UsersModel();
        const [data,error] = await TryCatchHelper(() => usersModel.deleteUser(this.userId));
        if(error) return this.res.status(500).json({err: "Error while deleting user"});
        new ResponseHandlers(data,this.res).deleteResponse();
    }

}

module.exports = AdminController