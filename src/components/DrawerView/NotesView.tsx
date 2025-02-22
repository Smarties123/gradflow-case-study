import React from 'react';
import { Form, Input } from 'rsuite';

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

const NotesView = ({ formData, handleChange }) => {
  return (
    <div className="notes-view">
      <Form fluid>
        <Form.Group controlId="notes" className="form-group">
          <Form.ControlLabel className="formControlLabel">
            Notes
          </Form.ControlLabel>
          <Form.Control
            name="notes"
            rows={5}
            accepter={Textarea}
            value={formData.notes || ''}
            onChange={(value) => handleChange(value, 'notes')}
            className="full-width"
          />
        </Form.Group>
      </Form>
    </div>
  );
};

export default NotesView;
