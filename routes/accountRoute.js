// Needed resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");

// The route to call the accountController to build the login page.
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// The route to call the accountController to build the register page.
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

// The route for the registeration post method.
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checklogData,
  utilities.handleErrors(accountController.accountLogin)
);

// Thw account management view route
router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagementView)
);

router.get(
  "/update/:accountId",
  utilities.handleErrors(accountController.buildUpdateView)
);

// Process the update profile information.
router.post(
  "/update-profile",
  regValidate.profileDetailsRules(),
  regValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateProfileInfo)
);

// Process the change password information update
router.post(
  "/change-password",
  regValidate.changePasswordRules(),
  regValidate.checkNewPassword,
  utilities.handleErrors(accountController.changePassword)
);

// This is the route to change the password when the user have forgotten the password.
router.get("/forget", utilities.handleErrors(accountController.buildForgetPassword));

// The route to confirm the email of the user who wants to change his password.
router.post("/confirm", 
  regValidate.confirmEmailRule(),
  regValidate.checkConfirmEmail,
  utilities.handleErrors(accountController.confirmUserEmail)
)

// This is the post router to confirm the user email if it exist in the database.
router.post("/change", 
  regValidate.forgotPasswordRules(),
  regValidate.checkForgotNewPassword,
  utilities.handleErrors(accountController.changeForgotPassword)
)

// The route to delete the user account.
router.get("/delete/:accountId", utilities.handleErrors(accountController.buildDeleteAccountView))

// The post route to initiate the account delete process.
router.post("/delete",
  regValidate.confirmDeleteAccountRule(),
  regValidate.checkDeleteAccountDetails,
  utilities.handleErrors(accountController.deleteAccount)
)



// This is to logout a user that is signed in.
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

module.exports = router;
