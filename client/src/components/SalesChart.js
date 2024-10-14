import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
} from "recharts";

const SalesChart = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <defs>
          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="_id" 
          label={{ value: 'Date', position: 'insideBottomRight', offset: -10 }}
          tick={{ fontSize: 12, fill: '#666' }}
          stroke="#ccc"
        />
        <YAxis 
          label={{ value: 'Total Sales (₹)', angle: -90, position: 'insideLeft' }}
          tick={{ fontSize: 12, fill: '#666' }}
          stroke="#ccc"
        />
        <Tooltip 
          contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
          formatter={(value) => [`₹${value.toLocaleString()}`, 'Total Sales']}
          labelStyle={{ color: '#333', fontWeight: 'bold' }}
        />
        <Legend wrapperStyle={{ paddingTop: '10px' }} />
        <Area 
          type="monotone" 
          dataKey="totalSales" 
          stroke="#8884d8" 
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorSales)"
        />
        <Line 
          type="monotone" 
          dataKey="totalSales" 
          stroke="#8884d8" 
          strokeWidth={3}
          dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
          activeDot={{ r: 8, strokeWidth: 2, fill: '#8884d8' }}
          name="Total Sales"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesChart;
