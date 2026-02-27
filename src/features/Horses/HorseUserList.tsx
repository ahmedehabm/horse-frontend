import { useTranslation } from "react-i18next";
import { useGetHorsesUser } from "./horseHooks";
import Pagination from "../../components/Pagination";
import HorseRow from "../../components/Horse/HorseRow";
import { Horse } from "@/types";
import { HORSE_USER_RES } from "@/constants";

export default function HorseUserList() {
  const { t } = useTranslation();
  const { horses, count, totalPages, isFetching, error } = useGetHorsesUser();

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("horses.loading", "Loading horses...")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 font-semibold">
        {t("horses.errorLoading", "Error loading horses")}
      </div>
    );
  }

  if (horses.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        {t("horses.noHorses", "No horses found.")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* <img
        src={"/stream/abc"}
        className="w-full h-full object-contain"
        onError={() => {
          console.error("Stream error for:");
        }}
        onLoad={() => {
          console.log("Stream loaded:");
        }}
      /> */}
      {/* Horses List */}
      <div className="space-y-3">
        {horses.map((horse: Horse) => (
          <HorseRow key={horse.id} horse={horse} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pt-4">
          <Pagination
            label={t("horses.title", "Horses")}
            count={count}
            totalPages={totalPages}
            limit={HORSE_USER_RES}
          />
        </div>
      )}
    </div>
  );
}
