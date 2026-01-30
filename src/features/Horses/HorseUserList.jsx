import { FaVideo, FaUtensils } from "react-icons/fa";
import { useGetHorsesUser } from "./horseHooks";
import Pagination from "../../components/Pagination";
import FeedNowBtn from "./FeedNowBtn";

export default function HorseUserList() {
  const { horses, count, totalPages, isFetching, error } = useGetHorsesUser();

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 font-semibold">
        Error loading horses
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Horses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {horses.map((horse) => (
          <div
            key={horse.id}
            className="group bg-white/70 backdrop-blur-sm rounded-2xl border border-green-100 shadow-lg hover:shadow-xl hover:shadow-green-200 transition-all duration-300 overflow-hidden"
          >
            {/* Horse Image */}
            <div className="h-48 w-full overflow-hidden bg-linear-to-br from-green-50 to-emerald-50">
              <img
                src={horse.image}
                alt={horse.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Horse Info */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {horse.name}
              </h3>

              <div className="space-y-3">
                {/* Last Feed */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Last Feed:</span>
                  <span className="font-medium text-green-700">
                    {horse.lastFeedAt
                      ? new Date(horse.lastFeedAt).toLocaleDateString()
                      : "Never"}
                  </span>
                </div>

                {/* Feeder Type */}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Feeder:</span>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    {horse.feeder?.feederType || "None"}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="px-6 pb-6 pt-0">
              <div className="flex gap-3">
                {/* <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 to-green-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 text-sm">
                  <FaUtensils className="text-sm" />
                  FEED NOW
                </button> */}

                <FeedNowBtn horse={horse} />

                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 text-sm">
                  <FaVideo className="text-sm" />
                  START STREAM
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <Pagination count={count} totalPages={totalPages} />
    </div>
  );
}
