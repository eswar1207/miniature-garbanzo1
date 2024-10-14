import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { DatePicker, Select,  Table, message, Row, Col, Space } from "antd";
import axios from "axios";
import moment from "moment";
import styled from 'styled-components';
import { ElegantCard, PageTitle, StyledButton } from '../styles/SharedStyles';

const { RangePicker } = DatePicker;
const { Option } = Select;

const StyledSpace = styled(Space)`
  width: 100%;
  margin-bottom: 24px;
`;

const StyledSelect = styled(Select)`
  min-width: 200px;
`;

const StyledRangePicker = styled(RangePicker)`
  min-width: 300px;
`;

const ReportsPage = () => {
  const [reportType, setReportType] = useState("daily");
  const [dateRange, setDateRange] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get("/api/items/get-item");
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching items:", error);
      message.error("Failed to fetch items");
    }
  };

  const columns = [
    {
      title: "Item Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Quantity Sold",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total Sales",
      dataIndex: "totalSales",
      key: "totalSales",
      render: (value) => `₹${value.toFixed(2)}`,
    },
  ];

  const handleGenerateReport = async () => {
    try {
      setLoading(true);
      let endpoint = "/api/bills/get-bills";
      let params = {};

      if (reportType === "daily") {
        params.startDate = moment().startOf("day").toISOString();
        params.endDate = moment().endOf("day").toISOString();
      } else if (reportType === "custom") {
        if (dateRange.length !== 2) {
          message.error("Please select a date range");
          setLoading(false);
          return;
        }
        params.startDate = dateRange[0].startOf("day").toISOString();
        params.endDate = dateRange[1].endOf("day").toISOString();
      } else if (reportType === "item") {
        if (!selectedItem) {
          message.error("Please select an item");
          setLoading(false);
          return;
        }
      }

      const response = await axios.get(endpoint, { params });
      const bills = response.data.data;

      // Process the bills to generate report data
      const reportData = processReportData(bills);
      setReportData(reportData);
      setLoading(false);
    } catch (error) {
      console.error("Error generating report:", error);
      message.error("Failed to generate report");
      setLoading(false);
    }
  };

  const processReportData = (bills) => {
    const itemSales = {};

    bills.forEach((bill) => {
      const billDate = moment(bill.createdAt);

      // Check if the bill is within the selected date range
      if (reportType === "custom" && dateRange.length === 2) {
        if (
          billDate.isBefore(dateRange[0].startOf("day")) ||
          billDate.isAfter(dateRange[1].endOf("day"))
        ) {
          return;
        }
      }

      bill.cartItems.forEach((item) => {
        if (reportType === "item" && item.name !== selectedItem) {
          return;
        }
        if (!itemSales[item.name]) {
          itemSales[item.name] = { quantity: 0, totalSales: 0 };
        }
        itemSales[item.name].quantity += item.quantity;
        itemSales[item.name].totalSales += item.price * item.quantity;
      });
    });

    const reportData = Object.keys(itemSales).map((itemName) => ({
      name: itemName,
      quantity: itemSales[itemName].quantity,
      totalSales: itemSales[itemName].totalSales,
    }));

    return reportData;
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Sales Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Sales Report</h1>
          <p>Report Type: ${
            reportType === "daily"
              ? "Today's Sales"
              : reportType === "custom"
              ? "Sales between dates"
              : "Sales of a particular item"
          }</p>
          ${
            reportType === "custom"
              ? `<p>Date Range: ${dateRange[0].format(
                  "YYYY-MM-DD"
                )} to ${dateRange[1].format("YYYY-MM-DD")}</p>`
              : ""
          }
          ${
            reportType === "item" ? `<p>Selected Item: ${selectedItem}</p>` : ""
          }
          <table>
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity Sold</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              ${reportData
                .map(
                  (item) => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.totalSales.toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  return (
    <DefaultLayout>
      <PageTitle>Sales Reports 📊</PageTitle>
      <ElegantCard>
        <StyledSpace direction="vertical" size="large">
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} md={8}>
              <StyledSelect
                value={reportType}
                onChange={(value) => setReportType(value)}
                style={{ width: '100%' }}
              >
                <Option value="daily">Today's Sales</Option>
                <Option value="custom">Sales between dates</Option>
                <Option value="item">Sales of a particular item</Option>
              </StyledSelect>
            </Col>
            <Col xs={24} md={8}>
              {reportType === "custom" && (
                <StyledRangePicker
                  value={dateRange}
                  onChange={(dates) => setDateRange(dates)}
                  style={{ width: '100%' }}
                />
              )}
              {reportType === "item" && (
                <StyledSelect
                  value={selectedItem}
                  onChange={(value) => setSelectedItem(value)}
                  style={{ width: '100%' }}
                >
                  {items.map((item) => (
                    <Option key={item._id} value={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </StyledSelect>
              )}
            </Col>
            <Col xs={24} md={8}>
              <Space>
                <StyledButton type="primary" onClick={handleGenerateReport}>
                  Generate Report
                </StyledButton>
                <StyledButton onClick={handlePrint} disabled={reportData.length === 0}>
                  Print Report
                </StyledButton>
              </Space>
            </Col>
          </Row>
          <Table
            columns={columns}
            dataSource={reportData}
            loading={loading}
            rowKey={(record) => record.name}
            pagination={{ pageSize: 10 }}
            scroll={{ x: 'max-content' }}
          />
        </StyledSpace>
      </ElegantCard>
    </DefaultLayout>
  );
};

export default ReportsPage;
