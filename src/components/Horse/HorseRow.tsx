import { FaVideo, FaUtensils, FaClock } from "react-icons/fa";
import { Horse } from "@/types";
import StreamBtn from "@/features/Stream/StreamBtn";
import FeederWeight from "@/features/Feeding/FeederWeight";
import FeedNowBtn from "@/features/Feeding/FeedNowBtn";
import FeedingBar from "@/features/Feeding/FeedingBar";
import { useTranslation } from "react-i18next";

export default function HorseRow({ horse }: { horse: Horse }) {
  const { t } = useTranslation();

  const feederTypeKey = horse.feeder?.feederType?.toLowerCase();

  const formatLastFeed = (date?: Date | string | null): string => {
    if (!date) return t("feeding.never", "Never");

    const feedDate = new Date(date);
    const now = new Date();

    const diffMs = now.getTime() - feedDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return t("time.minutesAgo", { count: diffMins });

    if (diffHours < 24) return t("time.hoursAgo", { count: diffHours });

    if (diffDays === 1) return t("time.yesterday");

    return feedDate.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200">
      {/* Main Content */}
      <div className="p-4">
        {/* Mobile Layout: Stack everything (< 768px) */}
        <div className="md:hidden">
          {/* Top Section: Image + Name + Feeder Info */}
          <div className="flex items-start gap-3 mb-3">
            <div className="shrink-0">
              <img
                className="h-12 w-12 rounded-full object-cover ring-2 ring-gray-100"
                src={horse.image}
                alt={horse.name}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {horse.name}
              </h3>
              <p className="text-xs text-gray-600 mt-0.5">
                {t("devices.feeder")}:{" "}
                <span className="font-medium text-gray-900">
                  {feederTypeKey
                    ? t(`feederTypes.${feederTypeKey}`)
                    : t("common.none")}
                </span>
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-col gap-2 mb-3">
            <FeederWeight thingName={horse.feeder?.thingName} />
            <div className="flex items-center text-xs text-gray-500">
              <FaClock className="mr-1.5 text-gray-400 shrink-0" />
              <span className="whitespace-nowrap">
                {t("feeding.lastFeed")}:{" "}
              </span>
              <span className="ml-1 font-medium text-gray-700 truncate">
                {formatLastFeed(horse.lastFeedAt)}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2">
            <FeedNowBtn horse={horse} className="w-full" />
            <StreamBtn horse={horse} className="w-full" />
          </div>
        </div>

        {/* Tablet & Desktop Layout: Horizontal (>= 768px) */}
        <div className="hidden md:flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center flex-1 min-w-0">
            <div className="shrink-0">
              <img
                className="h-14 w-14 rounded-full object-cover ring-2 ring-gray-100"
                src={horse.image}
                alt={horse.name}
              />
            </div>

            <div className="ml-4 flex-1 min-w-0">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {horse.name}
                </h3>
              </div>

              <p className="text-sm text-gray-600 mt-0.5">
                {t("devices.feeder")}:{" "}
                <span className="font-medium text-gray-900">
                  {feederTypeKey
                    ? t(`feederTypes.${feederTypeKey}`)
                    : t("common.none")}
                </span>
              </p>

              <div className="flex items-center gap-4 mt-2">
                <FeederWeight thingName={horse.feeder?.thingName} />

                <div className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-1.5 text-gray-400" />
                  <span>{t("feeding.lastFeed")}: </span>
                  <span className="ml-1 font-medium text-gray-700">
                    {formatLastFeed(horse.lastFeedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3 ml-6 shrink-0">
            <FeedNowBtn horse={horse} />
            <StreamBtn horse={horse} />
          </div>
        </div>
      </div>

      <FeedingBar horseId={horse.id} horseName={horse.name} />
    </div>
  );
}
