import { Link } from 'react-router-dom';

import styled from 'styled-components';

const MOBILE = '768px';
const SMALL = '576px';

export const AuthWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #f6f8fc 0%, #e9eef8 100%);

  @media (max-width: ${MOBILE}) {
    padding: 0 12px;
  }
`;

export const AuthFormContainer = styled.div`
  width: 420px;
  padding: 32px;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border-radius: 16px;

  @media (max-width: ${MOBILE}) {
    width: 100%;
    max-width: 420px;
    padding: 20px;
  }

  @media (max-width: ${SMALL}) {
    padding: 20px;
  }
`;

export const StyledAuthLink = styled(Link)`
  color: #1890ff;
  transition: all 0.3s;
  &:hover {
    color: #40a9ff;
  }
`;



export const BottomText = styled.div`
  text-align: center;
  margin-top: 24px;
  color: #6b7280;

  @media (max-width: ${SMALL}) {
    margin-top: 20px;
  }
`;

export const ErrorMessage = styled.div`
  padding: 12px;
  background: #fef2f2;
  border-radius: 8px;
  margin-bottom: 16px;
  color: #dc2626;
`;


