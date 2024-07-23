import React, { useState } from 'react';
import { Form, Button, Panel, InputGroup, Stack, Checkbox, Divider } from 'rsuite';
import EyeIcon from '@rsuite/icons/legacy/Eye';
import EyeSlashIcon from '@rsuite/icons/legacy/EyeSlash';
import { Link } from 'react-router-dom';
import Brand from '@/components/Brand';

interface FormData {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add your validation logic here
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.userName,
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        console.log("Done Successfully");
        // redirect to login.
      } else {
        throw new Error('Signup failed');
      }
    } catch (error) {
      console.error('An error occurred:', error);
      // handle error, show message to user
    }
  };

  const [visible, setVisible] = React.useState(false);

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
      <Panel
        header={<h3>Create an Account</h3>}
        bordered
        style={{ background: '#fff', width: 400 }}
      >
        <p>
          <span>Already have an account?</span> <Link to="/sign-in">Sign in here</Link>
        </p>

        <Divider>OR</Divider>

        <Form fluid onSubmit={handleSubmit}>
          <Form.Group>
            <Form.ControlLabel>Username</Form.ControlLabel>
            <Form.Control
              name="userName"
              value={formData.userName}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Email</Form.ControlLabel>
            <Form.Control
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.ControlLabel>Password</Form.ControlLabel>
            <InputGroup inside style={{ width: '100%' }}>
              <Form.Control
                name="password"
                type={visible ? 'text' : 'password'}
                autoComplete="off"
                value={formData.password}
                onChange={handleInputChange}
              />
              <InputGroup.Button onClick={() => setVisible(!visible)}>
                {visible ? <EyeIcon /> : <EyeSlashIcon />}
              </InputGroup.Button>
            </InputGroup>
          </Form.Group>

          <Form.Group>
            <Form.ControlLabel>Confirm Password</Form.ControlLabel>
            <Form.Control
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group>
            <Stack style={{ marginLeft: -10 }}>
              <Checkbox>I Agree</Checkbox>
              <Button appearance="link">Terms and conditions.</Button>
            </Stack>
          </Form.Group>

          <Form.Group>
            <Stack spacing={6}>
              <Button appearance="primary" type="submit">Submit</Button>
            </Stack>
          </Form.Group>
        </Form>
      </Panel>
    </Stack>
  );
};

export default Signup;
