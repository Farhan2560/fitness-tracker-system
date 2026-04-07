import mongoose from "mongoose";

const WorkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    workoutName: {
      type: String,
      required: true,
      trim: true,
    },
    sets: {
      type: Number,
      default: null,
    },
    reps: {
      type: Number,
      default: null,
    },
    weight: {
      type: Number,
      default: null,
    },
    duration: {
      type: Number,
      default: null,
      comment: "Duration in minutes",
    },
    caloriesBurned: {
      type: Number,
      default: null,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Workout", WorkoutSchema);
