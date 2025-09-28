import {TeamOutlined, ScheduleOutlined, BgColorsOutlined, ToolOutlined } from '@ant-design/icons';
import { Flex, Typography, List } from 'antd';
import styled from 'styled-components';

const { Title, Text } = Typography;

const TABLET = '1024px';

const ResponsiveFlex = styled(Flex)`
  height: 100%;
  background-color: #0D92F4;
  color: white;

  @media (max-width: ${TABLET}) {
    padding: 24px;
  }
`;

const ResponsiveTitle = styled(Title)`
  &.ant-typography {
    color: white;
    margin-top: 24px;
    text-align: center;

    @media (max-width: ${TABLET}) {
      margin-top: 16px;
      font-size: 24px !important;
    }
  }
`;

const ResponsiveText = styled(Text)`
  &.ant-typography {
    color: white;
    text-align: center;
    font-size: 16px;
    max-width: 400px;

    @media (max-width: ${TABLET}) {
      font-size: 14px;
      max-width: 300px;
    }
  }
`;

const FeatureList = styled(List)`
  margin-top: 20px;
  width: 90%;
  max-width: 400px;

  .ant-list-item {
    border-bottom: none;
    padding: 8px 0;
  }

  .anticon {
    color: rgba(255, 255, 255, 0.85);
    margin-right: 8px;
  }
  
  .ant-typography {
    color: white;
  }
`;

const IconContainer = styled.div`
  font-size: 48px;
  color: white;
  border: 2px dashed white;
  border-radius: 50%;
  padding: 16px;

  @media (max-width: ${TABLET}) {
    font-size: 32px;
    padding: 12px;
  }
`;

const IconGroup = styled(Flex)`
  margin-top: 32px;

  @media (max-width: ${TABLET}) {
    margin-top: 24px;

    .anticon {
      font-size: 20px !important;
    }
  }
`;

export default function AuthSide() {
  return (
    <ResponsiveFlex vertical justify="center" align="center">
      <IconContainer>
        <BgColorsOutlined />
      </IconContainer>

      <ResponsiveTitle level={2}>Painter Booking System</ResponsiveTitle>

      <ResponsiveText>
        Connect with skilled painters and manage your appointments with ease
      </ResponsiveText>

      <FeatureList
        size="small"
        dataSource={[
          { icon: <ScheduleOutlined />, text: 'Book appointments online' },
          { icon: <ToolOutlined />, text: 'Track booking progress' },
        ]}
        renderItem={(item: any) => (
          <List.Item>
            <Flex align="center">
              {item.icon}
              <Text>{item.text}</Text>
            </Flex>
          </List.Item>
        )}
      />

      <IconGroup gap="middle">
        <BgColorsOutlined style={{ fontSize: '24px' }} />
        <TeamOutlined style={{ fontSize: '24px' }} />
        <ScheduleOutlined style={{ fontSize: '24px' }} />
      </IconGroup>
    </ResponsiveFlex>
  );
}
