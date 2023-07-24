const prisma = require("../configs/prismaConfigs");
const TryCatchHelper = require("../helpers/TryCatch");
const recordldGenerator = require("../generators/recordIdGen");
const prismaErrHandler = require("../errors/handlers/prismaErrHandler");

class UsersModel {
  constructor(firstname, lastname, username, email, password, role, idNumber,phone) {
    (this.firstname = firstname),
      (this.lastname = lastname),
      (this.username = username),
      (this.email = email),
      (this.password = password),
      (this.role = role),
      (this.idNumber = idNumber),
      (this.phone = phone);
  }

  async createNewUser() {
    const {data, error} = await TryCatchHelper(() =>
      prisma.user.create({
        data: {
          id: recordldGenerator("USR"),
          firstName: this.firstname,
          lastName: this.lastname,
          userName: this.username,
          email: this.email,
          password: this.password,
          role: this.role,
          idNumber: this.idNumber,
          phone: this.phone
        }
      })
    );
    if (error) prismaErrHandler(error);

    return data;
  }

  async getUsers() {
    const {data, error} = await TryCatchHelper(() => prisma.user.findMany());
    if (error) return prismaErrHandler(error);
    return data;
  }

  async getUserById(id) {
    const {data, error} = await TryCatchHelper(() =>
      prisma.user.findUnique({
        where: {
          id: id,
        },
      })
    );
    if (error) return prismaErrHandler(error);
    return data;
  }

  async getUserByUsrName(username) {
    const {data, error} = await TryCatchHelper(() =>
      prisma.user.findUnique({
        where: {
          userName: username,
        },
      })
    );
    if (error) return prismaErrHandler(error);
    return data;
  }

  async updateUser(id) {
    const {data, error} = await TryCatchHelper(() =>
      prisma.user.update({
        where: {
          id: id,
        },
        data: {
          firstName: this.firstname,
          lastName: this.lastname,
          idNumber: this.idNumber,
          userName: this.username,
          email: this.email,
          password: this.password,
        },
      })
    );
    if (error) return prismaErrHandler(error);
    return data;
  }

  async deleteUser(id) {
    const {data, error} = await TryCatchHelper(() =>
      prisma.user.delete({
        where: {
          id: id,
        },
      })
    );
    if (error) return prismaErrHandler(error);
    return data;
  }
}

module.exports = UsersModel;
