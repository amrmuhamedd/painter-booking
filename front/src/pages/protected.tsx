import { Layout, Button, Typography, Card, Spin } from "antd";
import styled from "styled-components";
import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../store/store";
import { logoutUser, getUserInfo } from "../store/auth/authSlice";
import { useEffect } from "react";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
`;

const StyledContent = styled(Content)`
  margin: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const UserCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  margin-bottom: 20px;
`;

const UserInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
`;

const UserInfoItem = styled.div`
  display: flex;
  align-items: center;
`;

const Label = styled(Text)`
  font-weight: bold;
  margin-right: 8px;
`;

function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { userInfo, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!userInfo && !loading && !error) {
      dispatch(getUserInfo());
    }
  }, [dispatch, userInfo, loading, error]);

  const handleLogout = async () => {
    await dispatch(logoutUser()).unwrap();
  };

  return (
    <StyledLayout>
      <Layout>
        <StyledContent>
          <Title level={3}>Protected Dashboard</Title>
          
          {loading ? (
            <Spin size="large" tip="Loading user info..." />
          ) : error ? (
            <Paragraph type="danger">{error}</Paragraph>
          ) : userInfo ? (
            <UserCard
              title={
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <UserOutlined style={{ marginRight: 8 }} /> User Information
                </div>
              }
            >
              <UserInfoWrapper>
                <UserInfoItem>
                  <Label>ID:</Label>
                  <Text>{userInfo._id}</Text>
                </UserInfoItem>
                <UserInfoItem>
                  <Label>Name:</Label>
                  <Text>{userInfo.name}</Text>
                </UserInfoItem>
                <UserInfoItem>
                  <Label>Email:</Label>
                  <Text>{userInfo.email}</Text>
                </UserInfoItem>
              </UserInfoWrapper>
            </UserCard>
          ) : (
            <Paragraph>No user information available</Paragraph>
          )}
          
          <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>
            Logout
          </Button>
        </StyledContent>
      </Layout>
    </StyledLayout>
  );
}

export default Dashboard;
