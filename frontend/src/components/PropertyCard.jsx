import { Link } from 'react-router-dom';

export default function PropertyCard({ property }) {
  return (
    <Link to={`/properties/${property.id}`} className="card hover:shadow-lg transition-shadow">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img
          src={property.image || '/placeholder-property.jpg'}
          alt={property.title}
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
        <p className="mt-1 text-gray-500">{property.location}</p>
        <div className="mt-2 flex justify-between items-center">
          <p className="text-lg font-bold text-primary-600">
            ${property.pricePerNight} <span className="text-sm font-normal">/ night</span>
          </p>
        </div>
      </div>
    </Link>
  );
}