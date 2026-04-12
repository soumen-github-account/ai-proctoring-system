// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   Legend,
//   ResponsiveContainer
// } from "recharts";

// const COLORS = ["#22c55e", "#facc15", "#ef4444"]; // green, yellow, red

// const RiskOverview = ({ data }) => {
//   return (
//     <div className="bg-white p-5 rounded-xl shadow-md">
//       <h2 className="text-lg font-semibold mb-4">Risk Overview</h2>

//       <div className="w-full h-64">
//         <ResponsiveContainer>
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               outerRadius={90}
//               dataKey="value"
//               label={({ name, value }) => `${name}: ${value}%`}
//             >
//               {data.map((_, index) => (
//                 <Cell key={index} fill={COLORS[index]} />
//               ))}
//             </Pie>

//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>
//     </div>
//   );
// };

// export default RiskOverview;

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#22c55e", "#facc15", "#ef4444"]; // LOW, MEDIUM, HIGH

const RiskOverview = ({ attempts }) => {

  // Convert attempts → chart data
  const getRiskData = () => {
    const counts = {
      LOW: 0,
      MEDIUM: 0,
      HIGH: 0
    };

    attempts.forEach(a => {
      if (counts[a.risk] !== undefined) {
        counts[a.risk]++;
      }
    });

    return [
      { name: "Low", value: counts.LOW },
      { name: "Medium", value: counts.MEDIUM },
      { name: "High", value: counts.HIGH }
    ];
  };
//   const getRiskData = () => {
//   const counts = {
//     LOW: 0,
//     MEDIUM: 0,
//     HIGH: 0
//   };

//   attempts.forEach(a => {
//     const risk = a.risk?.toUpperCase();
//     if (counts[risk] !== undefined) {
//       counts[risk]++;
//     }
//   });

//   return [
//     { name: "Low", value: counts.LOW },
//     { name: "Medium", value: counts.MEDIUM },
//     { name: "High", value: counts.HIGH }
//   ].filter(item => item.value > 0);
// };

  const data = getRiskData();

  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Risk Overview ({attempts.length})</h2>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={90}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              {data.map((entry, index) => (
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