import { Search, Filter, Download } from "lucide-react";

const Toolbar = () => (
  <div className="
    bg-white rounded-xl p-4 mb-4
    flex flex-col md:flex-row
    md:items-center md:justify-between
    gap-4 shadow-sm border-1 border-gray-300
  ">
    <div className="flex gap-3 w-full md:w-auto">
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        <input
          placeholder="Search candidates..."
          className="pl-10 pr-4 py-2 w-full rounded-lg border-1 border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none"
        />
      </div>

      <select className="px-4 py-2 rounded-lg border-1 border-gray-300 bg-white">
        <option>Search by Name</option>
        <option>Search by Risk level</option>
      </select>
    </div>

    <div className="flex gap-3">
      <button className="px-4 py-2 rounded-lg border-1 border-gray-300 flex items-center gap-2">
        <Filter size={16} /> Filter
      </button>
      <button className="px-4 py-2 rounded-lg bg-gray-100">
        Terminate Selected
      </button>
      <button className="px-4 py-2 rounded-lg bg-blue-500 text-white flex items-center gap-2">
        <Download size={16} /> Export
      </button>
    </div>
  </div>
);

export default Toolbar