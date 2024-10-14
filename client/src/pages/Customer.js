import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import { Table, message } from "antd";
import axios from "axios";
import { ElegantCard, PageTitle } from '../styles/SharedStyles';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/bills/get-bills");
      // Extract unique customers from bills
      const uniqueCustomers = Array.from(
        new Set(
          response.data.data.map((bill) =>
            JSON.stringify({
              name: bill.customerName,
              phone: bill.customerPhoneNumber,
            })
          )
        )
      ).map(JSON.parse);
      setCustomers(uniqueCustomers);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching customers:", error);
      message.error("Failed to fetch customers");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
  ];

  return (
    <DefaultLayout>
      <PageTitle>Customers 👥</PageTitle>
      <ElegantCard>
        <Table
          columns={columns}
          dataSource={customers}
          rowKey={(record) => record.phone}
          loading={loading}
        />
      </ElegantCard>
    </DefaultLayout>
  );
};

export default CustomerPage;
