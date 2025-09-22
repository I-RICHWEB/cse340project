// Needed resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")


// The route for the intentional error.

router.get("/triggerError", invController.intentionalError)

// Exporting the router
module.exports = router;