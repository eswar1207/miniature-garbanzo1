import styled from 'styled-components';
import { Card, Button } from 'antd';

export const GradientBackground = styled.div`
  background: linear-gradient(120deg, #1a237e, #0d47a1);
  min-height: 100vh;
  padding: 24px;
`;

export const ElegantCard = styled(Card)`
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

export const PageTitle = styled.h1`
  font-size: 28px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 24px;
`;

export const StyledButton = styled(Button)`
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(24, 144, 255, 0.2);
  }
`;
