const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***********************************************
* Build inventory by classification view
* ********************************************** */
invCont.buildByClassificationId = async function (req, res, next){
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    console.log(className)
    res.render("./inventory/classification", {
        title: className +" "+ "vehicles",
        nav,
        grid,
    })
}

/* ***********************************************
* Build Items by item_id view
* ********************************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    const inventory_id  = req.params.inventoryId
    const data = await invModel.getInventoryByInventoryId(inventory_id)
    const flex = await utilities.buildInventoryFlex(data)
    let nav = await utilities.getNav()
    const invName = data[0].inv_model
    const invMake = data[0].inv_make
    const invYear = data[0].inv_year

    res.render("./inventory/item", {
        title: invYear +" "+ invMake + " " + invName,
        nav,
        flex,
    })
}

// In this next few lines I am going to build an intentional error
// and throw it for the task 3 assignment.
invCont.intentionalError = (req, res, next) => {
    try {
        throw new Error("The error is successfully thrown intentionally.");
    } catch (err) {
        next({status: 500, message: 'This is an intentional error thrown for the assignment.'});
    }
}

/* ***********************************************
* Build inventory management view
* ********************************************** */
invCont.buildManagementView = async function (req, res, next){
    let nav = await utilities.getNav()
    res.render("./inventory/", {
        title: "Vehicles Management",
        nav,
    })
}

/* ***********************************************
* Build add classification view
* ********************************************** */
invCont.buildAddClassification = async function (req, res, next){
    let nav = await utilities.getNav()
    res.render("./inventory/add_class", {
        title: "Add New Classification",
        nav,
        errors: null,
    })
}

/* ***********************************************
* Build add inventory view
* ********************************************** */
invCont.buildAddInventory = async function (req, res, next){
    const classificationList = await utilities.buildClassificationList()

    let nav = await utilities.getNav()
    res.render("./inventory/add_inv", {
        title: "Add New Inventory",
        nav,
        errors: null,
        classificationList,
    })
}


/* ****************************************
*  Process the add inventory
* *************************************** */
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_year,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
 } = req.body
  
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
  )

  if (regResult) {
    req.flash(
      "notice successful",
      `Congratulations, you have added ${inv_make} ${inv_model} to your inventory.`
    )
    res.status(201).render("./inventory/", {
      title: "Vehicles Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice failed", "Sorry, there was an error in the proccess of adding the inventory, try again.")
    res.status(501).render("./inventory/add_inv", {
      title: "Add New Inventory",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
*  Process the add classification
* *************************************** */
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  
  const regResult = await invModel.addClassification( classification_name )
  if (regResult) {
    req.flash(
      "notice successful",
      `Congratulations, you have added ${classification_name} to your classification list.`
    )
    res.status(201).render("./inventory/", {
      title: "Vehicles Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice failed", "Sorry, there was an error in the proccess of adding the classification, try again.")
    res.status(501).render("./inventory/add_class", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  }
}

// This next line of code export the invcont object.
module.exports = invCont