const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { request } = require("express");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  // console.log(authHeader);
  if (!authHeader) {
    return res.status(401).send({ message: "UnAuthorized access" });
  }
  const token = authHeader && authHeader.split(" ")[1];
  // console.log(token);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
    if (err) {
      res.status(403).send({ message: "Forbidden access" });
    }
    req.decoded = decoded;
    next();
  });
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.np4eg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const productsCollection = client
      .db("lukas-carParts")
      .collection("products");
    const ordersCollection = client.db("lukas-carParts").collection("orders");
    const usersCollection = client.db("lukas-carParts").collection("users");
    const usersDetailCollection = client
      .db("lukas-carParts")
      .collection("usersDetail");
    const reviewsCollection = client.db("lukas-carParts").collection("reviews");

    app.get("/products", async (req, res) => {
      const products = await productsCollection.find({}).toArray();
      res.send(products);
    });

    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productsCollection.findOne(query);
      res.send(product);
    });

    app.post("/orders", async (req, res) => {
      const data = req.body;
      const booking = await ordersCollection.insertOne(data);
      res.send(booking);
    });

    //my orders api
    app.get("/myorders", verifyJWT, async (req, res) => {
      const userEmail = req.query.userEmail;
      const decodedEmail = req.decoded.email;
      if (userEmail === decodedEmail) {
        const query = { userEmail: userEmail };
        const orders = await ordersCollection.find(query).toArray();
        return res.send(orders);
      } else {
        return res.status(403).send({ message: "Forbidden access" });
      }
    });

    app.delete("/myorders/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const order = await ordersCollection.deleteOne(filter);
      res.send(order);
    });

    //user api
    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const userDetail = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: userDetail,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      const token = jwt.sign(
        { email: email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "5h" }
      );
      res.send({ result, token });
    });

    ///user detail api
    app.put("/usersDetail/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const filter = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersDetailCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });

    app.get("/usersDetail/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const result = await usersDetailCollection.findOne(query);
      res.send(result);
    });

    //api for reviews
    app.post("/review", async (req, res) => {
      const data = req.body;
      const result = await reviewsCollection.insertOne(data);
      res.send(result);
    });

    app.get("/review", async (req, res) => {
      const result = await reviewsCollection.find({}).toArray();
      res.send(result);
    });

    //api for admin page
    app.get("/users", verifyJWT, async (req, res) => {
      const users = await usersCollection.find().toArray();
      res.send(users);
    });

    app.get('/admin/:email', verifyJWT, async(req, res) => {
      const email = req.params.email;
      const user = await usersCollection.findOne({email: email});
      const isAdmin = user.role === 'admin';
      res.send({admin: isAdmin})
    })

    app.put("/users/admin/:email", verifyJWT, async (req, res) => {
      const email = req.params.email;
      const requester = req.decoded.email;
      const requesterAccount = await usersCollection.findOne({
        email: requester,
      });
      if (requesterAccount.role === "admin") {
        const filter = { email: email };
        const updateDoc = {
          $set: { role: "admin" },
        };
        const result = await usersCollection.updateOne(filter, updateDoc);
        res.send(result);
      }
      else{
        res.status(403).send({ message: "Forbidden acccess" });
      }
    });


    //api to add new product by admin
    app.post('/products', async(req, res) => {
      const data = req.body;
      const result = await productsCollection.insertOne(data);
      res.send(result);
    })

  } catch {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello From Lukas!");
});

app.listen(port, () => {
  console.log(`Lukas on port ${port}`);
});
