import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex w-fit items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 transition-all text-white/70 hover:text-white mb-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m15 18-6-6 6-6"/>
      </svg>
      Back
    </button>
  );
}
