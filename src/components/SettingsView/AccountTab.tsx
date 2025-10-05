// src/components/SettingsView/AccountTab.tsx
import React from 'react';
import { Form, Button, Divider } from 'rsuite';
import Avatar from 'react-avatar';
import { FaCrown } from 'react-icons/fa6';
export interface SettingsFormData {
  name: string;
  email: string;
  promotionalEmails: boolean;
  applicationUpdates: boolean;
  weeklyUpdates: boolean;
  dailyUpdates: boolean;
  isMember: boolean;
}

interface AccountTabProps {
  formData: SettingsFormData;
  onChange: (value: any, name: keyof SettingsFormData) => void;
  onSubmit: () => void;
  onChangePassword: () => void;
  onDeleteClick: () => void;
  isMember: boolean;
}

const AccountTab: React.FC<AccountTabProps> = ({
  formData,
  onChange,
  onSubmit,
  onChangePassword,
  onDeleteClick,
  isMember
}) => (
  <Form fluid className="account-tab">
    {/* Profile Section */}
    <div className="profile-section">
      <h5 className="subject-title">Account Information</h5>
      <div className="avatar-container">
        <Avatar
          email={formData.email}
          name={formData.name}
          size="100"
          round
          className="profile-avatar"
          style={{ 'marginTop': 10 }}

        />
        {isMember && (
          <FaCrown className="crown-icon" />
        )}
        <div className="profile-info">
          <h6 className="profile-name">{formData.name || 'User'}</h6>
          <p className="profile-email">{formData.email}</p>
        </div>
      </div>
    </div>

    {/* Account Details Form */}
    <div className="form-section">
      <Form.Group controlId="name" className="form-group">
        <h6 className="form-label">Full Name</h6>
        <Form.Control
          name="name"
          value={formData.name}
          onChange={val => onChange(val, 'name')}
          className="form-input"
          placeholder="Enter your full name"
        />
      </Form.Group>

      <Form.Group controlId="email" className="form-group">
        <h6 className="form-label">Email Address</h6>
        <Form.Control
          name="email"
          type="email"
          value={formData.email}
          onChange={val => onChange(val, 'email')}
          className="form-input"
          placeholder="Enter your email address"
        />
      </Form.Group>

      <Button
        onClick={onSubmit}
        appearance="primary"
        className="save-button"
        block
      >
        Save Changes
      </Button>
    </div>

    <Divider className="section-divider" />

    {/* Security Section */}
    <div className="security-section">
      <h5 className="subject-title">Security</h5>
      <div className="action-card">
        <div className="action-info">
          <h6 className="action-title">Change Password</h6>
          <p className="action-description">Update your password to keep your account secure</p>
        </div>
        <Button
          onClick={onChangePassword}
          appearance="default"
          className="action-button"
        >
          Change Password
        </Button>
      </div>
    </div>

{/*     <h5 className="subject-title">Change Password</h5>
    <Button onClick={onChangePassword} appearance="default" block>
      Change Password
    </Button>
    <Divider /> */}

    {/* Danger Zone */}
    <div className="danger-section">
      <h5 className="subject-title danger-title">Danger Zone</h5>
      <div className="action-card danger-card">
        <div className="action-info">
          <h6 className="action-title">Delete Account</h6>
          <p className="action-description">Permanently delete your account and all associated data</p>
        </div>
        <Button
          appearance="primary"
          className="delete-button"
          onClick={onDeleteClick}
        >
          Delete
        </Button>
      </div>
    </div>
  </Form>
);

export default AccountTab;
