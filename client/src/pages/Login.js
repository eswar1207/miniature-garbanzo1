import React,{useEffect} from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      console.log("Attempting login with:", values);
      dispatch({
        type: "SHOW_LOADING",
      });
      const res = await axios.post("/api/users/login", values);
      dispatch({
        type: "HIDE_LOADING",
      });
      message.success("User logged in successfully");
      localStorage.setItem("auth", JSON.stringify(res.data));
      navigate("/");
    } catch (error) {
      dispatch({
        type: "HIDE_LOADING",
      });
      console.error("Login error:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status :", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      message.error("Login failed");
    }
  };
  useEffect(() => {
    if (localStorage.getItem("auth")) {
      navigate("/");
    }
  })

  return (
    <div className="container">
      <div className="image-container">
        <img
          src="https://storage.googleapis.com/a1aa/image/xO8HVRf8odwlYKLGRYHqhq2KXAXNbqj1tuH1lgupfrfSrwLnA.jpg"
          alt="A smiling waiter holding a tablet in a busy restaurant"
        />
      </div>
      <div className="form-container">
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
            <Link to="/register">Don't have an account? Register now!</Link>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
