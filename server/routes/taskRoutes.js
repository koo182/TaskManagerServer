import TaskModel from "../models/Task.js";
import authenticateToken from "../middleware/authenticateToken.js";
import express from "express";
import mongoose from "mongoose";
const app = express.Router();

// ------------------- GET --------------------

app.get("/", (req, res) => {
  TaskModel.find()
    .then((tasks) => {
      res.status(200).json(tasks);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Could not fetch tasks" });
    });
});

app.get("/user", authenticateToken, (req, res) => {
  const user = req.user;
  TaskModel.find({ author: user.name, completed: { $ne: true } })
    .then((tasks) => {
      res.status(200).json(tasks);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Could not fetch tasks" });
    });
});

app.get("/others", authenticateToken, (req, res) => {
  const user = req.user;
  TaskModel.find({ author: { $ne: user.name } })
    .then((tasks) => {
      res.status(200).json(tasks);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Could not fetch tasks" });
    });
});

app.get("/user/completed", authenticateToken, (req, res) => {
  const user = req.user;
  TaskModel.find({ author: user.name, completed: { $ne: false } })
    .then((tasks) => {
      res.status(200).json(tasks);
    })
    .catch((err) => {
      res.status(500).json({ error: "Could not fetch tasks" });
    });
});

// ------------------- POST -----------------------

app.post("/", (req, res) => {
  const newTask = new TaskModel({
    _id: new mongoose.Types.ObjectId(),
    title: req.body.title,
    desc: req.body.desc,
    due_date: req.body.due_date,
    tags: req.body.tags,
    author: req.body.author,
    completed: req.body.completed,
  });
  newTask
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "task created successfully",
        createdTask: result,
      });
    })
    .catch((err) => {
      console.log(err);
      if (err.errors) {
        const errorMessages = Object.values(err.errors).map(
          (error) => error.message
        );
        res.status(400).json({ errors: errorMessages });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    });
});

// ------------------- PATCH -----------------------

app.patch("/:id", authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const updateData = req.body;
  const user = req.user;

  TaskModel.findOneAndUpdate(
    { _id: taskId, author: user.name },
    { $set: updateData },
    { new: true }
  )
    .then((updatedTask) => {
      if (updatedTask) {
        res.status(200).json(updatedTask);
      } else {
        res.status(404).json({ error: "Task not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Could not update task" });
    });
});

// ------------------- DELETE -----------------------

app.delete("/:id", authenticateToken, (req, res) => {
  const taskId = req.params.id;
  const user = req.user;

  TaskModel.findOneAndDelete({ _id: taskId, author: user.name })
    .then((deletedTask) => {
      if (deletedTask) {
        res.status(200).json(deletedTask);
      } else {
        res.status(404).json({ error: "Task not found" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: "Could not delete task" });
    });
});

export default app;
