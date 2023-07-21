const verifyAdminRole = (req,res,next) => {
    const { role } = req;
    if (role !== "admin") return res.status(403).json({err: "Forbidden"});
    next()
}

const verifyUserRole = (req,res,next) => {
    const { role } = req;
    if(role !== "user") return res.status(403).json({err: "Forbidden"});
    next()
}


module.exports = {verifyAdminRole,verifyUserRole}