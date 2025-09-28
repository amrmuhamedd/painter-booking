import React, { useState } from 'react';
import { Tabs, Card, Layout, Typography } from 'antd';
import AvailabilityForm from '../components/scheduling/AvailabilityForm';
import AvailabilityList from '../components/scheduling/AvailabilityList';
import PainterBookingList from '../components/scheduling/PainterBookingList';
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

const PainterDashboard: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState<number>(0);
  
  // Trigger a refresh of availability list after adding new availability
  const handleAvailabilityAdded = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <StyledLayout>
      <Navbar />
      <StyledContent>
        <Title level={2}>Painter Dashboard</Title>
      
        <Tabs defaultActiveKey="availability" type="card">
        <TabPane tab="Manage Availability" key="availability">
          <div style={{ display: 'flex', gap: '24px', flexDirection: 'column' }}>
            <Card title="Add Availability Slot">
              <AvailabilityForm onSuccess={handleAvailabilityAdded} />
            </Card>
            
            <Card title="Your Availability Slots">
              <AvailabilityList key={refreshKey} />
            </Card>
          </div>
        </TabPane>
        
        <TabPane tab="Upcoming Bookings" key="bookings">
          <Card title="Your Assigned Bookings">
            <PainterBookingList />
          </Card>
        </TabPane>
      </Tabs>
      </StyledContent>
    </StyledLayout>
  );
};

export default PainterDashboard;
