import { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { bookingService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function BookingForm({ property }) {
  const { user } = useAuth();
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to book a property');
      return;
    }

    try {
      setLoading(true);
      await bookingService.create({
        propertyId: property.id,
        checkInDate,
        checkOutDate
      });
      toast.success('Booking request sent successfully!');
      setCheckInDate(null);
      setCheckOutDate(null);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
          <DatePicker
            selected={checkInDate}
            onChange={setCheckInDate}
            className="input-field"
            minDate={new Date()}
            placeholderText="Select check-in date"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
          <DatePicker
            selected={checkOutDate}
            onChange={setCheckOutDate}
            className="input-field"
            minDate={checkInDate || new Date()}
            placeholderText="Select check-out date"
            required
          />
        </div>
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </div>
    </form>
  );
}