import React from 'react';
import { Layout, Menu, Button, Typography, Avatar } from 'antd';
import { LogoutOutlined, UserOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../store/store';
import { logoutUser } from '../../store/auth/authSlice';
import { UserRole } from '../../types/user';
import styled from 'styled-components';

const { Header } = Layout;
const { Title } = Typography;

const StyledHeader = styled(Header)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 64px;
`;

const Logo = styled(Title)`
  margin: 0 !important;
  color: #1890ff !important;
  font-size: 18px !important;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo } = useSelector((state: RootState) => state.auth);
  
  const handleLogout = async () => {
    await dispatch(logoutUser());
  };
  
  const goHome = () => {
    if (userInfo?.role === UserRole.PAINTER) {
      navigate('/painter-dashboard');
    } else {
      navigate('/customer-dashboard');
    }
  };
  
  return (
    <StyledHeader>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Logo level={4} onClick={goHome} style={{ cursor: 'pointer' }}>
          <HomeOutlined /> Painter Booking
        </Logo>
      </div>
      
      <Menu
        mode="horizontal"
        style={{ flex: 1, justifyContent: 'center', border: 'none' }}
        selectedKeys={[window.location.pathname]}
      >
        {userInfo?.role === UserRole.PAINTER ? (
          <Menu.Item 
            key="/painter-dashboard" 
            onClick={() => navigate('/painter-dashboard')}
          >
            Painter Dashboard
          </Menu.Item>
        ) : (
          <Menu.Item 
            key="/customer-dashboard" 
            onClick={() => navigate('/customer-dashboard')}
          >
            Customer Dashboard
          </Menu.Item>
        )}
      </Menu>
      
      <RightSection>
        {userInfo && (
          <UserInfo>
            <Avatar icon={<UserOutlined />} />
            <span>{userInfo.name}</span>
          </UserInfo>
        )}
        <Button 
          type="primary" 
          icon={<LogoutOutlined />} 
          onClick={handleLogout}
        >
          Logout
        </Button>
      </RightSection>
    </StyledHeader>
  );
};

export default Navbar;
