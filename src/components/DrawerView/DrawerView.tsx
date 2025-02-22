import React, { useState, useEffect } from 'react';
import { Drawer, FlexboxGrid, Grid, Row, Col, Button } from 'rsuite';
import { useUser } from '@/components/User/UserContext';
import dayjs from 'dayjs';
import { useBoardData } from '../../hooks/useBoardData';
import { useFileData } from '../../hooks/useFileData';

import ProgressNavigation from './ProgressNavigation';
import DetailsView from './DetailsView';
import NotesView from './NotesView';
import DocumentsView from './DocumentsView';
import FilePopup from '../FilePopup/FilePopup';

import './DrawerView.less';

const DrawerView = ({
  show,
  onClose,
  card = {},
  updateCard,
  columnName,
  updateStatus,
  statuses = [],
  updateStatusLocally
}) => {
  const { user } = useUser();
  const { columns, loading: boardLoading } = useBoardData(user);
  const { uploadAndCreateFile, files, updateFile, deleteFile } = useFileData();

  const [currentView, setCurrentView] = useState<'details' | 'documents' | 'notes'>('details');
  const [errors, setErrors] = useState({});
  const [appFiles, setAppFiles] = useState([]);

  // Hover & File popup
  const [hoveredFileId, setHoveredFileId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePopupOpen, setFilePopupOpen] = useState(false);

  // Building the "Attach existing file" dropdown
  const [attachFileSelections, setAttachFileSelections] = useState<number[]>([]);

  const [allApps, setAllApps] = useState([]);

  // Helpers
  const parseDate = (dateStr) => {
    return dateStr ? dayjs(dateStr).toDate() : null;
  };

  // Form data
  const [formData, setFormData] = useState({
    company: card.company || '',
    companyLogo: card.companyLogo || '',
    position: card.position || '',
    deadline: card.deadline ? parseDate(card.deadline) : null,
    location: card.location || '',
    url: card.url || '',
    notes: card.notes || '',
    salary: card.salary,
    interview_stage: card.interview_stage || '',
    date_applied: card.date_applied ? parseDate(card.date_applied) : null,
    card_color: card.card_color || '#ffffff',
    cv: card.cv || null,
    coverLetter: card.coverLetter || null,
    StatusId: card.StatusId || null
  });

  // Fetch applications (for FilePopup) once columns are loaded
  useEffect(() => {
    if (!boardLoading && columns?.length > 0) {
      const newApplications = columns.flatMap((col) =>
        col.cards.map((thisCard) => ({
          label: `${thisCard.position} (${col.title})`,
          value: Number(thisCard.id)
        }))
      );
      setAllApps(newApplications);
    }
  }, [boardLoading, columns]);

  // If there's a new deadline, parse it
  useEffect(() => {
    if (card.deadline) {
      const parsedDeadline = parseDate(card.deadline);
      if (parsedDeadline) {
        setFormData((prevData) => ({
          ...prevData,
          deadline: parsedDeadline
        }));
      }
    }
  }, [card.deadline]);

  // Filter the files for *this* application
  useEffect(() => {
    if (!card.id) {
      console.warn('ID is missing from card prop:', card);
      onClose();
    }
    if (!files) return;

    const relevantFiles = files.filter((f) => {
      if (!Array.isArray(f.ApplicationIds)) return false;
      return f.ApplicationIds.includes(parseInt(card.id, 10));
    });
    setAppFiles(relevantFiles);
  }, [card, files, onClose]);

  // Avoid "ResizeObserver loop completed" console spam in some browsers
  useEffect(() => {
    window.addEventListener('error', (e) => {
      if (e.message.includes('ResizeObserver loop completed')) {
        e.preventDefault();
      }
    });
  }, []);

  // ========== FORM VALIDATION ==========
  const validateForm = () => {
    const validationErrors: any = {};

    if (formData.salary < 0) {
      validationErrors.salary = 'Salary cannot be negative.';
    } else if (formData.salary && !/^\d{1,3}(,\d{3})*(\.\d+)?$/.test(formData.salary)) {
      validationErrors.salary = 'Salary must be a valid number';
    }

    if (formData.deadline && formData.date_applied && formData.deadline < formData.date_applied) {
      validationErrors.deadline = 'Deadline cannot be before the date applied.';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (value, name) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
  };

  // ========== COLOR PICKER ==========
  const handleColorChange = (color) => {
    setFormData((prev) => ({ ...prev, card_color: color.hex }));
  };

  // ========== FILE UPLOAD HANDLERS ==========
  const handleFileUpload = (e, type: 'cv' | 'coverLetter') => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        [type]: { name: file.name, file }
      }));
    }
  };

  const removeFile = (type: 'cv' | 'coverLetter') => {
    setFormData((prev) => ({
      ...prev,
      [type]: null
    }));
  };

  // ========== EXISTING FILES - DETACH/DELETE ==========
  const handleRemove = async (file) => {
    const updatedApps = file.ApplicationIds.filter(
      (appId) => appId !== parseInt(card.id, 10)
    );
    try {
      await updateFile(file.fileId, { applicationsIds: updatedApps });
    } catch (err) {
      console.error('Error removing application from file:', err);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await deleteFile(fileId);
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  // ========== FILE POPUP ==========
  const openFile = (file) => {
    setSelectedFile({
      ...file,
      url: file.fileUrl,
      name: file.fileName,
      documentType: file.fileType
    });
    setFilePopupOpen(true);
  };

  // ========== ATTACH EXISTING FILES ==========
  // 1) Unused files (not attached to this app)
  const unusedFiles = files.filter((f) => {
    if (f.ApplicationIds.includes(parseInt(card.id, 10))) return false;
    return true;
  });

  // 2) Convert to array for <SelectPicker>
  const unusedFilesData = unusedFiles.map((f) => ({
    label: `${f.fileName} (${f.fileType})`,
    value: f.fileId
  }));

  // 3) Attach them
  const handleAttachFiles = async () => {
    const selections = Array.isArray(attachFileSelections) ? attachFileSelections : [];
    for (const fileId of selections) {
      const targetFile = files.find((f) => f.fileId === fileId);
      if (!targetFile) continue;

      const currentAppIds = Array.isArray(targetFile.ApplicationIds)
        ? targetFile.ApplicationIds
        : [];
      const updatedAppIds = [...currentAppIds, parseInt(card.id, 10)];

      await updateFile(targetFile.fileId, { applicationsIds: updatedAppIds });
    }
    setAttachFileSelections([]);
  };

  // ========== SUBMIT ==========
  const handleSubmit = async () => {
    if (!validateForm()) {
      console.error('Form has validation errors.');
      return;
    }
    console.log('Updating card with ID:', card.id);

    try {
      // 1) Upload CV if present
      if (formData.cv?.file) {
        await uploadAndCreateFile({
          file: formData.cv.file,
          docType: 'cv',
          typeId: 1,
          description: 'CV uploaded via DrawerView',
          applicationsIds: [Number(card.id)]
        });
      }

      // 2) Upload Cover Letter if present
      if (formData.coverLetter?.file) {
        await uploadAndCreateFile({
          file: formData.coverLetter.file,
          docType: 'cl',
          typeId: 2,
          description: 'Cover Letter uploaded via DrawerView',
          applicationsIds: [Number(card.id)]
        });
      }

      // 3) Build the updated application data
      const updatedData = {
        company: formData.company,
        position: formData.position,
        deadline: formData.deadline
          ? dayjs(formData.deadline).format('YYYY-MM-DD')
          : null,
        location: formData.location,
        url: formData.url,
        notes: formData.notes,
        salary: formData.salary,
        interview_stage: formData.interview_stage,
        date_applied: formData.date_applied
          ? dayjs(formData.date_applied).format('YYYY-MM-DD')
          : null,
        card_color: formData.card_color,
        statusId: formData.StatusId || card.StatusId
      };

      if (!user?.token) {
        throw new Error('User not authenticated');
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/applications/${card.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(updatedData)
        }
      );

      if (response.ok) {
        const updatedCard = await response.json();

        // If the status changed, update locally
        if (updatedData.statusId !== card.StatusId) {
          updateStatusLocally(card.id, updatedData.statusId);
        } else {
          updateCard(card.id, updatedData);
        }
        onClose();
      } else {
        const errorText = await response.text();
        console.error('Failed to update the card:', errorText);
      }
    } catch (error) {
      console.error('Error updating card:', error);
    }
  };

  // ========== RESPONSIVE DRAWER SETTINGS ==========
  const drawerSize = window.innerWidth <= 600 ? 'xs' : 'sm';
  const drawerPlacement = window.innerWidth <= 600 ? 'top' : 'right';

  // ========== PROGRESS CALCULATIONS ==========
  const calculateProgressPercentage = (fields: string[]) => {
    const filled = fields.filter((field) => {
      const value = formData[field];
      return value !== null && value !== undefined && value !== '';
    }).length;
    const total = fields.length;
    return Math.round((filled / total) * 100);
  };

  const detailsFields = [
    'company',
    'position',
    'notes',
    'StatusId',
    'date_applied',
    'deadline',
    'salary',
    'url',
    'card_color',
    'location'
  ];
  const documentsFields = ['cv', 'coverLetter'];
  const notesFields = ['notes'];

  const detailsProgress = calculateProgressPercentage(detailsFields);
  const documentsProgress = calculateProgressPercentage(documentsFields);
  const notesProgress = calculateProgressPercentage(notesFields);

  return (
    <>
      <Drawer open={show} onClose={onClose} size={drawerSize} placement={drawerPlacement}>
        <Drawer.Header>
          <Drawer.Title>Edit Card</Drawer.Title>
          <FlexboxGrid justify="space-between" className="drawer-links">
            <FlexboxGrid.Item>
              <ProgressNavigation
                currentView={currentView}
                setCurrentView={setCurrentView}
                detailsProgress={detailsProgress}
                documentsProgress={documentsProgress}
                notesProgress={notesProgress}
              />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Drawer.Header>

        <Drawer.Body>
          {/* RENDER DIFFERENT SECTIONS BASED ON currentView */}
          {currentView === 'details' && (
            <DetailsView
              formData={formData}
              errors={errors}
              handleChange={handleChange}
              handleColorChange={handleColorChange}
              statuses={statuses}
              card={card}
            />
          )}

          {currentView === 'notes' && (
            <NotesView
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {currentView === 'documents' && (
            <DocumentsView
              card={card}
              formData={formData}
              appFiles={appFiles}
              hoveredFileId={hoveredFileId}
              setHoveredFileId={setHoveredFileId}
              openFile={openFile}
              handleRemove={handleRemove}
              handleDelete={handleDelete}
              handleFileUpload={handleFileUpload}
              removeFile={removeFile}
              attachFileSelections={attachFileSelections}
              setAttachFileSelections={setAttachFileSelections}
              handleAttachFiles={handleAttachFiles}
              unusedFilesData={unusedFilesData}
            />
          )}

          {/* Drawer Buttons */}
          <Grid fluid>
            <Row gutter={10} className="drawer-buttons">
              <Col xs={24} sm={12}>
                <Button onClick={handleSubmit} appearance="primary" block>
                  Update
                </Button>
              </Col>
              <Col xs={24} sm={12}>
                <Button onClick={onClose} appearance="subtle" block>
                  Close
                </Button>
              </Col>
            </Row>
          </Grid>
        </Drawer.Body>
      </Drawer>

      {/* FILE POPUP */}
      {isFilePopupOpen && (
        <FilePopup
          isOpen={isFilePopupOpen}
          toggle={() => setFilePopupOpen(false)}
          selectedFile={selectedFile}
          applications={allApps}
          onLocalUpdate={(updatedFile) => {
            // Optionally handle any local updates to the file
          }}
          readOnly={true}
        />
      )}
    </>
  );
};

export default DrawerView;
