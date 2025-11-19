import React from "react";

interface AnimalCardProps {
  name: string;
  breed: string;
  hoursTrained: number;
  imageUrl?: string;
  ownerName: string;
}

const AnimalCard: React.FC<AnimalCardProps> = ({
  name,
  breed,
  hoursTrained,
  imageUrl,
  ownerName,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Image Area */}
      <div className="h-48 bg-gray-200 relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          // Placeholder if no image
          <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
            No Image
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 flex items-start gap-3">
        {/* Red Initial Icon */}
        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1">
          {name.charAt(0).toUpperCase()}
        </div>

        <div>
          <h3 className="text-base font-bold text-gray-900">
            {name} - {breed}
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {ownerName} <span className="mx-1">•</span> Trained: {hoursTrained}{" "}
            hours
          </p>
        </div>
      </div>
    </div>
  );
};

export default AnimalCard;
