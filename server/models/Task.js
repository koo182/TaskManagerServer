import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: [3, "Task title should be at least 3 characters long"],
    maxLength: [70, "Task title should be less than 30 characters"],
  },
  desc: {
    type: String,
    minLength: [3, "Description should be at least 3 characters long"],
    maxLength: [200, "Please write up to 200 characters"],
    required: false,
  },
  due_date: {
    type: String,
    required: false,
  },
  tags: {
    type: Array,
    required: false,
  },
  author: {
    type: String,
  },
  completed: {
    type: Boolean,
  },
});

const TaskModel = mongoose.model("tasks", TaskSchema);
export default TaskModel;
