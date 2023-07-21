const router = require('express').Router();
const AdminController = require('../../../controllers/AdminController');
const checkCookies = require('../../../middlewares/checkCookies')
const verifyJwt = require('../../../middlewares/verifyJwt');
const { verifyAdminRole } = require('../../../middlewares/verifyRoles');

router.use(checkCookies);
router.use(verifyJwt);
router.use(verifyAdminRole);

router.route('/')
    .get(async(req,res) => {
        const adminController = new AdminController(req,res);
        await adminController.getUsers()
    })


//Parameters routes
router.route('/:userId')
    .get(async(req,res) => {
        const adminController = new AdminController(req,res);
        await adminController.getUserById();
    })
    .delete(async (req,res) => {
        const adminController = new AdminController(req,res);
        await adminController.deleteUserById();
    })

module.exports = router