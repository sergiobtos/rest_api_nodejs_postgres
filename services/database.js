const { Pool } = require("pg");

const pool = new Pool({
  connectionString:
    "postgres://ekhjdlor:789dEKVDRbMAaWr-8N-G5A26z1i9RTNz@salt.db.elephantsql.com/ekhjdlor",
});

module.exports = {
  pool,
};
