import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { propertyService } from "../services/api";
import BookingForm from "../components/BookingForm";
// import { MapPinIcon, UserIcon } from '@heroicons/react/24/outline';
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
    return <div>Loading...</div>;
  }

  if (!property) {
    return <div>Property not found</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
          <div className="flex items-center text-gray-500 mb-4">
            <MapIcon className="w-5 h-5 mr-2" />
            {property.location}
          </div>
          <div className="aspect-w-16 aspect-h-9 mb-6">
            <img
              src={property.image || "/placeholder-property.jpg"}
              alt={property.title}
              className="object-cover rounded-lg"
            />
          </div>
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-2">About this place</h2>
            <p className="text-gray-600">{property.description}</p>
          </div>
        </div>
        <div>
          <div className="sticky top-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-2xl font-bold">
                  ${property.pricePerNight}
                </span>
                <span className="text-gray-500">per night</span>
              </div>
              <BookingForm property={property} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
