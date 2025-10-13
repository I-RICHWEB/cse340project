// Needed resources
const utilities = require(".");
const { body, validationResult } = require("express-validator");
const accountModel = require("../models/account-model");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please log in or use different email");
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (!emailExists) {
          throw new Error(
            "This Email does not exists. Please click the sign-up link to register or use different email"
          );
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checklogData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  Account update Data Validation Rules
 * ********************************* */
validate.profileDetailsRules =  (req, res) => {

  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email, {req}) => {
        const {account_id} = req.body
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists && emailExists.account_id !== parseInt(account_id)) {
          throw new Error("Email exists. Please use a different email");
        }
      }),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update", {
      errors,
      title: "Updata Your Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    });
    return;
  }
  next();
};



/*  **********************************
 *  Account password update Data Validation Rules
 * ********************************* */
validate.changePasswordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkNewPassword = async (req, res, next) => {
  const { account_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/update", {
      errors,
      title: "Updata Your Account",
      nav,
      account_id,
    });
    return;
  }
  next();
};


/*  **********************************
 *  Confirmation of the user email rules to allow the user change password. 
 * ********************************* */
validate.confirmEmailRule = () => {
  return [

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (!emailExists) {
          throw new Error("Email does not exists. Please enter a valid email or sign up for a new account.");
        }
      }),
  ];
};


/* ******************************
 * Check the inputed email and return errors or continue to change the password
 * ***************************** */
validate.checkConfirmEmail = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/forget", {
      errors,
      title: "Change Passwor",
      nav,
      account_email,
    });
    return;
  }
  next();
};



/*  **********************************
 *  Account forgot password update Data Validation Rules
 * ********************************* */
validate.forgotPasswordRules = () => {
  return [
    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};



/* ******************************
 * Check forgot password update data and return errors or continue to change the password.
 * ***************************** */
validate.checkForgotNewPassword = async (req, res, next) => {
  const { account_id } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/forget", {
      errors,
      title: "Change Password",
      nav,
      account_id,
    });
    return;
  }
  next();
};



/*  **********************************
 *  Confirmation of the user intention to delete their rule. 
 * ********************************* */
validate.confirmDeleteAccountRule = () => {
  return [

    // valid email is required and cannot already exist in the DB
    body("delete_confirmation")
      .trim()
      .notEmpty()
      .withMessage("The delete confirmation details is required.")
      .custom(async (delete_confirmation, {req}) => {
        const {account_id} = req.body
        const accountDetails = await accountModel.getAccountById(account_id)

        const confirmDetails = "I want to delete this account: "+ accountDetails.account_firstname + " " + accountDetails.account_lastname

        if (delete_confirmation != confirmDetails) {
          throw new Error("The delete confirmation details is incorrect. Try again.");
        }
      }),
  ];
};


/* ******************************
 * Check the inputed delete confirmation details and return errors or continue to delete the account.
 * ***************************** */
validate.checkDeleteAccountDetails = async (req, res, next) => {
  let errors = [];
  const {account_id} = req.body
  const accountDetails = await accountModel.getAccountById(account_id)
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/delete", {
      errors,
      title: "Delete Account",
      nav,
      account_id : accountDetails.account_id,
      account_firstname : accountDetails.account_firstname,
      account_lastname : accountDetails.account_lastname,
    });
    return;
  }
  next();
};




module.exports = validate;
