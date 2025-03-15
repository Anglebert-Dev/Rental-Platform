import { useState, useEffect } from "react";
import { propertyService } from "../services/api";
import PropertyForm from "../components/PropertyForm";
import toast from "react-hot-toast";
import { 
  PlusIcon, 
  PencilAltIcon, 
  TrashIcon 
} from "@heroicons/react/outline";

export default function HostDashboard() {
  const [properties, setProperties] = useState([]);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await propertyService.getMyProperties();
      setProperties(response.data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      toast.error("Failed to fetch properties");
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySubmit = async (propertyData) => {
    try {
      if (selectedProperty) {
        await propertyService.update(selectedProperty.id, propertyData);
        toast.success("Property updated successfully");
      } else {
        await propertyService.create(propertyData);
        toast.success("Property created successfully");
      }
      setShowPropertyForm(false);
      setSelectedProperty(null);
      fetchProperties();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save property");
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      try {
        await propertyService.delete(id);
        toast.success("Property deleted successfully");
        fetchProperties();
      } catch (error) {
        toast.error("Failed to delete property");
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
        <button
          onClick={() => setShowPropertyForm(true)}
          className="btn-primary flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            
            {property.images && property.images.length > 0 && (
              <div className="relative h-48 overflow-hidden">
                <img
                  src={property.images[0]} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {property.title}
              </h3>
              <p className="text-gray-600 mb-4">{property.location}</p>
              <p className="text-lg font-bold text-primary-600">
                ${property.pricePerNight}{" "}
                <span className="text-sm text-gray-500">/ night</span>
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setSelectedProperty(property);
                    setShowPropertyForm(true);
                  }}
                  className="p-2 text-primary-600 hover:text-primary-800 transition-colors"
                  title="Edit Property"
                >
                  <PencilAltIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() => handleDeleteProperty(property.id)}
                  className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  title="Delete Property"
                >
                  <TrashIcon className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showPropertyForm && (
        <PropertyForm
          property={selectedProperty}
          onSubmit={handlePropertySubmit}
          onClose={() => {
            setShowPropertyForm(false);
            setSelectedProperty(null);
          }}
        />
      )}
    </div>
  );
}
