import React from "react";
import styled from "styled-components";

const Card = styled.div`
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border: 1px solid #f3f4f6;
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }
`;

const IconWrap = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ bg }) => bg || "#f3e8ff"};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
  color: ${({ color }) => color || "#9000ff"};
  font-size: 22px;
`;

const Label = styled.p`
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
`;

const Value = styled.h3`
  font-size: 28px;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1;
`;

const Unit = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #9ca3af;
  margin-left: 4px;
`;

const Desc = styled.p`
  font-size: 12px;
  color: #9ca3af;
`;

const CountsCard = ({ item }) => {
  return (
    <Card>
      <IconWrap bg={item.bg} color={item.color}>
        {item.icon}
      </IconWrap>
      <Label>{item.name}</Label>
      <Value>
        {item.value}
        {item.unit && <Unit>{item.unit}</Unit>}
      </Value>
      {item.desc && <Desc>{item.desc}</Desc>}
    </Card>
  );
};

export default CountsCard;
