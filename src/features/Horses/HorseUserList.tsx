import { useGetHorsesUser } from "./horseHooks";
import Pagination from "../../components/Pagination";
import HorseRow from "../../components/Horse/HorseRow";
import { Horse } from "@/types";
import { HORSE_USER_RES } from "@/constants";
// import FeedNowBtn from "./FeedNowBtn";

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
    <div className="space-y-4">
      {/* <img
        src={`/stream/abc`}
        alt="Live camera feed"
        style={{ width: "100%" }}
      /> */}
      {/* Horses List */}
      <div className="space-y-3">
        {horses.map((horse: Horse) => (
          <HorseRow key={horse.id} horse={horse} />
        ))}
      </div>

      {/* Pagination */}
      <div className="pt-4">
        <Pagination
          label="horses"
          count={count}
          totalPages={totalPages}
          limit={HORSE_USER_RES}
        />
      </div>
    </div>
  );
}
