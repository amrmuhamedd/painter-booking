import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification } from "antd";
import { Typography } from "antd";

import { loginUser } from "../../store/auth/authSlice";
import type { AppDispatch } from "../../store/store";

import {
  AuthFormContainer,
  AuthWrapper,
  BottomText,
  ErrorMessage,
  StyledAuthLink,
} from "./shared/auth-styles";

const { Title, Text } = Typography;

export const LoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [form] = Form.useForm();
  const [formErrors, setFormErrors] = useState<any[]>([]);

  const isFormValid = () => {
    const values = form.getFieldsValue();
    return (
      values.email && values.password && formErrors.length === 0
    );
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      setError("");

      const response = await dispatch(loginUser(values)).unwrap();

      if (response?.accessToken) {
        notification.success({
          message: "Login Successful",
          description: "Welcome back!",
        });

        navigate("/customer-dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <AuthFormContainer>
        <Title
          level={2}
          style={{ textAlign: "center", fontWeight: "bold", marginBottom: 8 }}
        >
          Welcome Back
        </Title>
        <Text
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: 32,
            color: "#6B7280",
          }}
        >
          Sign in to your account
        </Text>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          size="large"
          form={form}
          onValuesChange={() => {
            form
              .validateFields()
              .then(() => setFormErrors([]))
              .catch(({ errorFields }) => setFormErrors(errorFields));
          }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#9CA3AF" }} />}
              placeholder="Email address"
              style={{ borderRadius: "8px", height: "48px" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#9CA3AF" }} />}
              placeholder="Password"
              style={{ borderRadius: "8px", height: "48px" }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              disabled={!isFormValid()}
              style={{
                height: "48px",
                fontSize: "16px",
                fontWeight: 500,
                background: !isFormValid() ? "#d9d9d9" : "#1890ff",
                color: "white",
              }}
            >
              Sign In
            </Button>
          </Form.Item>
          <BottomText>
            Don't have an account?{" "}
            <StyledAuthLink to={`/signup${location.search}`}>
              Sign up
            </StyledAuthLink>
          </BottomText>
        </Form>
      </AuthFormContainer>
    </AuthWrapper>
  );
};
