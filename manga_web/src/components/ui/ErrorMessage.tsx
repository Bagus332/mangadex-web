// src/components/ui/ErrorMessage.tsx
"use client";

interface ErrorMessageProps {
  title?: string;
  message: string | null;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ title = "Oops! Terjadi Kesalahan", message, className = "" }) => {
  if (!message) return null;

  return (
    <div className={`bg-red-900 border border-red-700 text-red-100 px-4 sm:px-6 py-3 sm:py-4 rounded-lg relative text-center ${className}`} role="alert">
      <strong className="font-bold text-md sm:text-lg">{title}</strong>
      <span className="block sm:inline mt-1 sm:mt-0 sm:ml-2 text-sm sm:text-base">{message}</span>
    </div>
  );
};

export default ErrorMessage;
