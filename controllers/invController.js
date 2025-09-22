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

// This next line of code export the invcont object.
module.exports = invCont