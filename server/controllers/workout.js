export const getWorkoutCategories = async (req, res, next) => {
  try {
    const categories = [
      "Chest",
      "Back",
      "Legs",
      "Shoulders",
      "Arms",
      "Core",
      "Cardio",
      "Flexibility",
      "Other",
    ];
    return res.status(200).json({ categories });
  } catch (err) {
    next(err);
  }
};
