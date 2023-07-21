const GeneralAccountController = require('../../../controllers/GeneralAccountController');
const checkCookies = require('../../../middlewares/checkCookies');
const verifyJwt = require('../../../middlewares/verifyJwt');
const { verifyUserRole } = require('../../../middlewares/verifyRoles');

const router = require('express').Router();

router.use(checkCookies);
router.use(verifyJwt);
router.use(verifyUserRole);

router.route('/')
    .post(async(req,res) => {
        const generalAccController = new GeneralAccountController(req,res);
        await generalAccController.createAccount();
    })
module.exports = router