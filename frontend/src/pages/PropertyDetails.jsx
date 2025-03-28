import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { propertyService } from "../services/api";
import BookingForm from "../components/BookingForm";
import { MapIcon, UserIcon } from "@heroicons/react/outline";

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await propertyService.getById(id);
        setProperty(response.data);
      } catch (error) {
        console.error("Failed to fetch property:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!property) {
    return <div className="text-center py-8">Property not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Property Details */}
        <div className="md:col-span-2">
          {/* Property Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {property.title}
          </h1>

          {/* Location */}
          <div className="flex items-center text-gray-600 mb-6">
            <MapIcon className="w-5 h-5 mr-2" />
            <span>{property.location}</span>
          </div>

          {/* Property Images */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            {property.images && property.images.length > 0 ? (
              property.images.map((image, index) => (
                <div key={index} className="relative aspect-w-16 aspect-h-9">
                  <img
                    src={image}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
              ))
            ) : (
              <div className="relative aspect-w-16 aspect-h-9">
                <img
                  src="/placeholder-property.jpg"
                  alt="Placeholder"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Property Description */}
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              About this place
            </h2>
            <p className="text-gray-600">{property.description}</p>
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div>
          <div className="sticky top-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              {/* Price */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-2xl font-bold text-gray-900">
                  ${property.pricePerNight}
                </span>
                <span className="text-gray-500">per night</span>
              </div>

              {/* Booking Form */}
              <BookingForm property={property} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}