export default function LogoMark() {
  return (
    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-theme bg-slate-50 shadow-sm dark:bg-slate-900">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 via-emerald-500 to-cyan-500 shadow-sm">
        <svg
          viewBox="0 0 36 36"
          className="h-6 w-6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M10 7.75H20.1L26 13.65V26C26 27.1 25.1 28 24 28H10C8.9 28 8 27.1 8 26V9.75C8 8.65 8.9 7.75 10 7.75Z"
            fill="white"
            fillOpacity="0.96"
          />
          <path d="M20 7.75V13.25H25.5" fill="#CCFBF1" />
          <path
            d="M12.5 17H21.5"
            stroke="#0F766E"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M12.5 20.5H21.5"
            stroke="#0F766E"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M12.5 24H18.5"
            stroke="#0F766E"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="24.5" cy="24.5" r="4.25" fill="#0F766E" />
          <path
            d="M22.75 24.55L24 25.8L26.35 23.35"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
