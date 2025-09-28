import React, { useState } from 'react';
import { Form, DatePicker, Button, message } from 'antd';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { availabilityApi } from '../../services/scheduling.api';
import type { CreateAvailabilityDto } from '../../services/scheduling.api';

dayjs.extend(utc);

const { RangePicker } = DatePicker;

const AvailabilityForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { dateRange: [dayjs.Dayjs, dayjs.Dayjs] }) => {
    try {
      setLoading(true);
      
      const availabilityData: CreateAvailabilityDto = {
        startTime: values.dateRange[0].utc().format(),
        endTime: values.dateRange[1].utc().format(),
      };
      
      await availabilityApi.createAvailability(availabilityData);
      message.success('Availability slot added successfully');
      form.resetFields();
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Failed to add availability:', error);
      message.error(error.response?.data?.error || 'Failed to add availability slot');
    } finally {
      setLoading(false);
    }
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current < dayjs().startOf('day');
  };

  return (
    <div className="availability-form-container">
      <h2>Add New Availability</h2>
      <Form 
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        <Form.Item
          name="dateRange"
          label="Available Time Slot"
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
                  return Promise.reject('Time slot must be at least 15 minutes long');
                }
                
                if (duration > maxDuration) {
                  return Promise.reject('Time slot cannot be longer than 8 hours');
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
            Add Availability
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AvailabilityForm;
