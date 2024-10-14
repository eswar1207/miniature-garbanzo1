import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { message, Form, Input, Button } from "antd";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    // Remove confirmPassword before sending to server
    const { confirmPassword, ...dataToSend } = values;

    try {
      dispatch({
        type: "SHOW_LOADING",
      });
       await axios.post("/api/users/register", dataToSend);
      dispatch({
        type: "HIDE_LOADING",
      });
      message.success(
        "User registered successfully. Please check your email for verification."
      );
      navigate("/login");
    } catch (error) {
      dispatch({
        type: "HIDE_LOADING",
      });
      message.error("Registration failed. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="container">
      <div className="image-container">
        <img
          src="https://storage.googleapis.com/a1aa/image/xO8HVRf8odwlYKLGRYHqhq2KXAXNbqj1tuH1lgupfrfSrwLnA.jpg"
          alt="A smiling waiter holding a tablet in a busy restaurant"
        />
      </div>
      <div className="form-container">
        <h2>Register</h2>
        <img src="/logo.png" alt="Logo" />
        <Form name="register" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="button"
              style={{
                width: "100%",
                height: "40px",
                backgroundColor: "#ed8936",
                borderColor: "#ed8936",
                fontWeight: "bold",
              }}
            >
              Register
            </Button>
          </Form.Item>
          <Form.Item>
            Already have an account? <Link to="/login">Login</Link>
          </Form.Item>
        </Form>
        <p>
          Note: After registration, please check your email for verification.
        </p>
      </div>
    </div>
  );
};

export default Register;