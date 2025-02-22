import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { bookingService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function BookingForm({ property }) {
  const { user } = useAuth();
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in to book a property");
      return;
    }

    try {
      setLoading(true);
      await bookingService.create({
        propertyId: property.id,
        checkInDate,
        checkOutDate,
      });
      toast.success("Booking request sent successfully!");
      setCheckInDate(null);
      setCheckOutDate(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book Your Stay</h2>
      <div className="space-y-6">
        {/* Check-in Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in Date
          </label>
          <DatePicker
            selected={checkInDate}
            onChange={setCheckInDate}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            minDate={new Date()}
            placeholderText="Select check-in date"
            required
          />
        </div>

        {/* Check-out Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-out Date
          </label>
          <DatePicker
            selected={checkOutDate}
            onChange={setCheckOutDate}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            minDate={checkInDate || new Date()}
            placeholderText="Select check-out date"
            required
          />
        </div>

        {/* Book Now Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold py-3 rounded-lg hover:to-primary-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Booking...
            </div>
          ) : (
            "Book Now"
          )}
        </button>
      </div>
    </form>
  );
}
