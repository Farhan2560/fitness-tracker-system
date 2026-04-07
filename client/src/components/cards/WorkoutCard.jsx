import React from "react";
import styled from "styled-components";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

const Card = styled.div`
  background: #ffffff;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid #f3f4f6;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

const Header = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
`;

const CategoryBadge = styled.span`
  background: #f3e8ff;
  color: #9000ff;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  letter-spacing: 0.3px;
`;

const DeleteBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #9ca3af;
  padding: 2px;
  display: flex;
  align-items: center;
  border-radius: 6px;
  transition: color 0.2s, background 0.2s;
  &:hover {
    color: #dc2626;
    background: #fef2f2;
  }
`;

const WorkoutName = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 12px;
`;

const Details = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const Detail = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  background: #f9fafb;
  padding: 5px 10px;
  border-radius: 8px;
  font-size: 13px;
  color: #374151;
  font-weight: 500;
`;

const CalorieRow = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px dashed #f3f4f6;
  font-size: 13px;
  color: #f97316;
  font-weight: 600;
`;

const WorkoutCard = ({ workout, onDelete }) => {
  return (
    <Card>
      <Header>
        <CategoryBadge>{workout.category}</CategoryBadge>
        <DeleteBtn onClick={() => onDelete(workout._id)} title="Delete workout">
          <DeleteOutlineIcon style={{ fontSize: 18 }} />
        </DeleteBtn>
      </Header>
      <WorkoutName>
        <FitnessCenterIcon
          style={{ fontSize: 16, marginRight: 6, color: "#9000ff" }}
        />
        {workout.workoutName}
      </WorkoutName>
      <Details>
        {workout.sets && (
          <Detail>
            <span>🔁</span> {workout.sets} sets
          </Detail>
        )}
        {workout.reps && (
          <Detail>
            <span>🔢</span> {workout.reps} reps
          </Detail>
        )}
        {workout.weight && (
          <Detail>
            <span>⚖️</span> {workout.weight} kg
          </Detail>
        )}
        {workout.duration && (
          <Detail>
            <span>⏱️</span> {workout.duration} min
          </Detail>
        )}
      </Details>
      <CalorieRow>
        <LocalFireDepartmentIcon style={{ fontSize: 16 }} />
        {workout.caloriesBurned || 0} kcal burned
      </CalorieRow>
    </Card>
  );
};

export default WorkoutCard;
