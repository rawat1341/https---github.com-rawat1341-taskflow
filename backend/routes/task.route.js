import express from 'express';
import { userAuth } from '../middlewares/auth.middleware.js';
import {
  createTask,
  getTasks,
  updateTaskStatus,
  deleteTask,
  getTaskById,
  updateTask,
} from '../controllers/task.controller.js';
import { createTaskSchema, updateTaskSchema } from '../utils/validator.js';
import { validate } from '../middlewares/validate.middleware.js';

const router = express.Router();

router.post('/create', userAuth, validate(createTaskSchema), createTask);
router.get('/get', userAuth, getTasks);
router.get('/get/:id', userAuth, getTaskById);
router.put('/update/:id', userAuth, validate(updateTaskSchema), updateTask);
router.patch('/:id/status', userAuth, updateTaskStatus);
router.delete('/delete/:id', userAuth, deleteTask);

export default router;
