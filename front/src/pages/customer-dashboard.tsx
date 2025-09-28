import React, { useState } from 'react';
import { Tabs, Card, Layout, Typography } from 'antd';
import BookingRequestForm from '../components/scheduling/BookingRequestForm';
import CustomerBookingList from '../components/scheduling/CustomerBookingList';
import Navbar from '../components/layout/Navbar';
import styled from 'styled-components';

const { Title } = Typography;
const { TabPane } = Tabs;
const { Content } = Layout;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledContent = styled(Content)`
  padding: 24px;
  margin: 0;
  min-height: calc(100vh - 64px);
  background: #f0f2f5;
`;

const CustomerDashboard: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  
  const handleBookingCreated = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <StyledLayout>
      <Navbar />
      <StyledContent>
        <Title level={2}>Customer Dashboard</Title>
      
        <Tabs defaultActiveKey="bookings" type="card">
        <TabPane tab="Request Booking" key="request">
          <Card>
            <BookingRequestForm onSuccess={handleBookingCreated} />
          </Card>
        </TabPane>
        
        <TabPane tab="My Bookings" key="bookings">
          <Card title="Your Bookings">
            <CustomerBookingList refreshTrigger={refreshKey} />
          </Card>
        </TabPane>
      </Tabs>
      </StyledContent>
    </StyledLayout>
  );
};

export default CustomerDashboard;
