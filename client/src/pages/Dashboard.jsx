import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import CountsCard from "../components/cards/CountsCard";
import WorkoutCard from "../components/cards/WorkoutCard";
import {
  getDashboardDetails,
  getWorkouts,
  addWorkout,
  deleteWorkout,
} from "../utils/api";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SpeedIcon from "@mui/icons-material/Speed";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ─── Styled ───────────────────────────────────────────────────────────────────

const Page = styled.div`
  min-height: 100vh;
  background: #f5f5f5;
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 16px;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
`;

const MainGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ChartCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #f3f4f6;
`;

const ChartTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 20px;
`;

const WorkoutSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const WorkoutList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const AddWorkoutCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #f3f4f6;
  height: fit-content;
`;

const DateRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
`;

const DateLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const DateInput = styled.input`
  padding: 8px 12px;
  border: 1.5px solid #e5e7eb;
  border-radius: 8px;
  font-size: 13px;
  font-family: "Inter", sans-serif;
  outline: none;
  &:focus {
    border-color: #9000ff;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  min-height: 160px;
  padding: 12px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 13px;
  font-family: "Inter", monospace;
  line-height: 1.6;
  outline: none;
  resize: vertical;
  color: #374151;
  &:focus {
    border-color: #9000ff;
  }
`;

const HintBox = styled.div`
  background: #f9fafb;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 14px;
  line-height: 1.8;
  code {
    background: #e5e7eb;
    border-radius: 4px;
    padding: 1px 5px;
    font-family: monospace;
    color: #374151;
  }
`;

const AddBtn = styled.button`
  width: 100%;
  padding: 12px;
  background: linear-gradient(90deg, #9000ff, #c050ff);
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  font-family: "Inter", sans-serif;
  cursor: pointer;
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: opacity 0.2s;
  &:hover {
    opacity: 0.9;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.p`
  color: #dc2626;
  font-size: 12px;
  margin-top: 8px;
`;

const SuccessMsg = styled.p`
  color: #16a34a;
  font-size: 12px;
  margin-top: 8px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 14px;
