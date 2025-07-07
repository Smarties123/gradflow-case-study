// src/components/SettingsView/NotificationsTab.tsx
import React from 'react';
import { Form, Checkbox, Button, Grid, Row, Col } from 'rsuite';
import { SettingsFormData } from './AccountTab';

interface Props {
  formData: SettingsFormData;
  onChange: (value: any, name: keyof SettingsFormData) => void;
  onSubmit: () => void;
}

const NotificationsTab: React.FC<Props> = ({
  formData,
  onChange,
  onSubmit
}) => (
  <Form fluid className="notifications-tab">
    <h5 className="subject-title">Email Preferences</h5>
    <Grid fluid>
      <Row>
        <Col xs={24}>
          <Form.Group controlId="applicationUpdates" className="form-group">
            <Checkbox
              checked={formData.applicationUpdates}
              onChange={(_, checked) => onChange(checked, 'applicationUpdates')}
            >
              <h6>Application Updates</h6>
              <div className="form-note">
                Receive updates about job applications, reminders, and deadlines.
              </div>
            </Checkbox>
          </Form.Group>

          <Form.Group controlId="promotionalEmails" className="form-group">
            <Checkbox
              checked={formData.promotionalEmails}
              onChange={(_, checked) => onChange(checked, 'promotionalEmails')}
            >
              <h6>Promotional Content</h6>
              <div className="form-note">
                Get news about new features, tips, and promotions.
              </div>
            </Checkbox>
          </Form.Group>
        </Col>
      </Row>
    </Grid>

    <Button
      appearance="primary"
      block
      style={{ marginTop: 16 }}
      onClick={onSubmit}
    >
      Save Preferences
    </Button>
  </Form>
);

export default NotificationsTab;
