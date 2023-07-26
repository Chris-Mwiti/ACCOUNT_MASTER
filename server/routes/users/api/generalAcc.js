const DepositController = require("../../../controllers/GeneralAccount/DepostController");
const GeneralAccountController = require("../../../controllers/GeneralAccount/GeneralAccountController");
const checkCookies = require("../../../middlewares/checkCookies");
const verifyJwt = require("../../../middlewares/verifyJwt");
const { verifyUserRole } = require("../../../middlewares/verifyRoles");

const router = require("express").Router();
const ACC_TYPE = "general";

router.use(checkCookies);
router.use(verifyJwt);
router.use(verifyUserRole);

router.route("/").post(async (req, res) => {
  const generalAccController = new GeneralAccountController(req, res);
  await generalAccController.createAccount();
});

router.route("/deposit")
  .post(async(req,res) => {
    const depositController = new DepositController(req,res,ACC_TYPE);
    await depositController.makeDeposit()
  })
module.exports = router;
