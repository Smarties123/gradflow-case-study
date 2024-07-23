import React, { useState } from 'react';
import { Form, Button, Panel, IconButton, Stack, Divider } from 'rsuite';
import { Link, useNavigate } from 'react-router-dom';
import GithubIcon from '@rsuite/icons/legacy/Github';
import FacebookIcon from '@rsuite/icons/legacy/Facebook';
import GoogleIcon from '@rsuite/icons/legacy/Google';
import WechatIcon from '@rsuite/icons/legacy/Wechat';
import Brand from '@/components/Brand';

interface LoginData {
  userName: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState<LoginData>({
    userName: '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: loginData.userName,
          password: loginData.password,
        }),
      });

      if (response.ok) {
        navigate("/panel"); // Use navigate for redirection
      } else {
        const errorText = await response.text();
        throw new Error(`Login failed: ${errorText}`);
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // Handle error, show message to user
    }
  };

  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      direction="column"
      style={{
        height: '100vh'
      }}
    >
      <Brand style={{ marginBottom: 10 }} />

      <Panel bordered style={{ background: '#fff', width: 400 }} header={<h3>Sign In</h3>}>
        <p style={{ marginBottom: 10 }}>
          <span className="text-muted">New Here? </span>{' '}
          <Link to="/sign-up"> Create an Account</Link>
        </p>

        <Form fluid onSubmit={handleLogin}>
          <Form.Group>
            <Form.ControlLabel>Username or email address</Form.ControlLabel>
            <Form.Control
              name="userName"
              value={loginData.userName}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>
              <span>Password</span>
              <a style={{ float: 'right' }}>Forgot password?</a>
            </Form.ControlLabel>
            <Form.Control
              name="password"
              type="password"
              value={loginData.password}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Stack spacing={6} divider={<Divider vertical />}>
              <Button appearance="primary" type="submit">Sign in</Button>
              <Stack spacing={6}>
                <IconButton icon={<WechatIcon />} appearance="subtle" />
                <IconButton icon={<GithubIcon />} appearance="subtle" />
                <IconButton icon={<FacebookIcon />} appearance="subtle" />
                <IconButton icon={<GoogleIcon />} appearance="subtle" />
              </Stack>
            </Stack>
          </Form.Group>
        </Form>
      </Panel>
    </Stack>
  );
};

export default Login;
