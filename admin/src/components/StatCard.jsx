
const StatCard = ({ title, value, icon, gradient }) => (
  <div className={`
    rounded-2xl p-5 text-neutral-800
    shadow-md hover:shadow-xl
    transition-all duration-300
    ${gradient}
  `}>
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm opacity-90">{title}</p>
        <p className="text-3xl font-semibold mt-1">{value}</p>
      </div>
      <div className="opacity-90">{icon}</div>
    </div>
  </div>
);


import { Users, ClipboardList, Flag, AlertTriangle } from "lucide-react";

const StateSection = () => {

    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatCard
            title="Total Candidates"
            value="120"
            icon={<Users size={28} className="text-indigo-600" />}
            gradient="bg-gradient-to-r from-blue-300 to-indigo-50"
        />
        <StatCard
            title="Active Exams"
            value="5"
            icon={<ClipboardList size={28} className="text-emerald-600" />}
            gradient="bg-gradient-to-r from-green-300 to-emerald-50"
        />
        <StatCard
            title="Flagged Candidates"
            value="12"
            icon={<Flag size={28} className="text-rose-600" />}
            gradient="bg-gradient-to-r from-red-300 to-rose-50"
        />
        <StatCard
            title="High-Risk Candidates"
            value="7"
            icon={<AlertTriangle size={28} className="text-orange-600" />}
            gradient="bg-gradient-to-r from-orange-300 to-orange-50"
        />
        </div>
    )
}

export default StateSection