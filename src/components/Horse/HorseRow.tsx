import { FaVideo, FaUtensils, FaClock } from "react-icons/fa";
import { Horse } from "@/types";
import StreamBtn from "@/features/Horses/StreamBtn";
import FeederWeight from "@/features/Feeder/FeederWeight";
import FeedNowBtn from "@/features/Feeder/FeedNowBtn";
import FeedingBar from "@/features/Feeder/FeedingBar";

export default function HorseRow({ horse }: { horse: Horse }) {
  const feedsToday = 0;

  const formatLastFeed = (date?: Date | string | null): string => {
    if (!date) return "Never";

    const feedDate = new Date(date);
    const now = new Date();

    const diffMs = now.getTime() - feedDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";

    return feedDate.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200">
      {/* Main Row */}
      <div className="p-4 flex items-center justify-between">
        {/* Left Section: Horse Info */}
        <div className="flex items-center flex-1 min-w-0">
          {/* Horse Image */}
          <div className="shrink-0">
            <img
              className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-100"
              src={horse.image}
              alt={horse.name}
            />
          </div>

          {/* Horse Details */}
          <div className="ml-4 flex-1 min-w-0">
            {/* Name and ID */}
            <div className="flex items-center">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {horse.name}
              </h3>
              <span className="ml-2 text-sm text-gray-400 font-medium">
                #{`HSE-${String(horse.id).slice(-4).toUpperCase()}`}
              </span>
            </div>

            {/* Feeder Info */}
            <p className="text-sm text-gray-600 mt-0.5">
              Feeder:{" "}
              <span className="font-medium text-gray-900">
                {horse.feeder?.feederType || "None"}
              </span>
            </p>

            {/* Stats Row */}
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              {/* Feeds Today Counter */}
              <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                <FaUtensils className="mr-1.5 text-green-600 text-xs" />
                <span className="font-semibold">{feedsToday}</span>
                <span className="ml-1">feeds today</span>
              </div>

              {/* Live Feeder Weight - ADD THIS */}
              <FeederWeight thingName={horse.feeder?.thingName} />

              {/* Last Feed Time */}
              <div className="flex items-center text-sm text-gray-500">
                <FaClock className="mr-1.5 text-gray-400" />
                <span>Last feed: </span>
                <span className="ml-1 font-medium text-gray-700">
                  {formatLastFeed(horse.lastFeedAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Action Buttons */}
        <div className="flex items-center gap-3 ml-6 shrink-0">
          <FeedNowBtn horse={horse} className="min-w-[120px]" />
          <StreamBtn horse={horse} className="min-w-[140px]" />
        </div>
      </div>

      <FeedingBar horseId={horse.id} horseName={horse.name} />
    </div>
  );
}
