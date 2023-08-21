import UserModel from "../models/User.js";
import authenticateToken from "../middleware/authenticateToken.js";
import express from "express";

import bcrypt from "bcrypt";
const app = express.Router();

// ---------------- GET ------------------

app.get("/", authenticateToken, (req, res) => {
  UserModel.find()
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal server error", err });
    });
});

app.get("/:id", authenticateToken, (req, res) => {
  const user = req.user;
  UserModel.findOne({ _id: user._id })
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json({ error: "Internal server error", err });
    });
});

// -------------- PATCH -----------------

app.patch("/:id", authenticateToken, (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;

  if (updateData.password) {
    bcrypt
      .hash(updateData.password, 10)
      .then((hashedPassword) => {
        updateData.password = hashedPassword;
        updateUser();
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Could not update user" });
      });
  } else {
    updateUser();
  }

  function updateUser() {
    UserModel.findOneAndUpdate(
      { _id: userId },
      { $set: updateData },
      { new: true }
    )
      .then((updatedUser) => {
        if (updatedUser) {
          res.status(200).json(updatedUser);
        } else {
          res.status(404).json({ error: "User not found" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: "Could not update user" });
      });
  }
});

// ---------------- POST ----------------

app.post("/", (req, res) => {
  const { name, email, password } = req.body;
  const icon = "";

  UserModel.findOne({ email })
    .then((existingEmail) => {
      if (existingEmail) {
        return res.status(409).json({ message: "Double email" });
      }

      return UserModel.findOne({ name });
    })
    .then((existingUsername) => {
      if (existingUsername) {
        return res.status(409).json({ message: "Double username" });
      }

      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      return UserModel.create({ name, email, password: hashedPassword, icon });
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" + err });
    });
});

// ------------------ DELETE ----------------

app.delete("/:id", authenticateToken, (req, res) => {
  const userId = req.params.id;

  UserModel.findOneAndDelete({ _id: userId })
    .then((deletedUser) => {
      if (deletedUser) {
        res.status(200).json(deletedUser);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Could not delete user" });
    });
});

export default app;
