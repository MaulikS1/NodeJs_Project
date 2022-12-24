const { createUser, getUserByUserId, getUsers, updateUser, deleteUser, login, resetPassword, resetPasswordLink } = require("./user.controller");
const router = require("express").Router();

const { checkToken } = require("../../auth/token_validation");

router.post("/newUser", createUser);
router.post("/resetPasswordEmail", resetPasswordLink);
router.get("/getAllUsers", checkToken, getUsers);

router.get("/:id", checkToken ,getUserByUserId);
router.patch("/", checkToken ,updateUser);
router.patch("/resetPassword", checkToken ,resetPassword);
router.delete("/", checkToken ,deleteUser);
router.post("/authenticate", login); 


module.exports = router;