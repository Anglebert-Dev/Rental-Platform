import { useState, useEffect } from 'react';
import { propertyService, bookingService } from '../services/api';
// import { PlusIcon } from '@heroicons/react/24/outline';
import { PlusIcon } from "@heroicons/react/outline"; // ✅ Correct for Heroicons v1

import PropertyForm from '../components/PropertyForm';
import toast from 'react-hot-toast';

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
      const response = await propertyService.getAll();
      setProperties(response.data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePropertySubmit = async (propertyData) => {
    try {
      if (selectedProperty) {
        await propertyService.update(selectedProperty.id, propertyData);
        toast.success('Property updated successfully');
      } else {
        await propertyService.create(propertyData);
        toast.success('Property created successfully');
      }
      setShowPropertyForm(false);
      setSelectedProperty(null);
      fetchProperties();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save property');
    }
  };

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await propertyService.delete(id);
        toast.success('Property deleted successfully');
        fetchProperties();
      } catch (error) {
        toast.error('Failed to delete property');
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <button
          onClick={() => setShowPropertyForm(true)}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="w-5 h-5 mr-2" />
          Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4">
              <h3 className="text-lg font-medium">{property.title}</h3>
              <p className="text-gray-500">{property.location}</p>
              <p className="mt-2 text-lg font-bold">${property.pricePerNight} / night</p>
              <div className="mt-4 flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setSelectedProperty(property);
                    setShowPropertyForm(true);
                  }}
                  className="px-3 py-1 text-sm text-primary-600 hover:bg-primary-50 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProperty(property.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                >
                  Delete
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