// Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const addValidate = require("../utilities/management-validation")
const utilities = require("../utilities/")

//Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)


// Route to build the item view page for details.
router.get("/detail/:inventoryId", invController.buildByInventoryId)

// Route to build the management view page.
router.get("/", invController.buildManagementView)


// Route to build the add classification view page.
router.get("/add_class", invController.buildAddClassification)


// Route to build the add inventory view page.
router.get("/add_inv", invController.buildAddInventory)

// Route to add classification.
router.post("/add_class", 
    addValidate.addClassificationRules(),
    addValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
)

// Route to add inventory.
router.post("/add_inv", 
    addValidate.addInventoryRules(),
    addValidate.checkInvData,
    utilities.handleErrors(invController.addInventory)
)

module.exports = router;