const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(cookieParser());
const { sequelize } = require("./models");
const pool = require("./database/config.database");
const rootRouter = require("./routers/root.router");

const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(rootRouter);

app.use((req, res, next) => {
  res.header(`Access-Control-Allow-Origin`, `*`);
  res.header(`Access-Control-Allow-Methods`, `GET,PUT,POST,DELETE`);
  res.header(`Access-Control-Allow-Headers`, `Content-Type`);
  next();
});

async function getAll() {
  try {
    const query = `SELECT * FROM CATEGORIESs`;

    const { rows } = await pool.query(query);
    console.log("Truy vấn thành công");
    return rows;
  } catch (err) {
    console.error("Thất bại");
    return false;
  }
}

app.get("/", async (req, res) => {
  const result = await getAll();
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(400).send("ERROR");
  }
});

app.listen(7000, () => {
  console.log("http://localhost:7000");
});

// async function getAll() {
//   try {
//     const query = `SELECT * FROM CATEGORIES`;

//     const { rows } = await pool.query(query);
//     console.log("Truy vấn thành công");
//     return rows;
//   } catch (err) {
//     console.error("Thất bại");
//     return false;
//   }
// }

// getAll()

async function test() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

test();
