const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
const port = 3001;

// Create connection to MySQL database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "tailsfusion",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL");
});

// Middleware to parse request bodies
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Route to handle form submission
app.post("/api/signup", (req, res) => {
  const { username, password, businessName, totalEmployees } = req.body;

  // Check if user already exists
  const checkUserQuery = `SELECT * FROM users WHERE username = ?`;
  db.query(checkUserQuery, [username], (err, results) => {
    if (err) {
      console.error("Error checking user existence:", err);
      return res.json({ error: "Internal Server Error" });
    }

    if (results.length > 0) {
      // User already exists
      return res.status(200).json({ error: "User already exists" });
    } else {
      // User does not exist, proceed with signup
      const insertUserQuery =
        "INSERT INTO users (username, password, business_name, total_employees) VALUES (?, ?, ?, ?)";
      db.query(
        insertUserQuery,
        [username, password, businessName, totalEmployees],
        (err, result) => {
          if (err) {
            console.error("Error inserting data into MySQL:", err);
            return res.json({ error: "Internal Server Error" });
          } else {
            console.log("Data inserted into MySQL successfully");
            return res
              .status(200)
              .json({ message: "Form submitted successfully" });
          }
        }
      );
    }
  });
});

// Login route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  // Query to fetch user from database based on username and password
  const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

  // Execute the query
  db.query(query, [username, password], (error, results) => {
    if (error) {
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Check if user exists and password matches
    if (results.length === 1) {
      // User authenticated successfully
      return res.json({ success: true });
    } else {
      // Invalid credentials
      return res.status(401).json({ error: "Invalid username or password" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
