import React from "react";

interface LogCardProps {
  title: string;
  date: string;
  description: string;
  hours: number;
  animalName: string;
  authorName: string;
  onEdit?: () => void;
}

const LogCard: React.FC<LogCardProps> = ({
  title,
  date,
  description,
  hours,
  animalName,
  authorName,
  onEdit,
}) => {
  const dateObj = new Date(date);

  const day = dateObj.getUTCDate();
  const month = dateObj.toLocaleString("default", {
    month: "short",
    timeZone: "UTC",
  });
  const year = dateObj.getUTCFullYear();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex hover:shadow-md transition-shadow h-28">
      {/* Date Box */}
      <div className="bg-[#2B2E4A] w-24 flex flex-col items-center justify-center text-white shrink-0 p-2">
        <span className="text-3xl font-bold leading-none">{day}</span>
        <span className="text-xs font-medium uppercase mt-1">
          {month} - {year}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 py-3 flex justify-between items-center relative">
        <div className="flex flex-col justify-center h-full w-full pr-12">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {title}
            </h3>
            <span className="text-xs text-gray-400 font-medium">
              • {hours} hours
            </span>
          </div>

          <p className="text-xs text-gray-500 mb-2 font-medium">
            {authorName} - {animalName}
          </p>

          <p className="text-sm text-gray-600 line-clamp-2 w-full max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        {/* Edit Button */}
        <button
          onClick={onEdit}
          className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors shrink-0 absolute right-4 top-1/2 -translate-y-1/2 shadow-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LogCard;
