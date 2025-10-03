const pool = require("../database/");

/* *****************************
 * Get all classification data
 * ****************************** */
async function getClassifications() {
  return await pool.query(
    "SELECT * FROM public.classification ORDER BY classification_name"
  );
}

/* *****************************
 * Get all inventory items and classification_name by classification_id
 * ****************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c 
            ON i.classification_id = c.classification_id
            WHERE c.classification_id = $1`,
      [classification_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getclassificationbyid error" + error);
  }
}

/* *****************************
 * Get inventory item by inventory_id
 * ****************************** */
async function getInventoryByInventoryId(inventory_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory 
            WHERE inv_id = $1`,
      [inventory_id]
    );
    return data.rows;
  } catch (error) {
    console.error("getinventorybyid error" + error);
  }
}

/* *****************************
*   Add new classification
* *************************** */
async function addClassification(classification_name){
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message
  }
}

/* *****************************
 *   Add new inventory
 * *************************** */
async function addInventory(
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
) {
  try {
    const sql = "INSERT INTO inventory (classification_id, inv_make, inv_model, inv_description, inv_year, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *"
    return await pool.query(sql, [
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
    ])
  } catch (error) {
    return error.message
  }
}

/* *****************************
 *   Update inventory
 * *************************** */
async function updateInventory(
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
) {
  try {
    const sql = "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_year = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11  RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}


/* *****************************
 *   Delete inventory item
 * *************************** */
async function deleteInventoryById(invId) {
  try {
    const sql = "DELETE FROM inventory WHERE inv_id = $1 RETURNING *"
    const data = await pool.query(sql, [invId]);
    return data.rows[0]
  } catch (error) {
    console.error("Delete Inventory Error: ", error)
    throw new Error("Failed to delete inventory item.")
  }
}



module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getInventoryByInventoryId,
  addInventory,
  addClassification,
  updateInventory,
  deleteInventoryById
}
