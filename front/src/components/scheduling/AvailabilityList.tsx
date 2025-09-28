import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Tag, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { availabilityApi } from '../../services/scheduling.api';
import type { Availability } from '../../services/scheduling.api';

// Enable UTC plugin
dayjs.extend(utc);

const AvailabilityList: React.FC = () => {
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAvailabilities = async () => {
    try {
      setLoading(true);
      const data = await availabilityApi.getPainterAvailabilities();
      setAvailabilities(data);
    } catch (error) {
      console.error('Failed to fetch availabilities:', error);
      message.error('Failed to load availability slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await availabilityApi.deleteAvailability(id);
      message.success('Availability slot deleted successfully');
      fetchAvailabilities();
    } catch (error) {
      console.error('Failed to delete availability:', error);
      message.error('Failed to delete availability slot');
    }
  };

  const formatDateTime = (isoString: string) => {
    return dayjs(isoString).format('MMM DD, YYYY HH:mm');
  };

  const columns: ColumnsType<Availability> = [
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
      key: 'status',
      render: (_, record) => {
        const now = dayjs();
        const start = dayjs(record.startTime);
        const end = dayjs(record.endTime);
        
        if (now.isAfter(end)) {
          return <Tag color="default">Passed</Tag>;
        }
        if (now.isAfter(start) && now.isBefore(end)) {
          return <Tag color="processing">Current</Tag>;
        }
        return <Tag color="success">Upcoming</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Delete this availability slot?"
          description="Are you sure you want to delete this availability slot?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="link" danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="availability-list-container">
      <h2>My Availability Slots</h2>
      {availabilities.length === 0 && !loading ? (
        <Empty 
          description="No availability slots found" 
          image={Empty.PRESENTED_IMAGE_SIMPLE} 
        />
      ) : (
        <Table 
          columns={columns} 
          dataSource={availabilities.map(item => ({ ...item, key: item.id }))} 
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default AvailabilityList;
