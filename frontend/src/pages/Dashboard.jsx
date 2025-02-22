import { useState, useEffect } from "react";
import { bookingService } from "../services/api";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await bookingService.getMyBookings();
        setBookings(response.data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {bookings.map((booking) => (
            <li
              key={booking.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
                {/* Booking Details */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {booking.property.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {format(new Date(booking.checkInDate), "MMM dd, yyyy")} -{" "}
                    {format(new Date(booking.checkOutDate), "MMM dd, yyyy")}
                  </p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
                      ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                </div>

                {/* Total Price */}
                <div className="mt-4 sm:mt-0 sm:text-right">
                  <p className="text-2xl font-bold text-primary-600">
                    ${booking.totalPrice}
                  </p>
                  <p className="text-sm text-gray-500">Total</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Empty State */}
      {bookings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">You have no bookings yet.</p>
          <p className="text-gray-500">
            Start exploring properties and book your next stay!
          </p>
        </div>
      )}
    </div>
  );
}
