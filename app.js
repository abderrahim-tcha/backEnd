require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

// Connection to PostgreSQL database
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.get("/data/:chartName", (req, res) => {
  // Get the chart name from the url
  const chartName = req.params.chartName;

  switch (chartName) {
    case "lineChart":
      console.log(chartName);
      const lineChartData = {
        labels: ["2015", "2016", "2017", "2018", "2019", "2020", "2021"],
        dataset: [30, 40, 35, 50, 49, 60, 70],
      };
      res.json(lineChartData);
      break;

    default:
      res.status(404).send("Chart not found");
  }
});

app.post("/createUser", async (req, res) => {
  // const { name, password, authlevel } = req.body;

  const name = "test";
  const password = "test";
  const authLevel = 1;

  //hash the password
  const saltRounds = 12;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Insert the user into the database
  try {
    const query =
      " INSERT INTO users (Username, Password, AuthLevel) VALUES ($1, $2, $3);";
    const values = [name, hashedPassword, authLevel];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.detail);
  } finally {
    await pool.end();
  }
});

app.post("/login", async (req, res) => {
  // const { name, password } = req.body;

  const name = "test";
  const password = "test";

  try {
    const query = "SELECT * FROM users WHERE Username = $1;";
    const values = [name];
    const result = await pool.query(query, values);

    // Check if the user exists
    if (result.rows.length === 0) {
      return res.status(401).send("Invalid username or password");
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(passwordMatch);

    if (!passwordMatch) {
      return res.status(401).send("Invalid username or password");
    }

    res.status(200).json({ message: "valid", authLevel: user.authlevel });
  } catch (err) {
    console.error(err);
    res.status(500).send(err.detail);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
