const values = require("./_secret.js");
require("dotenv").config();
const pool = require("./db");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const router = require("./router/index");
const queries = require("./queries/queries");
const errorMiddleware = require("./middlewares/err-middleware");

// const PORT = process.env.PORT;
const PORT = process.env.PORT || 5000;
const app = express();

app.use(express.json());
app.use(cookieParser());
// app.use(cors(
//   {
//     credetnials: true,
//     origin: process.env.CLIENT_URL,
//     origin: "https://6490d358-ea1b-48bf-81dd-c0131b7d98f3-00-4at54uavy4c1.kirk.replit.dev/"
//   }
// ));

app.use(cors(
  {
    credentials: true,
    origin: [process.env.CLIENT_URL, "https://6490d358-ea1b-48bf-81dd-c0131b7d98f3-00-4at54uavy4c1.kirk.replit.dev/"]
  }
));


app.use("/api", router);

app.use(errorMiddleware); // подключаем последним

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const start = async () => {
  try {
    // const users = await pool.query(queries.getUsers);
    // const tokens = await pool.query(queries.getTokens);
    app.listen(PORT, () =>
      console.log(`Server started on port http://localhost:${PORT}`),
    );
  } catch (e) {
    console.log(e);
  }
};

start();


