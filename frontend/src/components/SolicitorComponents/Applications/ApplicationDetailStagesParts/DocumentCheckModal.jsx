// src/components/ApplicationDetailStages/ApplicationDetailStagesParts/DocumentCheckModal.js
import { useEffect, useState } from 'react';
import { Alert, Button, Form, Modal, Spinner } from 'react-bootstrap';
import {
  fetchData,
  postData,
} from '../../../GenericFunctions/AxiosGenericFunctions';

const DocumentCheckModal = ({ isOpen, onClose, application, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [documentChecks, setDocumentChecks] = useState({
    loan_agreement_ready: false,
    undertaking_ready: false,
    all_requirements_uploaded: false,
    all_template_documents_uploaded: false,
    all_signatures_completed: false,
    agent_notes: '',
  });

  useEffect(() => {
    if (isOpen && application?.id) {
      fetchExistingChecks();
    }
  }, [isOpen, application?.id]);

  const fetchExistingChecks = async () => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = `/api/document-checks/${application.id}/`;
      const response = await fetchData('token', endpoint);

      if (response.data) {
        setDocumentChecks({
          loan_agreement_ready: response.data.loan_agreement_ready || false,
          undertaking_ready: response.data.undertaking_ready || false,
          all_requirements_uploaded:
            response.data.all_requirements_uploaded || false,
          all_template_documents_uploaded:
            response.data.all_template_documents_uploaded || false,
          all_signatures_completed:
            response.data.all_signatures_completed || false,
          agent_notes: response.data.agent_notes || '',
        });
      }
    } catch (error) {
      // If no existing checks found, keep default values
      console.log('No existing document checks found, using defaults');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (field) => {
    setDocumentChecks((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleNotesChange = (e) => {
    setDocumentChecks((prev) => ({
      ...prev,
      agent_notes: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);

    try {
      const endpoint = `/api/document-checks/${application.id}/`;
      const payload = {
        application: application.id,
        ...documentChecks,
        checked_by_agent: true,
        checked_at: new Date().toISOString(),
      };

      const response = await postData('token', endpoint, payload);

      if (response.status >= 200 && response.status < 300) {
        onConfirm(documentChecks);
        onClose();
      } else {
        throw new Error('Failed to save document checks');
      }
    } catch (error) {
      setError('Failed to save document checks. Please try again.');
      console.error('Error saving document checks:', error);
    } finally {
      setSaving(false);
    }
  };

  const allChecksComplete = Object.entries(documentChecks)
    .filter(([key]) => key !== 'agent_notes')
    .every(([key, value]) => value === true);

  const getDocumentSummary = () => {
    const allDocs = [
      ...(application.documents || []),
      ...(application.signed_documents || []),
    ];

    const totalDocs = allDocs.length;
    const uploadedDocs = allDocs.filter((doc) => doc.is_uploaded).length;
    const signedDocs = allDocs.filter(
      (doc) => doc.is_signed || !doc.signature_required
    ).length;
    const requiredDocs = allDocs.filter((doc) => doc.is_required).length;

    return { totalDocs, uploadedDocs, signedDocs, requiredDocs };
  };

  const docSummary = getDocumentSummary();

  return (
    <Modal show={isOpen} onHide={onClose} size='lg' centered>
      <Modal.Header closeButton>
        <Modal.Title>Document Verification Checklist</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className='text-center py-4'>
            <Spinner animation='border' role='status'>
              <span className='visually-hidden'>Loading...</span>
            </Spinner>
            <div className='mt-2'>Loading document checks...</div>
          </div>
        ) : (
          <>
            {error && (
              <Alert
                variant='danger'
                dismissible
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            <div className='mb-4 p-3 bg-light rounded'>
              <h6 className='mb-2'>📊 Document Summary</h6>
              <div className='row'>
                <div className='col-6'>
                  <small className='text-muted'>Total Documents:</small>
                  <div className='fw-bold'>{docSummary.totalDocs}</div>
                </div>
                <div className='col-6'>
                  <small className='text-muted'>Required Documents:</small>
                  <div className='fw-bold'>{docSummary.requiredDocs}</div>
                </div>
                <div className='col-6 mt-2'>
                  <small className='text-muted'>Uploaded:</small>
                  <div className='fw-bold text-success'>
                    {docSummary.uploadedDocs}
                  </div>
                </div>
                <div className='col-6 mt-2'>
                  <small className='text-muted'>Signed/Complete:</small>
                  <div className='fw-bold text-success'>
                    {docSummary.signedDocs}
                  </div>
                </div>
              </div>
            </div>

            <Form>
              <div className='mb-4'>
                <h6 className='mb-3'>📋 Agent Verification Checklist</h6>

                <Form.Check
                  type='checkbox'
                  id='loan-agreement'
                  label='Loan Agreement is ready and complete'
                  checked={documentChecks.loan_agreement_ready}
                  onChange={() => handleCheckboxChange('loan_agreement_ready')}
                  className='mb-3'
                />

                <Form.Check
                  type='checkbox'
                  id='undertaking'
                  label='Undertaking document is ready and complete'
                  checked={documentChecks.undertaking_ready}
                  onChange={() => handleCheckboxChange('undertaking_ready')}
                  className='mb-3'
                />

                <Form.Check
                  type='checkbox'
                  id='requirements'
                  label='All application requirements have been uploaded'
                  checked={documentChecks.all_requirements_uploaded}
                  onChange={() =>
                    handleCheckboxChange('all_requirements_uploaded')
                  }
                  className='mb-3'
                />

                <Form.Check
                  type='checkbox'
                  id='template-docs'
                  label='All template documents have been uploaded'
                  checked={documentChecks.all_template_documents_uploaded}
                  onChange={() =>
                    handleCheckboxChange('all_template_documents_uploaded')
                  }
                  className='mb-3'
                />

                <Form.Check
                  type='checkbox'
                  id='signatures'
                  label='All required signatures have been completed'
                  checked={documentChecks.all_signatures_completed}
                  onChange={() =>
                    handleCheckboxChange('all_signatures_completed')
                  }
                  className='mb-3'
                />
              </div>

              <Form.Group className='mb-3'>
                <Form.Label>📝 Agent Notes (Optional)</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={3}
                  placeholder='Add any notes about the document verification...'
                  value={documentChecks.agent_notes}
                  onChange={handleNotesChange}
                />
              </Form.Group>
            </Form>

            {!allChecksComplete && (
              <Alert variant='warning'>
                <small>
                  <strong>⚠️ Note:</strong> All checkboxes must be checked to
                  mark this stage as complete.
                </small>
              </Alert>
            )}
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant='secondary' onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button
          variant='success'
          onClick={handleSubmit}
          disabled={!allChecksComplete || saving || loading}
        >
          {saving ? (
            <>
              <Spinner animation='border' size='sm' className='me-2' />
              Saving...
            </>
          ) : (
            'Confirm All Documents Complete'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DocumentCheckModal;
