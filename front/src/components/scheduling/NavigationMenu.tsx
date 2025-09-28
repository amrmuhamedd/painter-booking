import React from 'react';
import { Button, Dropdown, Space } from 'antd';
import { DownOutlined, UserOutlined, ScheduleOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import type { MenuProps } from 'antd';
import { UserRole } from '../../types/user';

const NavigationMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo } = useSelector((state: RootState) => state.auth);

  const getMenuItems = () => {
    const baseItems = [
      {
        key: '/',
        label: 'Home',
        icon: <UserOutlined />,
        onClick: () => navigate('/'),
      },
    ];

    if (userInfo?.role === UserRole.PAINTER) {
      baseItems.push({
        key: '/painter-dashboard',
        label: 'Painter Dashboard',
        icon: <ScheduleOutlined />,
        onClick: () => navigate('/painter-dashboard'),
      });
    } else {
      baseItems.push({
        key: '/customer-dashboard',
        label: 'Customer Dashboard',
        icon: <UserOutlined />,
        onClick: () => navigate('/customer-dashboard'),
      });
    }

    return baseItems;
  };

  const items: MenuProps['items'] = getMenuItems();

  const getCurrentPageName = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/painter-dashboard':
        return 'Painter Dashboard';
      case '/customer-dashboard':
        return 'Customer Dashboard';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div style={{ marginBottom: 20 }}>
      <Dropdown 
        menu={{ items }} 
        placement="bottomRight"
      >
        <Button>
          <Space>
            {getCurrentPageName()}
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </div>
  );
};

export default NavigationMenu;
