import React, { useState } from 'react';
import { Form, Input, Button, Card, Descriptions, Empty, message, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { bookingApi } from '../../services/scheduling.api';
import type { Booking } from '../../services/scheduling.api';

// Enable UTC plugin for proper date handling
dayjs.extend(utc);

const PublicBookingTracker: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (values: { bookingId: string }) => {
    try {
      setLoading(true);
      const result = await bookingApi.getBookingById(values.bookingId);
      setBooking(result);
      setSearched(true);
    } catch (error) {
      console.error('Failed to find booking:', error);
      message.error('Booking not found. Please check your booking ID and try again.');
      setBooking(null);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (isoString: string) => {
    return dayjs(isoString).format('MMM DD, YYYY HH:mm');
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="ant-tag ant-tag-green">Confirmed</span>;
      case 'requested':
        return <span className="ant-tag ant-tag-blue">Requested</span>;
      case 'cancelled':
        return <span className="ant-tag ant-tag-red">Cancelled</span>;
      default:
        return <span className="ant-tag">{status}</span>;
    }
  };

  return (
    <div className="public-booking-tracker">
      <h2>Track Your Booking</h2>
      <p>Enter your booking ID to see the details of your appointment.</p>
      
      <Form
        form={form}
        layout="horizontal"
        onFinish={handleSearch}
        style={{ maxWidth: '500px', margin: '0 auto 20px' }}
      >
        <Form.Item
          name="bookingId"
          rules={[{ required: true, message: 'Please enter your booking ID' }]}
        >
          <Input 
            placeholder="Enter your booking ID" 
            size="large"
            prefix={<SearchOutlined />}
          />
        </Form.Item>
        <Form.Item>
          <Button 
            type="primary" 
            htmlType="submit" 
            loading={loading}
            block
          >
            Find Booking
          </Button>
        </Form.Item>
      </Form>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <Spin size="large" />
        </div>
      ) : searched && (
        <div className="booking-result">
          {booking ? (
            <Card title="Booking Details" bordered={false}>
              <Descriptions column={1}>
                <Descriptions.Item label="Booking ID">{booking.id}</Descriptions.Item>
                <Descriptions.Item label="Status">
                  {getStatusTag(booking.status)}
                </Descriptions.Item>
                <Descriptions.Item label="Date & Time">
                  {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
                </Descriptions.Item>
                <Descriptions.Item label="Painter">
                  {booking.painter?.name || 'Unassigned'}
                </Descriptions.Item>
                {booking.painter?.phone && (
                  <Descriptions.Item label="Painter Phone">
                    {booking.painter.phone}
                  </Descriptions.Item>
                )}
                {booking.painter?.rating && (
                  <Descriptions.Item label="Painter Rating">
                    {booking.painter.rating} / 5
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Booked On">
                  {formatDateTime(booking.createdAt)}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          ) : (
            <Empty
              description="No booking found with this ID"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PublicBookingTracker;
