"use client";

type Props = {
  onToggleSidebar: () => void;
};

export default function AdminHeader({ onToggleSidebar }: Props) {
  return (
    <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between h-16 bg-white border-b border-gray-200 px-4 lg:px-6">
      {/* left: hamburger + brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle sidebar"
          className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
        >
          {/* hamburger SVG */}
          <svg className="w-6 h-6 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-white font-semibold">A</div>
          <span className="text-lg font-semibold text-gray-800">Admin Panel</span>
        </div>
      </div>

      {/* center: search (hidden on very small screens) */}
      <div className="hidden sm:flex items-center bg-gray-50 border border-gray-200 rounded-md px-3 py-2 w-80">
        <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
        </svg>
        <input
          className="ml-2 w-full bg-transparent outline-none text-sm text-gray-700"
          type="text"
          placeholder="Search..."
          aria-label="Search"
        />
      </div>

      {/* right: notifications + profile */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-gray-100" aria-label="Notifications">
          <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0 1 18 14.158V11a6 6 0 1 0-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h11z" />
            <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        </button>

        <div className="relative">
          <button
            aria-haspopup="true"
            aria-expanded="false"
            className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100"
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">AD</div>
            <span className="hidden md:inline text-sm font-medium text-gray-700">Admin</span>
            {/* small chevron */}
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
