// src/components/DeviceFilter.tsx
import { useSearchParams } from "react-router-dom";

interface FilterOption {
  value: string;
  label: string;
}

interface DeviceFilterProps {
  fieldValue: string;
  options: FilterOption[];
}

export default function DeviceFilter({
  fieldValue,
  options,
}: DeviceFilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentValue = searchParams.get(fieldValue) || options[0]!.value;

  function handleClick(value: string) {
    searchParams.set(fieldValue, value);
    if (searchParams.get("page")) searchParams.set("page", "1");
    setSearchParams(searchParams);
  }

  return (
    <div className="flex gap-1 rounded-md border border-gray-200 bg-white p-1 shadow-sm">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleClick(option.value)}
          className={`
            rounded-md px-3 py-1.5 text-sm font-medium transition-all
            ${
              option.value === currentValue
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-green-600 hover:text-white"
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
