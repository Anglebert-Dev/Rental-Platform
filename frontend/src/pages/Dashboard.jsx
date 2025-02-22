import { useState, useEffect } from "react";
import { bookingService } from "../services/api";
import dayjs from "dayjs";
import { useAuth } from "../context/AuthContext";
import {
  LocationMarkerIcon,
  UserIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CalendarIcon,
} from "@heroicons/react/outline";
import toast from "react-hot-toast";

export default function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await bookingService.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await bookingService.updateStatus(bookingId, newStatus);
      fetchBookings();
      toast.success(`Booking ${newStatus} successfully`);
    } catch (error) {
      console.error("Failed to update status:", error);
      toast.error("Failed to update booking status");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {user?.role === "host" ? "Property Bookings" : "My Bookings"}
      </h1>

      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200"
          >
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Property Info */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">
                    {booking.property.title}
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <LocationMarkerIcon className="w-4 h-4" />
                      <span>{booking.property.location}</span>
                    </div>

                    {/* Show guest info only to hosts */}
                    {user?.role === "host" && (
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        <span>{booking.renter.name}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <CurrencyDollarIcon className="w-4 h-4" />
                      <span>${booking.totalPrice} total</span>
                    </div>
                  </div>
                </div>

                {/* Dates and Status */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    <div>
                      <p>
                        Check-in:{" "}
                        {dayjs(booking.checkInDate).format("MMM DD, YYYY")}
                      </p>
                      <p>
                        Check-out:{" "}
                        {dayjs(booking.checkOutDate).format("MMM DD, YYYY")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>
                      Booked on{" "}
                      {dayjs(booking.createdAt).format("MMM DD, YYYY")}
                    </span>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      booking.status
                    )}`}
                  >
                    {booking.status.charAt(0).toUpperCase() +
                      booking.status.slice(1)}
                  </span>
                </div>

                {/* Actions - Only show for hosts */}
                <div className="flex flex-col gap-3 justify-center lg:items-end">
                  {user?.role === "host" && booking.status === "pending" && (
                    <>
                      <button
                        className="w-full lg:w-auto px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        onClick={() =>
                          handleStatusUpdate(booking.id, "confirmed")
                        }
                      >
                        Confirm Booking
                      </button>
                      <button
                        className="w-full lg:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                        onClick={() =>
                          handleStatusUpdate(booking.id, "canceled")
                        }
                      >
                        Cancel Booking
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">No bookings found</p>
            <p className="text-gray-500">
              {user?.role === "host"
                ? "When guests book your property, their reservations will appear here."
                : "Start exploring properties and book your next stay!"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
