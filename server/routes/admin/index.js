const GeneralAccountController = require("../../controllers/GeneralAccount/GeneralAccountController");
const TryCatchHelper = require("../../helpers/TryCatch");
const OnMountAdmin = require("../../hooks/onMountAdmin");
const checkCookies = require("../../middlewares/checkCookies");
const verifyJwt = require("../../middlewares/verifyJwt");
const { verifyAdminRole } = require("../../middlewares/verifyRoles");

const router = require("express").Router();

router.use(checkCookies);
router.use(verifyJwt);
router.use(verifyAdminRole);

router.route("/").get(async (req, res) => {
  const generalAccController = new GeneralAccountController(req, res);
  const { data, error } = await TryCatchHelper(() =>
    generalAccController.getAccounts()
  );
  if (error) {
    console.error(error);
    return res.status(500).json({ err: "Error validating users account" });
  }
  const onMountHook = new OnMountAdmin(data, "general");
  const { isGenAccsValid, removeGenSuspensions } =
    await onMountHook.onMountGeneral();
  const { isSavAccsValid, removeSavSuspensions } =
    await onMountHook.onMountSavings();
  if (
    !isGenAccsValid ||
    !removeGenSuspensions ||
    !isSavAccsValid ||
    !removeSavSuspensions
  )
    return res.status(500).json({ err: "Error while validating accounts" });
  return res.status(200).json({ msg: "Ok" });
});

module.exports = router;
