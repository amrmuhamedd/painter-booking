import React, { useEffect, useState } from 'react';
import { Table, Tag, Empty, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { bookingApi, BookingStatus } from '../../services/scheduling.api';
import type { Booking } from '../../services/scheduling.api';

dayjs.extend(utc);

const PainterBookingList: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingApi.getPainterBookings();
      setBookings(data);
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      message.error('Failed to load booking information');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const formatDateTime = (isoString: string) => {
    return dayjs(isoString).format('MMM DD, YYYY HH:mm');
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.CONFIRMED:
        return 'green';
      case BookingStatus.REQUESTED:
        return 'blue';
      case BookingStatus.CANCELLED:
        return 'red';
      default:
        return 'default';
    }
  };

  const columns: ColumnsType<Booking> = [
    {
      title: 'Customer',
      key: 'customerName',
      render: (_, record) => 'Customer ID: ' + record.customerId,
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text) => formatDateTime(text),
      sorter: (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
      defaultSortOrder: 'ascend',
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (text) => formatDateTime(text),
    },
    {
      title: 'Duration',
      key: 'duration',
      render: (_, record) => {
        const start = dayjs(record.startTime);
        const end = dayjs(record.endTime);
        const durationHours = end.diff(start, 'hour', true).toFixed(1);
        return `${durationHours} hours`;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: BookingStatus) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Booked On',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text) => formatDateTime(text),
    },
  ];

  return (
    <div className="painter-booking-list">
      {bookings.length === 0 && !loading ? (
        <Empty 
          description="No bookings found" 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      ) : (
        <Table 
          columns={columns} 
          dataSource={bookings.map(item => ({ ...item, key: item.id }))} 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default PainterBookingList;
