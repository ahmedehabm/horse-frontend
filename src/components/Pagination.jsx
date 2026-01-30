// src/ui/GreenishPagination.jsx
import { useTransition } from "react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import { useSearchParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { LIMIT_RES } from "../../constants";

function Pagination({ count, totalPages }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentPage = searchParams.get("page") ? +searchParams.get("page") : 1;
  const pageCount = totalPages || Math.ceil(count / LIMIT_RES);

  function nextPage() {
    startTransition(() => {
      const next = currentPage + 1;
      searchParams.set("page", next);
      setSearchParams(searchParams);
    });
  }

  function prevPage() {
    startTransition(() => {
      const prev = currentPage - 1;
      searchParams.set("page", prev);
      setSearchParams(searchParams);
    });
  }

  if (pageCount <= 1) return null;

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between py-8 gap-6 bg-linear-to-r from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl border border-green-100 px-6 shadow-lg">
      {/* Results Info */}
      <p className="text-sm text-green-800 font-medium">
        Showing{" "}
        <span className="font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
          {(currentPage - 1) * LIMIT_RES + 1}
        </span>{" "}
        to{" "}
        <span className="font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
          {Math.min(currentPage * LIMIT_RES, count)}
        </span>{" "}
        of{" "}
        <span className="font-bold text-green-700">
          {count.toLocaleString()}
        </span>{" "}
        horses
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2 relative">
        {isPending && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/90 px-3 py-2 rounded-xl shadow-lg border border-green-200">
            <Loader2 className="w-5 h-5 animate-spin text-green-600 mx-auto" />
          </div>
        )}

        {currentPage !== 1 && (
          <button
            onClick={prevPage}
            disabled={isPending}
            className="group flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl text-green-700 font-semibold text-sm hover:bg-linear-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white hover:border-green-400 hover:shadow-xl hover:shadow-green-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <HiChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Previous</span>
          </button>
        )}

        <div className="hidden sm:flex items-center gap-1 text-sm font-semibold text-green-700 bg-green-100/60 px-4 py-2 rounded-full border border-green-200">
          Page {currentPage} of {pageCount}
        </div>

        {currentPage !== pageCount && (
          <button
            onClick={nextPage}
            disabled={isPending}
            className="group flex items-center gap-2 px-5 py-3 bg-white/80 backdrop-blur-sm border border-green-200 rounded-xl text-green-700 font-semibold text-sm hover:bg-linear-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white hover:border-green-400 hover:shadow-xl hover:shadow-green-200 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <span>Next</span>
            <HiChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Pagination;
