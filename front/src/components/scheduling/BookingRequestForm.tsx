import React, { useState } from 'react';
import { Form, DatePicker, Button, message, Alert, Modal, List, Typography } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { v4 as uuidv4 } from 'uuid';
import { bookingApi } from '../../services/scheduling.api';
import type { CreateBookingDto, BookingSuggestion } from '../../services/scheduling.api';

// Enable UTC plugin for proper date handling
dayjs.extend(utc);

const { RangePicker } = DatePicker;
const { Text } = Typography;

const BookingRequestForm: React.FC<{ onSuccess?: (bookingId: string) => void }> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<BookingSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showNoSlotsMessage, setShowNoSlotsMessage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successBooking, setSuccessBooking] = useState<{ id: string, startTime: string, endTime: string } | null>(null);

  const handleSubmit = async (values: { dateRange: [dayjs.Dayjs, dayjs.Dayjs] }) => {
    try {
      setLoading(true);
      
      const clientRequestId = uuidv4();
      
      const bookingData: CreateBookingDto = {
        startTime: values.dateRange[0].utc().format(),
        endTime: values.dateRange[1].utc().format(),
        clientRequestId,
      };
      
      const booking = await bookingApi.createAuthenticatedBooking(bookingData);
      
      form.resetFields();
      
      setSuccessBooking({
        id: booking.id,
        startTime: booking.startTime,
        endTime: booking.endTime
      });
      setShowSuccessModal(true);
      
      if (onSuccess && booking?.id) {
        onSuccess(booking.id);
      }
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      
      if (error.response?.status === 409) {
        if (error.response?.data?.suggestions?.length > 0) {
          setSuggestions(error.response.data.suggestions);
          setShowSuggestions(true);
        } else {
          setShowNoSlotsMessage(true);
          setShowNoSlotsMessage(true);
          message.error('No painters are available for booking at this time');
        }
      } else {
        message.error(error.response?.data?.error || 'Failed to create booking');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookSuggestion = async (suggestion: BookingSuggestion) => {
    try {
      setLoading(true);
      const clientRequestId = uuidv4();
      
      const bookingData: CreateBookingDto = {
        startTime: suggestion.startTime,
        endTime: suggestion.endTime,
        clientRequestId,
      };
      
      const booking = await bookingApi.createAuthenticatedBooking(bookingData);
      
      setShowSuggestions(false);
      
      form.resetFields();
      
      setSuccessBooking({
        id: booking.id,
        startTime: booking.startTime,
        endTime: booking.endTime
      });
      setShowSuccessModal(true);
      
      if (onSuccess && booking?.id) {
        onSuccess(booking.id);
      }
    } catch (error: any) {
      console.error('Failed to book suggestion:', error);
      message.error(error.response?.data?.error || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  const formatDateTime = (isoString: string) => {
    return dayjs(isoString).format('MMM DD, YYYY HH:mm');
  };

  return (
    <div className="booking-form-container">
      <h2>Request a Booking</h2>
      <Form 
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="dateRange"
          label="Booking Time Range"
          rules={[
            { required: true, message: 'Please select a time range' },
            {
              validator: (_, value) => {
                if (!value) return Promise.resolve();
                
                const [start, end] = value;
                const minDuration = 15 * 60 * 1000; 
                const maxDuration = 8 * 60 * 60 * 1000; 
                const duration = end.valueOf() - start.valueOf();
                
                if (duration < minDuration) {
                  return Promise.reject('Booking must be at least 15 minutes long');
                }
                
                if (duration > maxDuration) {
                  return Promise.reject('Booking cannot be longer than 8 hours');
                }
                
                return Promise.resolve();
              }
            }
          ]}
        >
          <RangePicker 
            showTime={{ format: 'HH:mm' }}
            format="YYYY-MM-DD HH:mm"
            disabledDate={disabledDate}
            style={{ width: '100%' }}
          />
        </Form.Item>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Request Booking
          </Button>
        </Form.Item>
      </Form>

      <Alert
        message="Note"
        description="When you request a booking, our system will automatically assign you to an available painter that matches your requested time slot."
        type="info"
        showIcon
        style={{ marginTop: '20px' }}
      />

      <Modal
        title="No Painters Available for Your Requested Time"
        open={showSuggestions}
        onCancel={() => setShowSuggestions(false)}
        footer={null}
        width={600}
      >
        <p>We couldn't find any painters available for your requested time slot, but here are some alternative times that are available:</p>
        
        <List
          itemLayout="horizontal"
          dataSource={suggestions}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button 
                  type="primary" 
                  onClick={() => handleBookSuggestion(item)}
                  loading={loading}
                >
                  Book This Slot
                </Button>
              ]}
            >
              <List.Item.Meta
                title={`${formatDateTime(item.startTime)} - ${formatDateTime(item.endTime)}`}
                description={
                  <>
                    <Text>Painter: {item.painterName}</Text>
                    <br />
                    <Text type="secondary">
                      {item.gapMinutes === 0 
                        ? 'Perfect Match!' 
                        : `${item.gapMinutes} minutes ${item.gapMinutes > 0 ? 'later' : 'earlier'} than requested`}
                    </Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
      </Modal>
      
      <Modal
        title="No Availability"
        open={showNoSlotsMessage}
        onCancel={() => setShowNoSlotsMessage(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setShowNoSlotsMessage(false)}>
            OK
          </Button>
        ]}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <Alert
            message="No Available Slots"
            description={
              <>
                <p>We're sorry, but there are currently no painters available for booking in our system.</p>
                <p>Please try again later or contact our support team for assistance.</p>
              </>
            }
            type="info"
            showIcon
          />
        </div>
      </Modal>

      <Modal
        title="Booking Confirmed!"
        open={showSuccessModal}
        onCancel={() => setShowSuccessModal(false)}
        footer={[
          <Button key="ok" type="primary" onClick={() => setShowSuccessModal(false)}>
            OK
          </Button>
        ]}
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ fontSize: '72px', color: '#52c41a', margin: '20px 0' }}>
            ✓
          </div>
          <Alert
            message="Booking Successfully Created"
            description={
              successBooking && (
                <>
                  <p><strong>Your booking has been confirmed!</strong></p>
                  <p>Booking ID: {successBooking.id}</p>
                  <p>Time: {formatDateTime(successBooking.startTime)} - {formatDateTime(successBooking.endTime)}</p>
                  <p>A painter will be assigned to your booking and will contact you soon.</p>
                </>
              )
            }
            type="success"
            showIcon
          />
        </div>
      </Modal>
    </div>
  );
};

export default BookingRequestForm;
