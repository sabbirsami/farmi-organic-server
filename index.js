const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("running Farmi Organic server");
});
//jnUfgvVwlknnsKkJ
//farmiOrganic

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
            console.log("gaagag");
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });
    } finally {
    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log("Listening port : ", port);
});
