import React, { useState, useEffect } from "react";
import { Row, Col, Statistic, Spin, message, Table } from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import axios from "axios";
import DefaultLayout from "../components/DefaultLayout";
import SalesChart from "../components/SalesChart";
import { ElegantCard, PageTitle } from '../styles/SharedStyles';

const Dashboard = () => {
  const [todaySales, setTodaySales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalItemsSold, setTotalItemsSold] = useState(0);
  const [bestSellingItems, setBestSellingItems] = useState([]);
  const [recentBills, setRecentBills] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salesPrediction, setSalesPrediction] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [
        todaySalesResponse,
        totalRevenueResponse,
        totalItemsSoldResponse,
        bestSellingItemsResponse,
        recentBillsResponse,
        salesDataResponse,
        salesPredictionResponse,
      ] = await Promise.all([
        axios.get("/api/bills/get-today-sales"),
        axios.get("/api/bills/get-total-revenue"),
        axios.get("/api/bills/get-total-items-sold"),
        axios.get("/api/bills/get-best-selling-items"),
        axios.get("/api/bills/get-recent-bills"),
        axios.get("/api/bills/get-sales-data"),
        axios.get("/api/ai/sales-prediction"),
      ]);

      setTodaySales(Number(todaySalesResponse.data.totalSales) || 0);
      setTotalRevenue(Number(totalRevenueResponse.data.totalRevenue) || 0);
      setTotalItemsSold(Number(totalItemsSoldResponse.data.totalItemsSold) || 0);
      setBestSellingItems(bestSellingItemsResponse.data || []);
      setRecentBills(recentBillsResponse.data || []);
      setSalesData(salesDataResponse.data || []);
      setSalesPrediction(salesPredictionResponse.data || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setError("Failed to load dashboard data. Please try again later.");
      message.error("Failed to load dashboard data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const recentBillsColumns = [
    { title: "Bill ID", dataIndex: "_id", key: "_id" },
    { title: "Customer", dataIndex: "customerName", key: "customerName" },
    { title: "Total Amount", dataIndex: "totalAmount", key: "totalAmount", render: (value) => `₹${value.toLocaleString()}` },
    { title: "Date", dataIndex: "createdAt", key: "createdAt", render: (date) => new Date(date).toLocaleDateString() },
  ];

  if (loading) {
    return (
      <DefaultLayout>
        <Spin size="large" />
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <p>{error}</p>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <PageTitle>Dashboard</PageTitle>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <ElegantCard>
            <Statistic
              title="Today's Sales"
              value={todaySales}
              prefix="₹"
              valueStyle={{ color: "#3f8600" }}
              suffix={<ArrowUpOutlined />}
            />
          </ElegantCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <ElegantCard>
            <Statistic
              title="Total Revenue"
              value={totalRevenue}
              prefix="₹"
              valueStyle={{ color: "#cf1322" }}
              suffix={<ArrowDownOutlined />}
            />
          </ElegantCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <ElegantCard>
            <Statistic
              title="Total Items Sold"
              value={totalItemsSold}
              valueStyle={{ color: "#1890ff" }}
            />
          </ElegantCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <ElegantCard title="Best Selling Items">
            {bestSellingItems.length > 0 ? (
              <ul>
                {bestSellingItems.slice(0, 3).map((item, index) => (
                  <li key={index}>{item.name} - {item.quantity} sold</li>
                ))}
              </ul>
            ) : (
              <p>No data available</p>
            )}
          </ElegantCard>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col xs={24} lg={12}>
          <ElegantCard title="Sales Chart">
            <SalesChart data={salesData} />
          </ElegantCard>
        </Col>
        <Col xs={24} lg={12}>
          <ElegantCard title="Recent Bills">
            <Table columns={recentBillsColumns} dataSource={recentBills} pagination={false} />
          </ElegantCard>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col xs={24}>
          <ElegantCard title="Sales Prediction (Next 7 Days)">
            <Table
              dataSource={salesPrediction}
              columns={[
                { title: "Date", dataIndex: "date", key: "date" },
                { title: "Predicted Sales", dataIndex: "prediction", key: "prediction", render: (value) => `₹${value.toLocaleString()}` },
              ]}
              pagination={false}
            />
          </ElegantCard>
        </Col>
      </Row>
    </DefaultLayout>
  );
};

export default Dashboard;
