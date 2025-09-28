import React, { useEffect, useState } from 'react';
import { Table, Tag, Button, Popconfirm, Empty, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { bookingApi, BookingStatus } from '../../services/scheduling.api';
import type { Booking } from '../../services/scheduling.api';

dayjs.extend(utc);

const CustomerBookingList: React.FC<{ refreshTrigger?: number }> = ({ refreshTrigger = 0 }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log('Fetching customer bookings...');
      const data = await bookingApi.getCustomerBookings();
      console.log('Bookings received:', data);
      setBookings(data || []);
    } catch (error: any) {
      console.error('Failed to fetch bookings:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to load your bookings';
      console.error('Error details:', { 
        status: error.response?.status,
        data: error.response?.data,
        message: errorMsg
      });
      message.error(`Failed to load bookings: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [refreshTrigger]);

  const handleCancelBooking = async (id: string) => {
    try {
      await bookingApi.cancelBooking(id);
      message.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      message.error('Failed to cancel booking');
    }
  };

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

  const isUpcoming = (booking: Booking) => {
    return dayjs(booking.startTime).isAfter(dayjs()) && 
           booking.status !== BookingStatus.CANCELLED;
  };

  const columns: ColumnsType<Booking> = [
    {
      title: 'Painter',
      key: 'painter',
      render: (_, record) => record.painter?.name || 'Unassigned',
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
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        isUpcoming(record) ? (
          <Popconfirm
            title="Cancel this booking?"
            description="Are you sure you want to cancel this booking?"
            onConfirm={() => handleCancelBooking(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>Cancel</Button>
          </Popconfirm>
        ) : null
      ),
    },
  ];

  return (
    <div className="customer-booking-list">
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

export default CustomerBookingList;
