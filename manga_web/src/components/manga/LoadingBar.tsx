const LoadingBar = () => (
  <div className="w-full max-w-2xl mx-auto mt-8">
    <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
      <div className="bg-sky-400 h-3 animate-loading-bar rounded-full" style={{ width: "40%" }} />
    </div>
    <p className="text-center text-gray-300 mt-2">Memuat manga...</p>
    <style jsx>{`
      @keyframes loading-bar {
        0% { width: 0%; }
        50% { width: 80%; }
        100% { width: 40%; }
      }
      .animate-loading-bar {
        animation: loading-bar 1.2s infinite ease-in-out;
      }
    `}</style>
  </div>
);

export default LoadingBar;
