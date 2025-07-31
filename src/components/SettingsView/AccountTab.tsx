// src/components/SettingsView/AccountTab.tsx
import React from 'react';
import { Form, Button, FlexboxGrid, Divider } from 'rsuite';
import Avatar from 'react-avatar';

export interface SettingsFormData {
  name: string;
  email: string;
  promotionalEmails: boolean;
  applicationUpdates: boolean;
  weeklyUpdates: boolean;
  dailyUpdates: boolean;
}

interface AccountTabProps {
  formData: SettingsFormData;
  onChange: (value: any, name: keyof SettingsFormData) => void;
  onSubmit: () => void;
  onChangePassword: () => void;
  onDeleteClick: () => void;
}

const AccountTab: React.FC<AccountTabProps> = ({
  formData,
  onChange,
  onSubmit,
  onChangePassword,
  onDeleteClick
}) => (
  <Form fluid>
    <h5 className="subject-title">Account Information</h5>
    <FlexboxGrid justify="center" align="middle" className="account-info">
      <FlexboxGrid.Item>
        <Avatar email={formData.email} name={formData.name} size="100" round />
      </FlexboxGrid.Item>
    </FlexboxGrid>

    <Form.Group controlId="name" className="form-group">
      <h6>Name</h6>
      <Form.Control
        name="name"
        value={formData.name}
        onChange={val => onChange(val, 'name')}
        className="full-width"
      />
    </Form.Group>

    <Form.Group controlId="email" className="form-group">
      <h6>Email</h6>
      <Form.Control
        name="email"
        value={formData.email}
        onChange={val => onChange(val, 'email')}
        className="full-width"
      />
    </Form.Group>

    <Button onClick={onSubmit} appearance="primary" block>
      Save Name & Email
    </Button>
    <Divider />

    <h5 className="subject-title">Change Password</h5>
    <Button onClick={onChangePassword} appearance="default" block>
      Change Password
    </Button>
    <Divider />

    <h5 className="subject-title">Delete Account</h5>
    <Button
      appearance="primary"
      block
      style={{ backgroundColor: '#FF6200' }}
      onClick={onDeleteClick}
    >
      Delete Account
    </Button>
  </Form>
);

export default AccountTab;
