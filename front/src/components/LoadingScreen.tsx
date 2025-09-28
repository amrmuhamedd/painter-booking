import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
`;

const LoaderWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 24px;
`;

const Spinner = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Logo = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #3b82f6;
  mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M20 12a8 8 0 01-8 8v-2a6 6 0 006-6h2zm-8 8a8 8 0 01-8-8h2a6 6 0 006 6v2zm-8-8a8 8 0 018-8v2a6 6 0 00-6 6H4zm8-8a8 8 0 018 8h-2a6 6 0 00-6-6V4z'/%3E%3C/svg%3E") center/contain no-repeat;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const Text = styled.h2`
  color: #1e293b;
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  text-align: center;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

interface LoadingScreenProps {
  message?: string;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <Container>
      <LoaderWrapper>
        <Spinner />
        <Logo />
      </LoaderWrapper>
      <Text>{message}</Text>
    </Container>
  );
};

export default LoadingScreen;
