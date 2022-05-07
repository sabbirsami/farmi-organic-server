const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("running Farmi Organic server");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.up3hj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});
async function run() {
    try {
        await client.connect();
        const productCollection = client
            .db("farmiOrganic")
            .collection("product");

        app.get("/product", async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
        // LOAD PRODUCT FOR SINGE USER
        app.get("/order", async (req, res) => {
            const email = req.query.email;
            console.log(email);
            const query = { email: email };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        //LOAD SINGLE DATA DETAIL
        app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        });

        // ADD PRODUCT
        app.post("/product", async (req, res) => {
            const newProduct = req.body;
            const result = await productCollection.insertOne(newProduct);
            res.send(result);
        });

        // DELETE SINGLE PRODUCT
        app.delete("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });

        app.put("/product/:id", async (req, res) => {
            const newProduct = req.body;
            const id = req.params.id;
            console.log(newProduct);
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: newProduct.updateQuantity,
                },
            };
            const result = await productCollection.updateOne(
                query,
                updateDoc,
                options
            );
            res.send(result);
            console.log(result);
        });
    } finally {
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log("Listening port : ", port);
});
