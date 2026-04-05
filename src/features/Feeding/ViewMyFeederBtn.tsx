// src/components/Feeding/ViewFeederBtn.tsx

import { Settings } from "lucide-react";
import { Horse } from "@/types";
import { useTranslation } from "react-i18next";
import EditFeederDialog from "../Devices/EditMyFeederForm";

interface ViewFeederBtnProps {
  horse: Horse;
  className?: string;
}

export default function ViewFeederBtn({
  horse,
  className = "",
}: ViewFeederBtnProps) {
  const { t } = useTranslation();

  const isDisabled = !horse.feeder;

  const getButtonStyles = () => {
    if (!horse.feeder) {
      return "bg-gray-300 text-gray-500 cursor-not-allowed";
    }
    return "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl";
  };

  const trigger = (
    <button
      disabled={isDisabled}
      className={`whitespace-nowrap flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold rounded-xl shadow-lg transition-all duration-200 text-sm ${getButtonStyles()} ${className}`}
      title={
        !horse.feeder
          ? t("feeder.noFeeder", "No feeder assigned")
          : t("devices.viewFeeder", "View feeder details")
      }
    >
      <Settings size={16} strokeWidth={3} />

      <span>{t("devices.viewFeeder", "VIEW FEEDER")}</span>
    </button>
  );

  if (!horse.feeder) {
    return trigger;
  }

  return <EditFeederDialog feederId={horse.feeder.id} trigger={trigger} />;
}
