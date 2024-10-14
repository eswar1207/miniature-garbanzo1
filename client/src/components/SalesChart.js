import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const SalesChart = ({ data }) => {
  return (
    <LineChart width={500} height={300} data={data}>
      <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
      <XAxis dataKey="_id" />
      <YAxis />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <Tooltip />
    </LineChart>
  );
};

export default SalesChart;
