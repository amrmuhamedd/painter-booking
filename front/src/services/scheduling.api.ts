import api from './api';

// Types for availability
export interface Availability {
  id: string;
  painterId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAvailabilityDto {
  startTime: string;
  endTime: string;
}

// Types for bookings
export const BookingStatus = {
  REQUESTED: 'requested',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const;

export type BookingStatus = typeof BookingStatus[keyof typeof BookingStatus];

export interface Booking {
  id: string;
  painterId: string;
  customerId: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  painter?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    rating?: number;
  };
}

export interface CreateBookingDto {
  startTime: string;
  endTime: string;
  clientRequestId?: string;
}

export interface BookingSuggestion {
  painterId: string;
  painterName: string;
  startTime: string;
  endTime: string;
  gapMinutes: number;
}

export const availabilityApi = {
  createAvailability: async (data: CreateAvailabilityDto): Promise<Availability> => {
    const response = await api.post<Availability>('/availability', data);
    return response.data;
  },

  getPainterAvailabilities: async (): Promise<Availability[]> => {
    const response = await api.get<Availability[]>('/availability/me');
    return response.data;
  },

  getAllAvailabilities: async (
    startDate?: string,
    endDate?: string,
    painterId?: string
  ): Promise<Availability[]> => {
    const params = { startDate, endDate, painterId };
    const response = await api.get<Availability[]>('/availability', { params });
    return response.data;
  },

  deleteAvailability: async (id: string): Promise<void> => {
    await api.delete(`/availability/${id}`);
  },
};

export const bookingApi = {
  createBooking: async (data: CreateBookingDto): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings/request', data);
    return response.data;
  },
  
  createAuthenticatedBooking: async (data: CreateBookingDto): Promise<Booking> => {
    const response = await api.post<Booking>('/bookings/request/authenticated', data);
    return response.data;
  },
  
  getCustomerBookings: async (): Promise<Booking[]> => {
    try {
      console.log('API: Calling GET /bookings/me');
      const response = await api.get<Booking[]>('/bookings/me');
      console.log('API: Received response from /bookings/me:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error in getCustomerBookings:', error.message);
      console.error('API: Error details:', { 
        status: error.response?.status, 
        data: error.response?.data,
        headers: error.response?.headers
      });
      throw error; 
    }
  },

  getPainterBookings: async (): Promise<Booking[]> => {
    try {
      console.log('API: Calling GET /bookings/painter');
      const response = await api.get<Booking[]>('/bookings/painter');
      console.log('API: Received response from /bookings/painter:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error in getPainterBookings:', error.message);
      console.error('API: Error details:', { 
        status: error.response?.status, 
        data: error.response?.data 
      });
      throw error; 
    }
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const response = await api.get<Booking>(`/bookings/${id}`);
    return response.data;
  },

  cancelBooking: async (id: string): Promise<Booking> => {
    const response = await api.delete<Booking>(`/bookings/${id}/cancel`);
    return response.data;
  },
};
