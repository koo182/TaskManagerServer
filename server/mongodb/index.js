import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import generateLoginToken from "../utils/tokenGenerator.js";
import cookieParser from "cookie-parser";
import taskRoutes from "../routes/taskRoutes.js";
import userRoutes from "../routes/userRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
dotenv.config();

const mongodbUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster1.7ebrdzp.mongodb.net/?retryWrites=true&w=majority`;

// const mongodbUrl = `mongodb://localhost:27017/`;

mongoose.connect(mongodbUrl);

app.use("/tasks", taskRoutes);

app.use("/users", userRoutes);

app.post("/login", (req, res) => {
  const { name, password } = req.body;
  UserModel.findOne({ name: name })
    .select("+password")
    .then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, match) => {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .json({ error: "Internal Server Error" + err });
          }
          if (match) {
            const token = generateLoginToken(user);
            res.cookie("user", JSON.stringify(user), {
              httpOnly: true,
              sameSite: "none",
              secure: true,
            });

            res.send({
              _id: user._id,
              name: user.name,
              email: user.email,
              icon: user?.icon,
              token: token,
              message: "Correct data",
            });
          } else {
            res.json("Invalid username or password");
          }
        });
      } else {
        res.json("No account registered with this username");
      }
    });
});

app.listen(3005, () => {
  console.log("app listening on port 3005");
});
