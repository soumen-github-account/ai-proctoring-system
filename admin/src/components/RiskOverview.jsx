import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#22c55e", "#facc15", "#ef4444"]; // green, yellow, red

const RiskOverview = ({ data }) => {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Risk Overview</h2>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={90}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}%`}
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RiskOverview;
