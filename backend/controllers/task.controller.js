// controllers/task.controller.js
import Task from '../models/task.model.js';

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const { title, description, status, priorityType } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      priorityType,
      userId: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL TASKS (only logged user)
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  GET SINGLE TASK
export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  UPDATE FULL TASK (except userId)
export const updateTask = async (req, res) => {
  try {
    const { title, description, status, priorityType } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title, description, status, priorityType },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ONLY STATUS
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ['Pending', 'In progress', 'Completed'];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { status },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//  DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
