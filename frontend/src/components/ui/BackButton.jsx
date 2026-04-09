import React from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isAdminPath =
    pathname === "/admin" || pathname.startsWith("/admin/");

  if (!isAdminPath) {
    return null;
  }

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate("/admin/dashboard");
    }
  };

  return (
    <div className="fixed left-4 top-4 z-50">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-gray-700 shadow-lg shadow-gray-200 backdrop-blur"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
    </div>
  );
};

export default BackButton;
