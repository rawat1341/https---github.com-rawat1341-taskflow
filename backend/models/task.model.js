import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ['Pending', 'In progress', 'Completed'],
      default: 'Pending',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    priorityType: {
      type: String,
      enum: ['Professional', 'Personal'],
      default: 'Personal',
      set: (value) => {
        if (typeof value !== 'string') return value;
        const normalizedValue = value.toLowerCase();
        return normalizedValue.charAt(0).toUpperCase() + normalizedValue.slice(1);
      },
    },
  },
  { timestamps: true }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
