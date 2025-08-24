import express from "express";
const app = express();
import cors from "cors";
import mongoose from "mongoose";
import productRouter from "./productroute.js";
app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://singhchandrapal13:rajendra@cluster0.kp2hot7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    password: String,
  })
);

app.post("/register", (req, res) => {
  const { username, password } = req.body;

  const newUser = new User({ username, password });
  newUser
    .save()
    .then(() => {
      res.status(200).json({
        message: "User registered successfully",
        user: { username, password },
      });
    })
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Error registering user", error: err.message });
    });
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  User.find({ username, password })
    .then((user) => {
      if (user.length > 0) {
        res.status(200).json({
          message: "Login successful",
          user: { username, password },
        });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Error logging in", error: err.message });
    });
});

app.use("/api", productRouter);

app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
export default app;
