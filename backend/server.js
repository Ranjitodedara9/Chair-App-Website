const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");
const passport = require("./passport");
const auth = require("./jwt");
const app = express();

app.use(cors());
app.use(bodyParser.json()); // Use body-parser middleware to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

app.use(passport.initialize());
const authuser = passport.authenticate("local", { session: false });

const getroutes = require("./Getperson");
app.use("/", getroutes);

const productroutes = require("./routers/productRoute");
app.use("/", productroutes);

const orderroutes = require("./routers/Orderrouter");
app.use("/order", orderroutes);

const personRoutes = require("./routers/personRouter");
const Person = require("./models/person");
app.use("/", personRoutes);

app.put("/:id", async (req, res) => {
  try {
    const userId = req.body._id;
    const updatePersondata = req.body;

    const response = await Person.findByIdAndUpdate(userId, updatePersondata, {
      new: true,
      newValidators: true,
    });

    if (!updatePersondata) {
      res.status(404).json({ error });
    }
    console.log("data updated");
    res.status(200).json(response); // Use 200 for successful GET request
  } catch (err) {
    console.log("data not updated");
    res.status(400).json({ message: err.message });
  }
});

// Start the server
app.listen(4000, () => console.log("Server is running on port 4000"));
