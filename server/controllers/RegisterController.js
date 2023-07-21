const TokenGenerotor = require("../auth/jwt/generator");
const TryCatchHelper = require("../helpers/TryCatch");
const ResponseHandler = require("../helpers/modelResponseHandlers");
const RefreshTokenModel = require("../models/Tokens");
const UsersModel = require("../models/Users");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class RegisterController {
    constructor(req, res) {
      (this.req = req),
      (this.res = res)
    }

    async createUser() {
        const {firstname,lastname,username,email,password,role,idNumber,phone} = this.req.body
        const hashedPwd = await bcrypt.hash(password, 10);
        const userModel = new UsersModel(firstname, lastname, username, email, hashedPwd, role, idNumber,phone);
        const [data,error] = await TryCatchHelper(() => userModel.createNewUser());
        if(error) return this.res.status(500).json({err: "Error while creating user"});
        new ResponseHandler(data,this.res).postResponse()
    }

    async logInUser(){
      const {username,password} = this.req.body;
      const userModel = new UsersModel()
      const [data,error] = await TryCatchHelper(() => userModel.getUserByUsrName(username));
      if(error) return this.res.status(500).json({err: "Error while fetching user"});
      if(data == null) return this.res.status(401).json({msg: "Wrong Username"});

      const {password: usrPwd} = data;
      const matchPwd = await bcrypt.compare(password,usrPwd);
      if(!matchPwd) return this.res.status(401).json({msg: "Wrong Password"});

      const {accessToken, refreshToken} = TokenGenerotor(data);
      const tokenEntryRes = await new RefreshTokenModel(data.id,refreshToken).addRefreshToken();
      if(!tokenEntryRes) return this.res.status(500).json({err: "Server side error"});

      await this.res.cookie('accessToken', accessToken, {httpOnly: true, maxAge: 15 * 60 * 1000});
      return this.res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000}).status(200).json({msg: "Success"});

    }

    

}

module.exports = RegisterController
