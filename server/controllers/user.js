import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import Workout from "../models/Workout.js";
import { createError } from "../error.js";

// ─── Auth ───────────────────────────────────────────────────────────────────

export const UserRegister = async (req, res, next) => {
  try {
    const { email, password, name, img } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return next(createError(400, "Invalid input."));
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() }).exec();
    if (existingUser) {
      return next(createError(409, "Email is already in use."));
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = new User({ name, email: email.toLowerCase(), password: hashedPassword, img });
    const createdUser = await user.save();

    const token = jwt.sign({ id: createdUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ token, user: createdUser });
  } catch (err) {
    next(err);
  }
};

export const UserLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || typeof password !== "string") {
      return next(createError(400, "Invalid input."));
    }

    const user = await User.findOne({ email: email.toLowerCase() }).exec();
    if (!user) {
      return next(createError(404, "User not found."));
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(403, "Incorrect password."));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({ token, user });
  } catch (err) {
    next(err);
  }
};

// ─── Dashboard ──────────────────────────────────────────────────────────────

export const getUserDashboard = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User not found."));

    const currentDate = new Date();

    // Total calories burned this week
    const startOfWeek = new Date(
      currentDate.setDate(currentDate.getDate() - currentDate.getDay())
    );
    startOfWeek.setHours(0, 0, 0, 0);

    const thisWeekWorkouts = await Workout.find({
      user: userId,
      date: { $gte: startOfWeek },
    });

    const totalCaloriesBurnt = thisWeekWorkouts.reduce(
      (acc, w) => acc + (w.caloriesBurned || 0),
      0
    );

    // Total workouts done today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayWorkouts = await Workout.find({
      user: userId,
      date: { $gte: today, $lt: tomorrow },
    });

    const totalWorkoutsDone = todayWorkouts.length;

    // Average calories per workout this week
    const avgCaloriesBurntPerWorkout =
      thisWeekWorkouts.length > 0
        ? totalCaloriesBurnt / thisWeekWorkouts.length
        : 0;

    // Weekly calories chart data (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      last7Days.push(d);
    }

    const caloriesBurnedPerDay = await Promise.all(
      last7Days.map(async (day) => {
        const nextDay = new Date(day);
        nextDay.setDate(nextDay.getDate() + 1);
        const workouts = await Workout.find({
          user: userId,
          date: { $gte: day, $lt: nextDay },
        });
        const calories = workouts.reduce(
          (acc, w) => acc + (w.caloriesBurned || 0),
          0
        );
        return {
          day: day.toLocaleDateString("en-US", { weekday: "short" }),
          calories,
        };
      })
    );

    // Pie chart: workout categories this week
    const categoryMap = {};
    thisWeekWorkouts.forEach((w) => {
      categoryMap[w.category] = (categoryMap[w.category] || 0) + 1;
    });
    const pieChartData = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value,
    }));

    return res.status(200).json({
      user,
      totalCaloriesBurnt,
      totalWorkoutsDone,
      avgCaloriesBurntPerWorkout: Math.round(avgCaloriesBurntPerWorkout),
      totalWeeklyWorkouts: thisWeekWorkouts.length,
      caloriesBurnedPerDay,
      pieChartData,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Workouts ────────────────────────────────────────────────────────────────

export const getWorkoutsByDate = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const user = await User.findById(userId);
    if (!user) return next(createError(404, "User not found."));

    let date = req.query.date ? new Date(req.query.date) : new Date();
    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const todayWorkouts = await Workout.find({
      user: userId,
      date: { $gte: date, $lt: nextDay },
    });

    const totalCaloriesBurnt = todayWorkouts.reduce(
      (acc, w) => acc + (w.caloriesBurned || 0),
      0
    );

    return res.status(200).json({ todayWorkouts, totalCaloriesBurnt });
  } catch (err) {
    next(err);
  }
};

// Estimate calories burned based on category, sets, reps, weight, duration
const estimateCalories = (category, sets, reps, weight, duration) => {
  const baseMET = {
    Chest: 6,
    Back: 6,
    Legs: 7,
    Shoulders: 5,
    Arms: 4,
    Core: 5,
    Cardio: 8,
    Flexibility: 3,
    Other: 5,
  };
  const met = baseMET[category] || 5;
  if (duration) {
    // For cardio/duration-based workouts: MET * duration (minutes) * 0.0175 * 70kg (avg)
    return Math.round(met * duration * 0.0175 * 70);
  }
  if (sets && reps) {
    // For strength: approximate 0.1 cal per rep, scaled by weight
    const weightFactor = weight ? 1 + weight / 100 : 1;
    return Math.round(sets * reps * 0.1 * met * weightFactor);
  }
  return 0;
};

export const addWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { workoutString } = req.body;

    if (!workoutString) {
      return next(createError(400, "Workout string is required."));
    }

    // Parse multi-workout string format:
    // #Category
    // -WorkoutName
    // -Sets x Reps  (or -Duration min)
    // -Weight kg
    // (blank line between workouts)
    const eachWorkout = workoutString.split("#").filter((s) => s.trim());
    const parsedWorkouts = [];

    for (const section of eachWorkout) {
      const lines = section
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l);

      if (lines.length < 2) {
        return next(
          createError(400, "Each workout must have a category and a name.")
        );
      }

      const category = lines[0];
      const exercises = [];
      let i = 1;

      while (i < lines.length) {
        if (!lines[i].startsWith("-")) {
          i++;
          continue;
        }
        const workoutName = lines[i].substring(1).trim();
        let sets = null,
          reps = null,
          weight = null,
          duration = null;

        if (i + 1 < lines.length && lines[i + 1].startsWith("-")) {
          // Could be "3 x 12" or "30 min"
          const detail = lines[i + 1].substring(1).trim().toLowerCase();
          if (detail.includes("x")) {
            const parts = detail.split("x").map((p) => parseInt(p.trim()));
            sets = parts[0] || null;
            reps = parts[1] || null;
          } else if (detail.includes("min")) {
            duration = parseInt(detail) || null;
          }
          i++;
        }

        if (i + 1 < lines.length && lines[i + 1].startsWith("-")) {
          const detail = lines[i + 1].substring(1).trim().toLowerCase();
          if (detail.includes("kg")) {
            weight = parseFloat(detail) || null;
          }
          i++;
        }

        const caloriesBurned = estimateCalories(
          category,
          sets,
          reps,
          weight,
          duration
        );

        exercises.push({
          user: userId,
          category,
          workoutName,
          sets,
          reps,
          weight,
          duration,
          caloriesBurned,
        });
        i++;
      }

      parsedWorkouts.push(...exercises);
    }

    if (parsedWorkouts.length === 0) {
      return next(createError(400, "No valid workouts found in input."));
    }

    const savedWorkouts = await Workout.insertMany(parsedWorkouts);
    return res.status(201).json({
      message: "Workouts added successfully!",
      workouts: savedWorkouts,
    });
  } catch (err) {
    next(err);
  }
};

export const deleteWorkout = async (req, res, next) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createError(400, "Invalid workout ID."));
    }

    const workout = await Workout.findOneAndDelete({ _id: id, user: userId });
    if (!workout) {
      return next(
        createError(404, "Workout not found or not authorized to delete.")
      );
    }

    return res.status(200).json({ message: "Workout deleted successfully." });
  } catch (err) {
    next(err);
  }
};