`;

const LoadingOverlay = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

// ─── Constants ───────────────────────────────────────────────────────────────

const PIE_COLORS = [
  "#9000ff", "#c050ff", "#ff4d4d", "#f97316", "#22c55e", "#3b82f6",
  "#ec4899", "#84cc16",
];

const todayStr = () => new Date().toISOString().split("T")[0];

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const [dashData, setDashData] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [totalCalToday, setTotalCalToday] = useState(0);
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [workoutInput, setWorkoutInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await getDashboardDetails();
      setDashData(res.data);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    }
  }, []);

  const fetchWorkouts = useCallback(async (date) => {
    try {
      const res = await getWorkouts(date);
      setWorkouts(res.data.todayWorkouts || []);
      setTotalCalToday(res.data.totalCaloriesBurnt || 0);
    } catch (err) {
      console.error("Failed to load workouts", err);
    }
  }, []);

  useEffect(() => {
    const loadAll = async () => {
      setLoading(true);
      await Promise.all([fetchDashboard(), fetchWorkouts(selectedDate)]);
      setLoading(false);
    };
    loadAll();
  }, [fetchDashboard, fetchWorkouts, selectedDate]);

  const handleAddWorkout = async () => {
    if (!workoutInput.trim()) {
      setAddError("Please enter your workout details.");
      return;
    }
    setAddError("");
    setAddSuccess("");
    setAddLoading(true);
    try {
      await addWorkout({ workoutString: workoutInput });
      setWorkoutInput("");
      setAddSuccess("Workouts added successfully! 🎉");
      await Promise.all([fetchDashboard(), fetchWorkouts(selectedDate)]);
    } catch (err) {
      setAddError(
        err?.response?.data?.message || "Failed to add workout. Check format."
      );
    } finally {
      setAddLoading(false);
    }
  };

  const handleDeleteWorkout = async (id) => {
    try {
      await deleteWorkout(id);
      await Promise.all([fetchDashboard(), fetchWorkouts(selectedDate)]);
    } catch (err) {
      console.error("Failed to delete workout", err);
    }
  };

  const statsCards = dashData
    ? [
        {
          name: "Calories Burned (Week)",
          value: dashData.totalCaloriesBurnt || 0,
          unit: "kcal",
          icon: <LocalFireDepartmentIcon style={{ fontSize: 22 }} />,
          bg: "#fff7ed",
          color: "#f97316",
          desc: "Total this week",
        },
        {
          name: "Workouts Today",
          value: dashData.totalWorkoutsDone || 0,
          unit: "",
          icon: <FitnessCenterIcon style={{ fontSize: 22 }} />,
          bg: "#f3e8ff",
          color: "#9000ff",
          desc: "Sessions completed",
        },
        {
          name: "Avg Cal / Workout",
          value: dashData.avgCaloriesBurntPerWorkout || 0,
          unit: "kcal",
          icon: <SpeedIcon style={{ fontSize: 22 }} />,
          bg: "#fef2f2",
          color: "#dc2626",
          desc: "Weekly average",
        },
        {
          name: "Weekly Sessions",
          value: dashData.totalWeeklyWorkouts || 0,
          unit: "",
          icon: <CalendarTodayIcon style={{ fontSize: 22 }} />,
          bg: "#f0fdf4",
          color: "#16a34a",
          desc: "Workouts this week",
        },
      ]
    : [];

  return (
    <Page>
      <Navbar />
      <Content>
        {loading ? (
          <LoadingOverlay>
            <CircularProgress style={{ color: "#9000ff" }} />
          </LoadingOverlay>
        ) : (
          <>
            {/* Stats */}
            <SectionTitle>📊 Weekly Overview</SectionTitle>
            <StatsGrid>
              {statsCards.map((item, i) => (
                <CountsCard key={i} item={item} />
              ))}
            </StatsGrid>

            {/* Charts */}
            <MainGrid>
              <ChartCard>
                <ChartTitle>🔥 Calories Burned (Last 7 Days)</ChartTitle>
                {dashData?.caloriesBurnedPerDay?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={dashData.caloriesBurnedPerDay}>
                      <defs>
                        <linearGradient
                          id="calGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#9000ff"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#9000ff"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis
                        dataKey="day"
                        tick={{ fontSize: 12, fill: "#9ca3af" }}
                      />
                      <YAxis tick={{ fontSize: 12, fill: "#9ca3af" }} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 10,
                          border: "1px solid #e5e7eb",
                          fontSize: 13,
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="calories"
                        stroke="#9000ff"
                        strokeWidth={2.5}
                        fill="url(#calGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState>No data yet. Log some workouts!</EmptyState>
                )}
              </ChartCard>

              <ChartCard>
                <ChartTitle>🏋️ Workout Categories (This Week)</ChartTitle>
                {dashData?.pieChartData?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={dashData.pieChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={false}
                      >
                        {dashData.pieChartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: 10,
                          border: "1px solid #e5e7eb",
                          fontSize: 13,
                        }}
                      />
                      <Legend
                        iconType="circle"
                        iconSize={10}
                        wrapperStyle={{ fontSize: 12 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState>No categories yet. Start logging!</EmptyState>
                )}
              </ChartCard>
            </MainGrid>

            {/* Workouts */}
            <DateRow>
              <SectionTitle style={{ margin: 0 }}>💪 Workouts</SectionTitle>
              <DateLabel>
                <CalendarTodayIcon style={{ fontSize: 16 }} />
                <DateInput
                  type="date"
                  value={selectedDate}
                  max={todayStr()}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </DateLabel>
            </DateRow>

            <WorkoutSection>
              {/* Workout list */}
              <div>
                {workouts.length === 0 ? (
                  <EmptyState>
                    No workouts logged for this date. Add one! →
                  </EmptyState>
                ) : (
                  <WorkoutList>
                    {workouts.map((w) => (
                      <WorkoutCard
                        key={w._id}
                        workout={w}
                        onDelete={handleDeleteWorkout}
                      />
                    ))}
                  </WorkoutList>
                )}
                {workouts.length > 0 && (
                  <p
                    style={{
                      marginTop: 16,
                      fontSize: 14,
                      color: "#f97316",
                      fontWeight: 600,
                    }}
                  >
                    🔥 Total calories burned today: {totalCalToday} kcal
                  </p>
                )}
              </div>

              {/* Add workout */}
              <AddWorkoutCard>
                <ChartTitle>➕ Log a Workout</ChartTitle>
                <HintBox>
                  <strong>Format:</strong>
                  <br />
                  <code>#Category</code>
                  <br />
                  <code>-Exercise Name</code>
                  <br />
                  <code>-Sets x Reps</code> (e.g. <code>-3 x 12</code>)
                  <br />
                  <code>-Weight kg</code> (e.g. <code>-60 kg</code>)
                  <br />
                  <br />
                  For cardio use <code>-30 min</code> instead of sets/reps.
                </HintBox>
                <Textarea
                  placeholder={"#Chest\n-Bench Press\n-3 x 10\n-80 kg\n\n#Cardio\n-Running\n-30 min"}
                  value={workoutInput}
                  onChange={(e) => {
                    setWorkoutInput(e.target.value);
                    setAddError("");
                    setAddSuccess("");
                  }}
                />
                {addError && <ErrorMsg>{addError}</ErrorMsg>}
                {addSuccess && <SuccessMsg>{addSuccess}</SuccessMsg>}
                <AddBtn onClick={handleAddWorkout} disabled={addLoading}>
                  {addLoading ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <>
                      <AddIcon style={{ fontSize: 18 }} />
                      Add Workout
                    </>
                  )}
                </AddBtn>
              </AddWorkoutCard>
            </WorkoutSection>
          </>
        )}
      </Content>
    </Page>
  );
};

export default Dashboard;
