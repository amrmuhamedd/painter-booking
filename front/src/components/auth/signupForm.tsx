import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { LockOutlined, MailOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select, notification, Radio, Divider, Space } from "antd";
import { Typography } from "antd";

import { registerUser } from "../../store/auth/authSlice";
import type { AppDispatch, RootState } from "../../store/store";

import {
  AuthFormContainer,
  AuthWrapper,
  BottomText,
  ErrorMessage,
  StyledAuthLink,
} from "./shared/auth-styles";

const { Title, Text } = Typography;

export const SignupForm = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state: RootState) => state.auth);
  const [formErrors, setFormErrors] = useState<any[]>([]);

  const isFormValid = () => {
    const values = form.getFieldsValue();
    
    const baseFieldsValid = values.email && values.password && values.name && formErrors.length === 0;
    
    if (selectedRole === "painter") {
      return baseFieldsValid && 
        values.phone && 
        values.specialization && 
        values.experience !== undefined && 
        values.hourlyRate !== undefined;
    }
    
    return baseFieldsValid;
  };

  const [selectedRole, setSelectedRole] = useState<string>("customer");
  
  const handleRoleChange = (e: any) => {
    setSelectedRole(e.target.value);
  };

  const handleSignup = async (values: {
    email: string;
    password: string;
    name: string;
    role: string;
    phone?: string;
    specialization?: string;
    experience?: number;
    hourlyRate?: number;
  }) => {
    const resultAction = await dispatch(registerUser(values));
    if (registerUser.fulfilled.match(resultAction)) {
      notification.success({
        message: "Registration Successful",
        description: "Your account has been created successfully.",
        duration: 3,
        placement: "bottomRight",
      });
      navigate("/");
    } else {
      notification.error({
        message: "Registration Failed",
        description: resultAction.payload as string,
        duration: 3,
        placement: "bottomRight",
      });
    }
  };

  return (
    <AuthWrapper>
      <AuthFormContainer>
        <Title
          level={2}
          style={{ textAlign: "center", fontWeight: "bold", marginBottom: 8 }}
        >
          Create Account
        </Title>
        <Text
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: 32,
            color: "#6B7280",
          }}
        >
          Sign up to get started
        </Text>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form
          name="signup"
          onFinish={handleSignup}
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
            name="name"
            rules={[
              { required: true, message: "Please enter your name" },
              { min: 3, message: "name should be more than 3 characters" },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "#9CA3AF" }} />}
              placeholder="Full name"
              style={{ borderRadius: "8px", height: "48px" }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: "#9CA3AF" }} />}
              placeholder="Email address"
              style={{ borderRadius: "8px", height: "48px" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please enter your password" },
              {
                min: 8,
                message: "Password must be at least 8 characters long",
              },
              {
                pattern:
                  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{};':"\\|,.<>/?-])[A-Za-z\d!@#$%^&*()_+[\]{};':"\\|,.<>/?-]+$/,
                message:
                  "Password must contain at least one letter, one number, and one special character",
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "#9CA3AF" }} />}
              placeholder="Password"
              style={{ borderRadius: "8px", height: "48px" }}
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="I want to register as"
            initialValue="customer"
          >
            <Radio.Group onChange={handleRoleChange} value={selectedRole}>
              <Radio value="customer">Customer</Radio>
              <Radio value="painter">Painter</Radio>
            </Radio.Group>
          </Form.Item>
          
          {selectedRole === "painter" && (
            <>
              <Divider orientation="left">Painter Profile</Divider>
              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: "Phone number is required for painters" },
                  { pattern: /^\+?[0-9]{10,15}$/, message: "Please enter a valid phone number" }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: "#9CA3AF" }} />}
                  placeholder="Phone number"
                  style={{ borderRadius: "8px", height: "48px" }}
                />
              </Form.Item>
              
              <Form.Item
                name="specialization"
                label="Specialization"
                rules={[{ required: true, message: "Please select your specialization" }]}
              >
                <Select
                  placeholder="Select your specialization"
                  style={{ borderRadius: "8px", height: "48px" }}
                  options={[
                    { value: "interior", label: "Interior Painting" },
                    { value: "exterior", label: "Exterior Painting" },
                    { value: "decorative", label: "Decorative Painting" },
                    { value: "commercial", label: "Commercial Painting" },
                    { value: "residential", label: "Residential Painting" },
                  ]}
                />
              </Form.Item>
              
              <Space style={{ display: "flex" }}>
                <Form.Item
                  name="experience"
                  label="Years of Experience"
                  style={{ width: "50%" }}
                  rules={[{ required: true, message: "Experience is required" }]}
                >
                  <InputNumber
                    min={0}
                    max={50}
                    style={{ width: "100%" }}
                    placeholder="Years"
                  />
                </Form.Item>
                
                <Form.Item
                  name="hourlyRate"
                  label="Hourly Rate ($)"
                  style={{ width: "50%" }}
                  rules={[{ required: true, message: "Hourly rate is required" }]}
                >
                  <InputNumber
                    min={10}
                    max={500}
                    style={{ width: "100%" }}
                    placeholder="Rate"
                    prefix="$"
                  />
                </Form.Item>
              </Space>
            </>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={!isFormValid()}
              block
              style={{
                height: "48px",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 500,
                background: !isFormValid() ? "#d9d9d9" : "#1890ff",
                color: "white",
              }}
            >
              Create Account
            </Button>
          </Form.Item>

          <BottomText>
            Already have an account?{" "}
            <StyledAuthLink to="/login">Sign in</StyledAuthLink>
          </BottomText>
        </Form>
      </AuthFormContainer>
    </AuthWrapper>
  );
};
