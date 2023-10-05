const express = require("express");
const mongoose = require("mongoose");
const app = express();
const User = require("./models/user.js");
const port = 3000;

app.use(express.json()); // middleware

app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoose
  .connect("mongodb://localhost:27017/nodecrud", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

app.post("/register", async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(200).json(newUser); // Send the newly created user as a response
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (user) {
      const passwordMatch = await User.findOne({ email: email, password: password });


      if (passwordMatch) {
        res.status(200).json({ message: "Logged in successfully" });
      } else {
        res.status(401).json({ message: "Email or password does not match" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
