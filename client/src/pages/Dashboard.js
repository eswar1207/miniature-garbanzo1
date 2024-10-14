import React, { useState, useEffect } from "react";
import { Table, Spin, Row, Col, Card } from "antd";
import axios from "axios";
import DefaultLayout from "../components/DefaultLayout";
import SalesChart from "../components/SalesChart";

const Dashboard = () => {
  const [todaySales, setTodaySales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalItemsSold, setTotalItemsSold] = useState(0);
  const [bestSellingItem, setBestSellingItem] = useState({});
  const [recentBills, setRecentBills] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null); // State to manage error

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null); // Reset error state
    try {
      const [
        todaySalesResponse,
        totalRevenueResponse,
        totalItemsSoldResponse,
        bestSellingItemResponse,
        recentBillsResponse,
        salesDataResponse,
      ] = await Promise.all([
        axios.get("/api/bills/get-today-sales"),
        axios.get("/api/bills/get-total-revenue"),
        axios.get("/api/bills/get-total-items-sold"),
        axios.get("/api/bills/get-best-selling-item"),
        axios.get("/api/bills/get-recent-bills"),
        axios.get("/api/bills/get-sales-data"),
      ]);

      console.log("Today Sales Response:", todaySalesResponse.data); // Log for debugging
      console.log("Total Revenue Response:", totalRevenueResponse.data); // Log for debugging

      setTodaySales(Number(todaySalesResponse.data.totalSales) || 0); // Extract totalSales from response
      setTotalRevenue(Number(totalRevenueResponse.data.totalRevenue) || 0); // Extract totalRevenue from response
      setTotalItemsSold(Number(totalItemsSoldResponse.data) || 0); // Ensure it's a number
      setBestSellingItem(bestSellingItemResponse.data);
      setRecentBills(recentBillsResponse.data);
      setSalesData(salesDataResponse.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again later."); // Set error message
    } finally {
      setLoading(false);
    }
  };

  const recentBillsColumns = [
    { title: "Bill ID", dataIndex: "_id", key: "_id" },
    { title: "Customer", dataIndex: "customerName", key: "customerName" },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount" },
    { title: "Date", dataIndex: "createdAt", key: "createdAt" },
  ];

  return (
    <DefaultLayout>
      <Spin spinning={loading}>
        <h1>Dashboard</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
        {/* Display error if it exists */}
        <Row gutter={16}>
          <Col span={8}>
            <Card title="Today's Sales">
              <p>₹{todaySales.toLocaleString()}</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Total Revenue">
              <p>₹{totalRevenue.toLocaleString()}</p>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="Total Items Sold">
              <p>{totalItemsSold.toLocaleString()}</p>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Card title="Best Selling Item">
              <p>{bestSellingItem.itemName}</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="Recent Bills">
              <Table columns={recentBillsColumns} dataSource={recentBills} />
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Card title="Sales Chart">
              <SalesChart data={salesData} />
            </Card>
          </Col>
        </Row>
      </Spin>
    </DefaultLayout>
  );
};

export default Dashboard;
