const prisma = require("../configs/prismaConfigs");
const prismaErrHandler = require("../errors/handlers/prismaErrHandler");
const TryCatchHelper = require("../helpers/TryCatch");

class RefreshTokenModel {
  constructor(userId, token) {
    (this.userId = userId),
      (this.token = token),
      (this.tokenClient = prisma.refreshTokens);
  }

  async addRefreshToken() {
    const [data, error] = await TryCatchHelper(() =>
      this.tokenClient.create({
        data: {
          token: this.token,
          userId: this.userId,
        },
      })
    );
    if (error) return prismaErrHandler(error);
    return data
  }

  async getRefreshToken(){
    const [data,error] = await TryCatchHelper(() => this.tokenClient.findUnique({
        where:{
            token: this.token
        }
    }))
    if (error) return prismaErrHandler(error);
    return data
  }
}

module.exports = RefreshTokenModel
