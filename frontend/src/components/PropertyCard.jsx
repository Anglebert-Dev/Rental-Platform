import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  return (
    <Link
      to={`/properties/${property.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg"
    >
      {/* Property Image */}
      <div className="relative h-48 bg-gray-200 overflow-hidden">
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]} // Display the first image as the featured image
            alt={property.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src="/placeholder-property.jpg"
            alt="Placeholder"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Property Details */}
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {property.title}
        </h3>
        <p className="text-gray-600 mb-4">{property.location}</p>
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold text-primary-600">
            ${property.pricePerNight}{" "}
            <span className="text-sm font-normal text-gray-500">/ night</span>
          </p>
        </div>
      </div>
    </Link>
  );
}