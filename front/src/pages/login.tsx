import styled from 'styled-components';

import AuthSide from '../components/auth/auth-side';
import { LoginForm } from '../components/auth/loginForm'; 
const TABLET = '1024px';
const MOBILE = '768px';

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;

  @media (max-width: ${TABLET}) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`;

const FormSection = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  order: 2;

  @media (max-width: ${TABLET}) {
    order: 2;
    padding: 0;
  }
`;

const SideSection = styled.div`
  order: 1;
  height: 100%;

  @media (max-width: ${TABLET}) {
    order: 1;
    height: 200px;
  }

  @media (max-width: ${MOBILE}) {
    display: none;
  }
`;

export const Login = () => {
  return (
    <Container>
      <SideSection>
        <AuthSide />
      </SideSection>
      <FormSection>
        <LoginForm />
      </FormSection>
    </Container>
  );
};
