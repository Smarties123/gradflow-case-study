import React, { useState, useEffect } from 'react';
import { Form, Grid, Row, Col, Input, DatePicker, SelectPicker } from 'rsuite';
import Github from '@uiw/react-color-github';
import { FormHelperText } from '@mui/material';

const Textarea = React.forwardRef((props, ref) => <Input {...props} as="textarea" ref={ref} />);

const DetailsView = ({
  formData,
  errors,
  handleChange,
  handleColorChange,
  statuses,
  card
}) => {

  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionSelected, setSuggestionSelected] = useState(false);

  useEffect(() => {
    const trimmed = formData.company.trim();

    if (trimmed.length >= 3 && !suggestionSelected) {
      fetch(`${process.env.REACT_APP_API_URL}/company-search?q=${encodeURIComponent(trimmed)}`)
        .then(res => res.ok ? res.json() : [])
        .then(data => {
          setCompanySuggestions(data.slice(0, 5));
          setShowSuggestions(true);
        })
        .catch(console.error);
    } else {
      setShowSuggestions(false);
      setCompanySuggestions([]);
    }
  }, [formData.company, suggestionSelected]);


  const onCompanyChange = (value) => {
    handleChange(value, 'company');

    if (value.trim().length < 3) {
      setShowSuggestions(false);
      setCompanySuggestions([]);
    }

    if (value.trim() === '') {
      handleChange('', 'companyLogo');
    }

    setSuggestionSelected(false);
  };



  const onCompanyKeyDown = (e) => {
    if (e.key === 'Enter' && companySuggestions.length) {
      e.preventDefault();
      onSuggestionClick(companySuggestions[0]);
    }
  };

  const onSuggestionClick = (s) => {
    handleChange(s.name, 'company');
    handleChange(s.logo_url, 'companyLogo');
    setSuggestionSelected(true);
    setShowSuggestions(false);
  };


  return (
    <Form fluid>
      <Grid fluid>
        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Group controlId="company" className="form-group">
              <Form.ControlLabel className="formControlLabel">
                Company
              </Form.ControlLabel>
              <div className="company-input-wrapper">
                <Form.Control
                  name="company"
                  value={formData.company}
                  onChange={onCompanyChange}
                  onKeyDown={onCompanyKeyDown}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}



                  className="full-width"
                />
                {formData.companyLogo && (
                  <img
                    src={formData.companyLogo}
                    alt={formData.company}
                    className="drawer-company-logo"
                  />
                )}

                {showSuggestions && companySuggestions.length > 0 && (
                  <ul className="suggestions-list">
                    {companySuggestions.map((s, i) => (
                      <li key={i} onClick={() => onSuggestionClick(s)}>
                        {s.logo_url && (
                          <img
                            src={s.logo_url}
                            alt={s.name}
                            className="company-logo-modal"
                          />
                        )}
                        <div className="company-details">
                          <span className="company-name-modal">{s.name}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Form.Group>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Group controlId="position" className="form-group">
              <Form.ControlLabel className="formControlLabel">
                Position
              </Form.ControlLabel>
              <Form.Control
                name="position"
                value={formData.position}
                onChange={(value) => handleChange(value, 'position')}
                className="full-width"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col xs={24}>
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
          </Col>
        </Row>

        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Group controlId="columnName" className="form-group">
              <Form.ControlLabel className="formControlLabel">
                Status
              </Form.ControlLabel>
              <SelectPicker
                name="StatusId"
                value={formData.StatusId || card.StatusId}
                onChange={(value) => handleChange(value, 'StatusId')}
                data={statuses.map((status) => ({
                  label: status.StatusName,
                  value: status.StatusId
                }))}
                className="full-width"
                placeholder="Select Status"
                searchable={false}
              />
            </Form.Group>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Group controlId="date_applied" className="form-group">
              <Form.ControlLabel className="formControlLabel">
                Date Applied
              </Form.ControlLabel>
              <DatePicker
                oneTap
                format="dd-MM-yyyy"
                className="full-width"
                value={formData.date_applied || ''}
                onChange={(value) => handleChange(value, 'date_applied')}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col xs={24} sm={12}>
            <Form.Group controlId="deadline" className="form-group">
              <Form.ControlLabel className="formControlLabel">
                Deadline
              </Form.ControlLabel>
              <DatePicker
                oneTap
                format="dd-MM-yyyy"
                className="full-width"
                value={
                  formData.deadline instanceof Date && !isNaN(formData.deadline)
                    ? formData.deadline
                    : null
                }
                onChange={(value) => handleChange(value, 'deadline')}
              />
              {errors.deadline && (
                <FormHelperText id="error" error>
                  {errors.deadline}
                </FormHelperText>
              )}
            </Form.Group>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Group controlId="salary" className="form-group">
              <Form.ControlLabel className="formControlLabel">
                Salary (£)
              </Form.ControlLabel>
              <Form.Control
                name="salary"
                value={formData.salary || ''}
                onChange={(value) => {
                  const numericValue = value.replace(/[^0-9.]/g, '');
                  handleChange(numericValue, 'salary');
                }}
                className="full-width"
                maxLength={10}
              />
              {errors.salary && (
                <FormHelperText id="error" error>
                  {errors.salary}
                </FormHelperText>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col xs={24}>
            <Form.Group controlId="location" className="form-group">
              <Form.ControlLabel className="formControlLabel">
                Location
              </Form.ControlLabel>
              <Form.Control
                name="location"
                value={formData.location || ''}
                onChange={(value) => handleChange(value, 'location')}
                className="full-width"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col xs={24}>
            <Form.Group controlId="url" className="form-group">
              <Form.ControlLabel className="formControlLabel">
                Edit URL
              </Form.ControlLabel>
              <Form.Control
                name="url"
                value={formData.url || ''}
                onChange={(value) => handleChange(value, 'url')}
                className="full-width"
              />
            </Form.Group>
          </Col>
        </Row>

        <Row gutter={10}>
          <Col xs={24}>
            <Form.Group controlId="card_color" className="form-group">
              <div className="card-color-picker">
                <Form.ControlLabel className="formControlLabel">
                  Card Color
                </Form.ControlLabel>
                <Github
                  placement="Top"
                  color={formData.card_color}
                  onChange={(color) => handleColorChange(color)}
                  className="color-picker"
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Grid>
    </Form>
  );
};

export default DetailsView;
