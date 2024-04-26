const Pool = require("pg").Pool;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "BanCaCanh",
  password: "123456",
  port: 5432,
});

const getUsers = () => {
  pool.query("SELECT * FROM CATEGORIES", (error, results) => {
    if (error) {
      throw error;
    }
    console.log(results.rows);
  });
};

getUsers()