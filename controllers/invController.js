const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***********************************************
 * Build inventory by classification view
 * ********************************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  console.log(className);
  res.render("./inventory/classification", {
    title: className + " " + "vehicles",
    nav,
    grid,
  });
};

/* ***********************************************
 * Build Items by item_id view
 * ********************************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  const inventory_id = req.params.inventoryId;
  const data = await invModel.getInventoryByInventoryId(inventory_id);
  const flex = await utilities.buildInventoryFlex(data);
  let nav = await utilities.getNav();
  const invName = data[0].inv_model;
  const invMake = data[0].inv_make;
  const invYear = data[0].inv_year;

  res.render("./inventory/item", {
    title: invYear + " " + invMake + " " + invName,
    nav,
    flex,
  });
};

// In this next few lines I am going to build an intentional error
// and throw it for the task 3 assignment.
invCont.intentionalError = (req, res, next) => {
  try {
    throw new Error("The error is successfully thrown intentionally.");
  } catch (err) {
    next({
      status: 500,
      message: "This is an intentional error thrown for the assignment.",
    });
  }
};

/* ***********************************************
 * Build inventory management view
 * ********************************************** */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  res.render("./inventory/", {
    title: "Vehicles Management",
    nav,
    errors: null,
    classificationList,
  });
};

/* ***********************************************
 * Build add classification view
 * ********************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add_class", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ***********************************************
 * Build add inventory view
 * ********************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  const classificationList = await utilities.buildClassificationList();

  let nav = await utilities.getNav();
  res.render("./inventory/add_inv", {
    title: "Add New Inventory",
    nav,
    errors: null,
    classificationList,
  });
};

/* ****************************************
 *  Process the add inventory
 * *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_year,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
  } = req.body;

  const regResult = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_year,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );

  if (regResult) {
    req.flash(
      "notice successful",
      `Congratulations, you have added ${inv_make} ${inv_model} to your inventory.`
    );
    res.status(201).render("./inventory/", {
      title: "Vehicles Management",
      nav,
      errors: null,
      classificationList,
    });
  } else {
    req.flash(
      "notice failed",
      "Sorry, there was an error in the proccess of adding the inventory, try again."
    );
    res.status(501).render("./inventory/add_inv", {
      title: "Add New Inventory",
      nav,
      errors: null,
      classificationList,
    });
  }
};

/* ****************************************
 *  Process the add classification
 * *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const regResult = await invModel.addClassification(classification_name);
  if (regResult) {
    req.flash(
      "notice successful",
      `Congratulations, you have added ${classification_name} to your classification list.`
    );
    res.status(201).render("./inventory/", {
      title: "Vehicles Management",
      nav,
      errors: null,
    });
  } else {
    req.flash(
      "notice failed",
      "Sorry, there was an error in the proccess of adding the classification, try again."
    );
    res.status(501).render("./inventory/add_class", {
      title: "Add New Classification",
      nav,
      errors: null,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***********************************************
 * Build update inventory view
 * ********************************************** */
invCont.buildUpdateInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const invData = await invModel.getInventoryByInventoryId(inv_id);
  const classificationList = await utilities.buildClassificationList(
    invData[0].classification_id
  );

  const invMake = invData[0].inv_make;
  const inv_Model = invData[0].inv_model;

  res.render("./inventory/update_inv", {
    title: "Edit " + invMake + " " + inv_Model,
    nav,
    errors: null,
    classificationList,
    inv_id: invData[0].inv_id,
    inv_make: invData[0].inv_make,
    inv_model: invData[0].inv_model,
    inv_year: invData[0].inv_year,
    inv_description: invData[0].inv_description,
    inv_image: invData[0].inv_image,
    inv_thumbnail: invData[0].inv_thumbnail,
    inv_price: invData[0].inv_price,
    inv_miles: invData[0].inv_miles,
    inv_color: invData[0].inv_color,
    // classification_id: invData[0].classification_id
  });
};

/* ****************************************
 *  Process the update inventory item
 * *************************************** */
invCont.updateInventory = async function (req, res) {
  let nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_year,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_year,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    req.flash(
      "notice successful",
      `The ${inv_make} ${inv_model} was successfully updated.`
    );
    res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(
      classification_id
    );
    req.flash("notice failed", "Sorry, the insert failed.");
    res.status(501).render("inventory/update_inv", {
      title: "Edit " + inv_make + " " + inv_model,
      nav,
      classificationSelect: classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***********************************************
 * Build delete confirmation view
 * ********************************************** */
invCont.deleteInventoryConfirmationView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const invData = await invModel.getInventoryByInventoryId(inv_id);

  const invMake = invData[0].inv_make;
  const inv_Model = invData[0].inv_model;

  res.render("./inventory/delete_inv", {
    title: "Delete " + invMake + " " + inv_Model,
    nav,
    errors: null,
    inv_id: invData[0].inv_id,
    inv_make: invData[0].inv_make,
    inv_model: invData[0].inv_model,
    inv_year: invData[0].inv_year,
    inv_price: invData[0].inv_price,
  });
};

/* ****************************************
 *  Process the delete inventory item
 * *************************************** */
invCont.deleteInventory = async function (req, res) {
  // const invId = parseInt(req.params.inv_id);
  let nav = await utilities.getNav();
  const { inv_id, inv_make, inv_model, inv_year, inv_price } = req.body;
  const deleteResult = await invModel.deleteInventoryById(inv_id);
  if (deleteResult) {
    req.flash(
      "notice successful",
      `The ${inv_make} ${inv_model} was successfully deleted.`
    );
    res.redirect("/inv/");
  } else {
    req.flash("notice failed", "Sorry, the delete process failed.");
    res.status(501).render("inventory/delete_inv", {
      title: "Delete " + inv_make + " " + inv_model,
      nav,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    });
  }
};

// This next line of code export the invcont object.
module.exports = invCont;
