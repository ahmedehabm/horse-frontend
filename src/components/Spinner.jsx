function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-50">
      <div className="text-center p-8">
        {/* Main Spinner */}
        <div className="relative mx-auto mb-6">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-green-100 border-t-green-600 mx-auto"></div>
          {/* Inner Spinner */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping rounded-full h-16 w-16 bg-linear-to-r from-green-400 to-emerald-400 opacity-75"></div>
        </div>

        {/* Ostler Logo Spinner */}
        <div className="animate-pulse mb-4">
          <div className="flex items-center justify-center mx-auto w-24 h-12 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-green-100 px-4 py-2">
            <svg
              className="h-8 w-8 text-green-600 mr-2 animate-bounce"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 5V19H5V5H19Z" />
              <path d="M5 12H19" />
              <path d="M12 5V19" />
              <circle cx="17" cy="7" r="1" fill="currentColor" />
              <circle cx="7" cy="17" r="1" fill="currentColor" />
            </svg>
            <span className="font-bold text-xl bg-linear-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent">
              Ostler
            </span>
          </div>
        </div>

        {/* Loading Text */}
        <div className="bg-white/70 backdrop-blur-sm px-8 py-4 rounded-2xl shadow-xl border border-green-100">
          <p className="text-lg font-semibold text-green-800 tracking-wide">
            Loading ...
          </p>
          <p className="text-sm text-green-600 mt-1">
            Please wait while we prepare everything
          </p>
        </div>
      </div>
    </div>
  );
}

export default Spinner;
