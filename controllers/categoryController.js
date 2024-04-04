const db = require("../services/database");
const { checkRequiredFields } = require("../services/validation");

exports.getAllCategories = async (req, res) => {
  try {
    const result = await db.pool.query("SELECT * FROM category");
    return res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const requiredFields = ["name"];
    const missingField = checkRequiredFields(requiredFields, req.body);

    if (missingField) {
      return res.status(422).json({ error: missingField.error });
    }

    const existResult = await db.pool.query({
      text: "SELECT EXISTS (SELECT * FROM category WHERE name = $1)",
      values: [req.body.name],
    });

    if (existResult.rows[0].exists)
      return res
        .status(409)
        .json({ error: `Category ${req.body.name} already exists` });

    const result = await db.pool.query({
      text: "INSERT INTO category(name) VALUES($1) RETURNING *",
      values: [req.body.name],
    });
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const requiredFields = ["name"];
    const missingField = checkRequiredFields(requiredFields, req.body);

    if (missingField) {
      return res.status(422).json({ error: missingField.error });
    }

    const existResult = await db.pool.query({
      text: "SELECT EXISTS (SELECT * FROM category WHERE name = $1)",
      values: [req.body.name],
    });

    if (existResult.rows[0].exists)
      return res
        .status(409)
        .json({ error: `Category ${req.body.name} already exists` });

    const result = await db.pool.query({
      text: `
            UPDATE category
            SET name = $1, updated_date = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
            `,
      values: [req.body.name, req.params.id],
    });

    if (result.rowCount == 0)
      return res.status(404).json({ error: "Category not found" });
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const countResult = await db.pool.query({
      text: `SELECT COUNT(*) FROM product WHERE category_id = $1`,
      values: [req.params.id],
    });

    if (countResult.rows[0].count > 0) {
      return res.status(409).json({
        error: `Category is being used by ${countResult.rows[0].count} products`,
      });
    }
    const result = await db.pool.query({
      text: `DELETE FROM category WHERE id = $1`,
      values: [req.params.id],
    });

    if (result.rowCount == 0) {
      return res.status(404).json({ error: "Category not found" });
    }
    return res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
