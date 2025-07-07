import {
  AlertCircle,
  CheckCircle,
  Clock,
  Edit3,
  FileText,
  FileUp,
  MessageSquare,
  Plus,
  RefreshCw,
  Upload,
  XCircle,
} from 'lucide-react';
import { useState } from 'react';

const StatusManagementTab = ({
  submissionHistory,
  onRefresh,
  getSubmissionDetails,
  updateSubmissionStatus,
  addErrorRecord,
  resolveErrorRecord,
  uploadCCRResponse,
  showAlert,
  isLoading,
}) => {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionDetails, setSubmissionDetails] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: '',
    notes: '',
    errorDetails: '',
  });
  const [errorForm, setErrorForm] = useState({
    errorType: 'VALIDATION',
    errorDescription: '',
    lineNumber: '',
    originalLineContent: '',
    contractId: '',
  });
  const [uploadFile, setUploadFile] = useState(null);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'GENERATED':
        return <FileText className='text-success' size={16} />;
      case 'UPLOADED':
        return <Upload className='text-primary' size={16} />;
      case 'ACKNOWLEDGED':
        return <CheckCircle className='text-success' size={16} />;
      case 'ERROR':
        return <XCircle className='text-danger' size={16} />;
      case 'PARTIAL_ERROR':
        return <AlertCircle className='text-warning' size={16} />;
      default:
        return <Clock className='text-secondary' size={16} />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'GENERATED':
        return 'badge bg-success';
      case 'UPLOADED':
        return 'badge bg-primary';
      case 'ACKNOWLEDGED':
        return 'badge bg-info';
      case 'ERROR':
        return 'badge bg-danger';
      case 'PARTIAL_ERROR':
        return 'badge bg-warning';
      default:
        return 'badge bg-secondary';
    }
  };

  const loadSubmissionDetails = async (submissionId) => {
    try {
      const result = await getSubmissionDetails(submissionId);
      if (result.success) {
        setSubmissionDetails(result.data);
        setSelectedSubmission(submissionId);
      } else {
        showAlert(result.error || 'Failed to load submission details', 'error');
      }
    } catch (error) {
      showAlert('Error loading submission details', 'error');
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedSubmission) return;
    try {
      const result = await updateSubmissionStatus(
        selectedSubmission,
        statusForm.status,
        statusForm.notes,
        statusForm.errorDetails
      );

      if (result.success) {
        showAlert('Status updated successfully', 'success');
        setShowStatusModal(false);
        onRefresh();
        loadSubmissionDetails(selectedSubmission);
        setStatusForm({ status: '', notes: '', errorDetails: '' });
      } else {
        showAlert(result.error || 'Failed to update status', 'error');
      }
    } catch (error) {
      showAlert('Error updating status', 'error');
    }
  };

  const handleAddError = async () => {
    if (!selectedSubmission) return;
    try {
      const result = await addErrorRecord(selectedSubmission, errorForm);
      if (result.success) {
        showAlert('Error record added successfully', 'success');
        setShowErrorModal(false);
        onRefresh();
        loadSubmissionDetails(selectedSubmission);
        setErrorForm({
          errorType: 'VALIDATION',
          errorDescription: '',
          lineNumber: '',
          originalLineContent: '',
          contractId: '',
        });
      } else {
        showAlert(result.error || 'Failed to add error record', 'error');
      }
    } catch (error) {
      showAlert('Error adding error record', 'error');
    }
  };

  const handleResolveError = async (
    errorId,
    resolutionStatus,
    notes = '',
    carryForward = false
  ) => {
    try {
      const result = await resolveErrorRecord(
        errorId,
        resolutionStatus,
        notes,
        carryForward
      );

      if (result.success) {
        showAlert('Error resolved successfully', 'success');
        loadSubmissionDetails(selectedSubmission);
      } else {
        showAlert(result.error || 'Failed to resolve error', 'error');
      }
    } catch (error) {
      showAlert('Error resolving error record', 'error');
    }
  };

  const handleFileUpload = async () => {
    if (!selectedSubmission || !uploadFile) return;

    try {
      const result = await uploadCCRResponse(selectedSubmission, uploadFile);

      if (result.success) {
        showAlert(
          `CCR response processed: ${result.errors_found} errors found`,
          'success'
        );
        setShowUploadModal(false);
        setUploadFile(null);
        onRefresh();
        loadSubmissionDetails(selectedSubmission);
      } else {
        showAlert(result.error || 'Failed to upload CCR response', 'error');
      }
    } catch (error) {
      showAlert('Error uploading CCR response', 'error');
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  const formatDateTime = (dateString) => new Date(dateString).toLocaleString();

  return (
    <div className='tab-pane show active'>
      <div className='row g-3'>
        <div className='col-md-6'>
          <div className='card'>
            <div className='card-header d-flex justify-content-between align-items-center'>
              <h6 className='card-title mb-0'>Recent Submissions</h6>
              <button
                className='btn btn-sm btn-outline-primary'
                onClick={onRefresh}
                disabled={isLoading}
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>
            <div className='card-body'>
              {submissionHistory.length > 0 ? (
                <div className='list-group list-group-flush'>
                  {submissionHistory.slice(0, 10).map((submission) => (
                    <div
                      key={`status-submission-${submission.id}`}
                      className={`list-group-item list-group-item-action ${
                        selectedSubmission === submission.id ? 'active' : ''
                      }`}
                      onClick={() => loadSubmissionDetails(submission.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className='d-flex justify-content-between align-items-center'>
                        <div>
                          <div className='d-flex align-items-center mb-1'>
                            {getStatusIcon(submission.status)}
                            <strong className='ms-2'>
                              {formatDate(submission.reference_date)}
                            </strong>
                          </div>
                          <div className='d-flex gap-2 align-items-center'>
                            <span
                              className={getStatusBadgeClass(submission.status)}
                            >
                              {submission.status}
                            </span>
                            {submission.is_test && (
                              <span className='badge bg-warning'>TEST</span>
                            )}
                            {submission.error_statistics?.total_errors > 0 && (
                              <span className='badge bg-danger'>
                                {submission.error_statistics.total_errors}{' '}
                                errors
                              </span>
                            )}
                          </div>
                        </div>
                        <small className='text-muted'>
                          {submission.total_records} records
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='text-center py-4'>
                  <p className='text-muted'>No submissions found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='col-md-6'>
          {submissionDetails ? (
            <div className='card'>
              <div className='card-header'>
                <h6 className='card-title mb-0 d-flex align-items-center'>
                  {getStatusIcon(submissionDetails.status)}
                  <span className='ms-2'>
                    Submission Details –{' '}
                    {formatDate(submissionDetails.reference_date)}
                  </span>
                </h6>
              </div>
              <div className='card-body'>
                <div className='row g-2 mb-3'>
                  <div className='col-6'>
                    <small className='text-muted'>Status</small>
                    <div>
                      <span
                        className={getStatusBadgeClass(
                          submissionDetails.status
                        )}
                      >
                        {submissionDetails.status}
                      </span>
                    </div>
                  </div>
                  <div className='col-6'>
                    <small className='text-muted'>Records</small>
                    <div>
                      <strong>{submissionDetails.total_records}</strong>
                    </div>
                  </div>
                  <div className='col-6'>
                    <small className='text-muted'>Generated</small>
                    <div>{formatDateTime(submissionDetails.generated_at)}</div>
                  </div>
                  <div className='col-6'>
                    <small className='text-muted'>Updated By</small>
                    <div>{submissionDetails.status_updated_by || 'System'}</div>
                  </div>
                </div>

                {submissionDetails.error_statistics?.total_errors > 0 && (
                  <div className='alert alert-warning mb-3'>
                    <h6 className='alert-heading d-flex align-items-center'>
                      <AlertCircle size={16} className='me-2' />
                      Error Summary
                    </h6>
                    <div className='row g-2'>
                      <div className='col-4'>
                        <small>
                          Total:{' '}
                          <strong>
                            {submissionDetails.error_statistics.total_errors}
                          </strong>
                        </small>
                      </div>
                      <div className='col-4'>
                        <small>
                          Pending:{' '}
                          <strong>
                            {submissionDetails.error_statistics.pending_errors}
                          </strong>
                        </small>
                      </div>
                      <div className='col-4'>
                        <small>
                          Resolved:{' '}
                          <strong>
                            {submissionDetails.error_statistics.resolved_errors}
                          </strong>
                        </small>
                      </div>
                    </div>
                  </div>
                )}

                <div className='d-flex gap-2 mb-3'>
                  <button
                    className='btn btn-sm btn-primary'
                    onClick={() => {
                      setStatusForm({
                        status: submissionDetails.status,
                        notes: '',
                        errorDetails: submissionDetails.error_details || '',
                      });
                      setShowStatusModal(true);
                    }}
                  >
                    <Edit3 size={14} className='me-1' />
                    Update Status
                  </button>
                  <button
                    className='btn btn-sm btn-warning'
                    onClick={() => setShowErrorModal(true)}
                  >
                    <Plus size={14} className='me-1' />
                    Add Error
                  </button>
                  <button
                    className='btn btn-sm btn-info'
                    onClick={() => setShowUploadModal(true)}
                  >
                    <FileUp size={14} className='me-1' />
                    Upload Response
                  </button>
                </div>

                {/* Modals below */}
              </div>
            </div>
          ) : (
            <div className='card'>
              <div className='card-body text-center py-5'>
                <MessageSquare size={48} className='text-muted mb-3' />
                <p className='text-muted'>
                  Select a submission to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STATUS UPDATE MODAL */}
      {showStatusModal && (
        <div
          className='modal fade show d-block'
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Update Submission Status</h5>
                <button
                  type='button'
                  className='btn-close'
                  onClick={() => setShowStatusModal(false)}
                ></button>
              </div>
              <div className='modal-body'>
                <div className='mb-3'>
                  <label className='form-label'>Status</label>
                  <select
                    className='form-select'
                    value={statusForm.status}
                    onChange={(e) =>
                      setStatusForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                  >
                    <option value='GENERATED'>Generated</option>
                    <option value='UPLOADED'>Uploaded</option>
                    <option value='ACKNOWLEDGED'>Acknowledged</option>
                    <option value='ERROR'>Error</option>
                    <option value='PARTIAL_ERROR'>Partial Error</option>
                  </select>
                </div>
                <div className='mb-3'>
                  <label className='form-label'>Notes</label>
                  <textarea
                    className='form-control'
                    rows='3'
                    value={statusForm.notes}
                    onChange={(e) =>
                      setStatusForm((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                  />
                </div>
                {(statusForm.status === 'ERROR' ||
                  statusForm.status === 'PARTIAL_ERROR') && (
                  <div className='mb-3'>
                    <label className='form-label'>Error Details</label>
                    <textarea
                      className='form-control'
                      rows='3'
                      value={statusForm.errorDetails}
                      onChange={(e) =>
                        setStatusForm((prev) => ({
                          ...prev,
                          errorDetails: e.target.value,
                        }))
                      }
                    />
                  </div>
                )}
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={() => setShowStatusModal(false)}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='btn btn-primary'
                  onClick={handleStatusUpdate}
                  disabled={!statusForm.status}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD ERROR MODAL */}
      {showErrorModal && (
        <div
          className='modal fade show d-block'
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className='modal-dialog modal-lg'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Add Error Record</h5>
                <button
                  type='button'
                  className='btn-close'
                  onClick={() => setShowErrorModal(false)}
                ></button>
              </div>
              <div className='modal-body'>
                <div className='mb-3'>
                  <label className='form-label'>Error Type</label>
                  <select
                    className='form-select'
                    value={errorForm.errorType}
                    onChange={(e) =>
                      setErrorForm((prev) => ({
                        ...prev,
                        errorType: e.target.value,
                      }))
                    }
                  >
                    <option value='VALIDATION'>Validation Error</option>
                    <option value='MISSING_DATA'>Missing Data</option>
                    <option value='FORMAT_ERROR'>Format Error</option>
                    <option value='DUPLICATE'>Duplicate Record</option>
                    <option value='OTHER'>Other</option>
                  </select>
                </div>
                <div className='mb-3'>
                  <label className='form-label'>Error Description</label>
                  <textarea
                    className='form-control'
                    rows='3'
                    value={errorForm.errorDescription}
                    onChange={(e) =>
                      setErrorForm((prev) => ({
                        ...prev,
                        errorDescription: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>Original Line Content</label>
                  <textarea
                    className='form-control'
                    rows='2'
                    value={errorForm.originalLineContent}
                    onChange={(e) =>
                      setErrorForm((prev) => ({
                        ...prev,
                        originalLineContent: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className='mb-3'>
                  <label className='form-label'>Contract ID (optional)</label>
                  <input
                    className='form-control'
                    value={errorForm.contractId}
                    onChange={(e) =>
                      setErrorForm((prev) => ({
                        ...prev,
                        contractId: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={() => setShowErrorModal(false)}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='btn btn-danger'
                  onClick={handleAddError}
                  disabled={!errorForm.errorDescription}
                >
                  Add Error Record
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD RESPONSE MODAL */}
      {showUploadModal && (
        <div
          className='modal fade show d-block'
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Upload CCR Response File</h5>
                <button
                  type='button'
                  className='btn-close'
                  onClick={() => setShowUploadModal(false)}
                ></button>
              </div>
              <div className='modal-body'>
                <input
                  type='file'
                  className='form-control'
                  onChange={(e) => setUploadFile(e.target.files[0])}
                  accept='.txt,.csv,.log'
                />
                {uploadFile && (
                  <div className='alert alert-info mt-2'>
                    <strong>Selected:</strong> {uploadFile.name} (
                    {(uploadFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-secondary'
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button
                  type='button'
                  className='btn btn-info'
                  onClick={handleFileUpload}
                  disabled={!uploadFile}
                >
                  Upload File
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatusManagementTab;
