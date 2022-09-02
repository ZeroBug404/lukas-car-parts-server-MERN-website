const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const dbConnect = require("./utils/dbConnect");
const productsRoutes = require('./routes/v1/products.route');
const viewCount = require("./middleware/viewCount");
const errorHandler = require("./middleware/errorHandler");


// const corsConfig = {
//   origin: "*",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE"],
// };
// app.use(cors(corsConfig));
// app.options("*", cors(corsConfig));
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept,authorization"
//   );
//   next();
// });
app.use(express.json());

// function verifyJWT(req, res, next) {
//   const authHeader = req.headers.authorization;
//   // console.log(authHeader);
//   if (!authHeader) {
//     return res.status(401).send({ message: "UnAuthorized access" });
//   }
//   const token = authHeader && authHeader.split(" ")[1];
//   // console.log(token);
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
//     if (err) {
//       res.status(403).send({ message: "Forbidden access" });
//     }
//     req.decoded = decoded;
//     next();
//   });
// }

// app.use(viewCount);

dbConnect();

app.use('/api/v1/products', productsRoutes);

app.get("/", (req, res) => {
  res.send("Hello From Lukas!");
});

app.all('*', (req, res) => {
  res.send('No Route found');
})

app.use(errorHandler);


app.listen(port, () => {
  console.log(`Lukas on port ${port}`);
});

//if the express can to handle the error so this is the global error 
process.on('unhandledRejection', (error) => {
  console.log(error.naem, error.message);
  app.close(() => {
    process.exit(1);
  })
})
