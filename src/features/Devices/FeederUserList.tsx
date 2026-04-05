import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings } from "lucide-react";
import Pagination from "@/components/Pagination";
import { useGetMyFeeders } from "./deviceHooks";
import EditFeederDialog from "./EditMyFeederForm";
import { useTranslation } from "react-i18next";

interface Feeder {
  id: string;
  thingLabel: string;
  feederType: "MANUAL" | "SCHEDULED";
  horsesAsFeeder: Array<{ id: string; name: string }>;
}

export default function MyFeeders() {
  const { t } = useTranslation();
  const { feeders, count, totalPages, isFetching, error } = useGetMyFeeders();
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">{(error as Error).message}</p>
      </div>
    );
  }

  const isInitialLoading = isFetching && feeders.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">
          {t("devices.myFeeders", "My Feeders")}
        </h2>
        <p className="text-sm text-muted-foreground">
          {count}{" "}
          {count === 1
            ? t("devices.feeder", "feeder")
            : t("devices.feeders", "feeders")}{" "}
          {t("devices.total", "total")}
        </p>
      </div>

      {isInitialLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border bg-white p-4"
            >
              <div className="space-y-2">
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <Skeleton className="h-9 w-[140px]" />
            </div>
          ))}
        </div>
      ) : feeders.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-gray-50 p-8 text-center">
          <p className="text-muted-foreground">
            {t("devices.noFeedersFound", "No feeders found.")}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {feeders.map((feeder: Feeder) => (
            <div
              key={feeder.id}
              className="flex items-center justify-between rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="space-y-1">
                <h3 className="font-semibold text-gray-900">
                  {feeder.thingLabel}
                </h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  {/* Feeder Type Badge */}
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                    {t(`feederTypes.${feeder.feederType}`, feeder.feederType)}
                  </span>

                  {/* Horse Name */}
                  <span>
                    {t("common.horse", "Horse")}:{" "}
                    {feeder.horsesAsFeeder[0]?.name ||
                      t("devices.unassigned", "Unassigned")}
                  </span>
                </div>
              </div>

              {/* Edit Feeder */}
              <EditFeederDialog
                key={feeder.id}
                feederId={feeder.id}
                trigger={
                  <Button variant="outline" size="sm">
                    <Settings className="mr-2 h-4 w-4" />
                    {t("devices.updateFeeder", "Update Feeder")}
                  </Button>
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {feeders.length > 0 && (
        <Pagination
          label="feeders"
          count={count}
          totalPages={totalPages}
          limit={10}
        />
      )}
    </div>
  );
}
