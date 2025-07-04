// components/CCRModal.jsx - Fixed version with unique alert keys
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Code,
  Download,
  Eye,
  FileText,
  RefreshCw,
  Trash2,
  XCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  clearCCRTestData,
  downloadSubmissionFile,
  generateCCRSubmission,
  generateCCRTestSequence,
  getCCRHistory,
  getCCRPreview,
} from './ccrApi';

const CCRModal = ({ show, onHide, triggerButton }) => {
  const [activeTab, setActiveTab] = useState('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [sequenceFiles, setSequenceFiles] = useState([]); // Store test sequence files
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    referenceDate: '',
    testMode: true,
    forceDate: '',
  });

  // Use ref to ensure unique alert IDs
  const alertIdRef = useRef(0);

  // Custom toast/alert system with unique IDs
  const showAlert = (message, type = 'info') => {
    const id = ++alertIdRef.current; // Increment counter for unique ID
    const alert = { id, message, type };
    setAlerts((prev) => [...prev, alert]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 5000);
  };

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const getAlertClass = (type) => {
    switch (type) {
      case 'success':
        return 'alert alert-success';
      case 'error':
        return 'alert alert-danger';
      case 'warning':
        return 'alert alert-warning';
      default:
        return 'alert alert-info';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} />;
      case 'error':
        return <XCircle size={16} />;
      case 'warning':
        return <AlertCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  // Get default reference date (last month end)
  useEffect(() => {
    const today = new Date();
    const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
    setFormData((prev) => ({
      ...prev,
      referenceDate: lastMonthEnd.toISOString().split('T')[0],
    }));
  }, []);

  // Load submission history when modal opens
  useEffect(() => {
    if (show) {
      loadSubmissionHistory();
    }
  }, [show]);

  const loadSubmissionHistory = async () => {
    try {
      const data = await getCCRHistory({ showTest: true });
      setSubmissionHistory(data.submissions || []);
    } catch (error) {
      console.error('Failed to load submission history:', error);
      showAlert('Failed to load submission history', 'error');
    }
  };

  const loadPreview = async (date) => {
    setIsLoading(true);
    try {
      const testDate =
        formData.testMode && formData.forceDate ? formData.forceDate : date;
      const data = await getCCRPreview({ testDate });
      setPreviewData(data.preview);
    } catch (error) {
      showAlert('Error loading preview', 'error');
      console.error('Preview error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateSubmission = async () => {
    setIsLoading(true);
    try {
      const requestData = {
        testMode: formData.testMode,
      };

      if (formData.testMode && formData.forceDate) {
        requestData.forceDate = formData.forceDate;
      } else if (formData.referenceDate) {
        requestData.referenceDate = formData.referenceDate;
      }

      const result = await generateCCRSubmission(requestData);

      if (result.success) {
        // Download file
        const url = window.URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        showAlert(
          `CCR submission generated with ${result.recordCount} records`,
          'success'
        );

        // Refresh history
        loadSubmissionHistory();
      } else {
        showAlert(result.error || 'Failed to generate submission', 'error');
      }
    } catch (error) {
      showAlert('Error generating submission', 'error');
      console.error('Generation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearTestData = async () => {
    if (!confirm('Are you sure you want to clear all test submissions?')) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await clearCCRTestData();

      if (result.success) {
        showAlert(result.message, 'success');
        setSequenceFiles([]); // Clear any stored files
        loadSubmissionHistory();
      } else {
        showAlert('Failed to clear test data', 'error');
      }
    } catch (error) {
      showAlert('Error clearing test data', 'error');
      console.error('Clear error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTestSequence = async () => {
    setIsLoading(true);
    try {
      const result = await generateCCRTestSequence({
        startDate: formData.referenceDate,
        months: 3,
        returnFiles: true, // Request file contents
      });

      if (result.success) {
        showAlert(
          `Generated ${result.results.length} test submissions`,
          'success'
        );

        // Store the files for inspection
        if (result.files) {
          setSequenceFiles(result.files);
          showAlert(
            `Files available for inspection: ${result.files.length} files`,
            'info'
          );
        }

        loadSubmissionHistory();
      } else {
        showAlert(result.error || 'Failed to generate sequence', 'error');
      }
    } catch (error) {
      showAlert('Error generating test sequence', 'error');
      console.error('Sequence error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadSubmissionFile = async (submissionId) => {
    setIsLoading(true);
    try {
      const result = await downloadSubmissionFile(submissionId);

      if (result.success) {
        // Download the file
        const url = window.URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        // Show appropriate message based on source
        const message = result.isExisting
          ? `Downloaded existing file: ${result.filename}`
          : `File was regenerated: ${result.filename}`;

        showAlert(message, result.isExisting ? 'success' : 'warning');
      } else {
        showAlert(result.error || 'Error downloading file', 'error');
      }
    } catch (error) {
      showAlert('Error downloading file', 'error');
      console.error('Download error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewFile = (file) => {
    setSelectedFile(file);
    setShowFileModal(true);
  };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
      default:
        return 'badge bg-secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <>
      {/* Alert Container - Fixed position */}
      <div className='position-fixed top-0 end-0 p-3' style={{ zIndex: 1060 }}>
        {alerts.map((alert) => (
          <div
            key={`alert-${alert.id}`} // Ensure unique keys with prefix
            className={`${getAlertClass(
              alert.type
            )} alert-dismissible fade show`}
            role='alert'
          >
            <div className='d-flex align-items-center'>
              {getAlertIcon(alert.type)}
              <span className='ms-2'>{alert.message}</span>
            </div>
            <button
              type='button'
              className='btn-close'
              onClick={() => removeAlert(alert.id)}
              aria-label='Close'
            ></button>
          </div>
        ))}
      </div>

      {/* File Inspection Modal */}
      {showFileModal && selectedFile && (
        <div
          className='modal fade show d-block'
          style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1070 }}
        >
          <div className='modal-dialog modal-lg'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title d-flex align-items-center'>
                  <Code className='me-2' size={20} />
                  CCR File Content: {selectedFile.filename}
                </h5>
                <button
                  type='button'
                  className='btn-close'
                  onClick={() => setShowFileModal(false)}
                ></button>
              </div>
              <div className='modal-body'>
                <div className='d-flex justify-content-between align-items-center mb-3'>
                  <div>
                    <small className='text-muted'>
                      Size: {selectedFile.size} bytes | Month:{' '}
                      {selectedFile.month}
                    </small>
                  </div>
                  <button
                    className='btn btn-sm btn-primary'
                    onClick={() =>
                      downloadFile(selectedFile.filename, selectedFile.content)
                    }
                  >
                    <Download size={16} className='me-1' />
                    Download
                  </button>
                </div>
                <pre
                  className='bg-light p-3 border rounded'
                  style={{
                    maxHeight: '400px',
                    overflow: 'auto',
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {selectedFile.content}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Modal */}
      <div
        className={`modal fade ${show ? 'show d-block' : ''}`}
        tabIndex='-1'
        style={{ backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent' }}
      >
        <div className='modal-dialog modal-xl'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h5 className='modal-title d-flex align-items-center'>
                <FileText className='me-2' size={20} />
                Central Credit Register (CCR) Reporting
              </h5>
              <button
                type='button'
                className='btn-close'
                onClick={onHide}
                aria-label='Close'
              ></button>
            </div>

            <div className='modal-body'>
              {/* Navigation Tabs */}
              <ul className='nav nav-tabs mb-4' role='tablist'>
                <li className='nav-item' role='presentation'>
                  <button
                    className={`nav-link ${
                      activeTab === 'generate' ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab('generate')}
                    type='button'
                  >
                    Generate
                  </button>
                </li>
                <li className='nav-item' role='presentation'>
                  <button
                    className={`nav-link ${
                      activeTab === 'preview' ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab('preview')}
                    type='button'
                  >
                    Preview
                  </button>
                </li>
                <li className='nav-item' role='presentation'>
                  <button
                    className={`nav-link ${
                      activeTab === 'history' ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab('history')}
                    type='button'
                  >
                    History
                  </button>
                </li>
                <li className='nav-item' role='presentation'>
                  <button
                    className={`nav-link ${
                      activeTab === 'testing' ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab('testing')}
                    type='button'
                  >
                    Testing
                  </button>
                </li>
              </ul>

              {/* Tab Content */}
              <div className='tab-content'>
                {/* Generate Tab */}
                {activeTab === 'generate' && (
                  <div className='tab-pane show active'>
                    <div className='card'>
                      <div className='card-header'>
                        <h6 className='card-title mb-0'>
                          Generate CCR Submission
                        </h6>
                      </div>
                      <div className='card-body'>
                        <div className='row g-3'>
                          <div className='col-md-6'>
                            <label
                              htmlFor='referenceDate'
                              className='form-label'
                            >
                              Reference Date (Month End)
                            </label>
                            <input
                              id='referenceDate'
                              type='date'
                              className='form-control'
                              value={formData.referenceDate}
                              onChange={(e) =>
                                setFormData((prev) => ({
                                  ...prev,
                                  referenceDate: e.target.value,
                                }))
                              }
                            />
                          </div>

                          <div className='col-md-6'>
                            <div className='form-check mt-4'>
                              <input
                                className='form-check-input'
                                type='checkbox'
                                id='testMode'
                                checked={formData.testMode}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    testMode: e.target.checked,
                                  }))
                                }
                              />
                              <label
                                className='form-check-label'
                                htmlFor='testMode'
                              >
                                Test Mode
                              </label>
                            </div>
                            <small className='form-text text-muted'>
                              Allows multiple submissions for the same date
                            </small>
                          </div>
                        </div>

                        {formData.testMode && (
                          <div className='row g-3 mt-3'>
                            <div className='col-12'>
                              <label htmlFor='forceDate' className='form-label'>
                                Force Date (Override for Testing)
                              </label>
                              <input
                                id='forceDate'
                                type='date'
                                className='form-control'
                                value={formData.forceDate}
                                onChange={(e) =>
                                  setFormData((prev) => ({
                                    ...prev,
                                    forceDate: e.target.value,
                                  }))
                                }
                              />
                              <small className='form-text text-muted'>
                                Use this to test different dates without waiting
                              </small>
                            </div>
                          </div>
                        )}

                        <div className='d-flex gap-3 mt-4'>
                          <button
                            className='btn btn-primary d-flex align-items-center'
                            onClick={handleGenerateSubmission}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <div
                                  className='spinner-border spinner-border-sm me-2'
                                  role='status'
                                >
                                  <span className='visually-hidden'>
                                    Loading...
                                  </span>
                                </div>
                                Generating...
                              </>
                            ) : (
                              <>
                                <Download className='me-2' size={16} />
                                Generate & Download
                              </>
                            )}
                          </button>

                          <button
                            className='btn btn-outline-secondary d-flex align-items-center'
                            onClick={() =>
                              loadPreview(
                                formData.testMode && formData.forceDate
                                  ? formData.forceDate
                                  : formData.referenceDate
                              )
                            }
                            disabled={isLoading}
                          >
                            <Eye className='me-2' size={16} />
                            Preview First
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Preview Tab */}
                {activeTab === 'preview' && (
                  <div className='tab-pane show active'>
                    <div className='card'>
                      <div className='card-header d-flex justify-content-between align-items-center'>
                        <h6 className='card-title mb-0'>Submission Preview</h6>
                        <button
                          className='btn btn-sm btn-outline-primary'
                          onClick={() =>
                            loadPreview(
                              formData.testMode && formData.forceDate
                                ? formData.forceDate
                                : formData.referenceDate
                            )
                          }
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <div
                              className='spinner-border spinner-border-sm'
                              role='status'
                            ></div>
                          ) : (
                            <RefreshCw size={16} />
                          )}
                          Refresh
                        </button>
                      </div>
                      <div className='card-body'>
                        {previewData ? (
                          <>
                            <div className='row g-3 mb-4'>
                              <div className='col-md-3'>
                                <div className='card bg-light'>
                                  <div className='card-body text-center'>
                                    <h5 className='text-success'>
                                      {previewData.new_contracts.count}
                                    </h5>
                                    <small className='text-muted'>
                                      New Contracts
                                    </small>
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-3'>
                                <div className='card bg-light'>
                                  <div className='card-body text-center'>
                                    <h5 className='text-primary'>
                                      {previewData.active_contracts.count}
                                    </h5>
                                    <small className='text-muted'>
                                      Active Updates
                                    </small>
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-3'>
                                <div className='card bg-light'>
                                  <div className='card-body text-center'>
                                    <h5 className='text-warning'>
                                      {previewData.settled_contracts.count}
                                    </h5>
                                    <small className='text-muted'>
                                      Settlements
                                    </small>
                                  </div>
                                </div>
                              </div>
                              <div className='col-md-3'>
                                <div className='card bg-light'>
                                  <div className='card-body text-center'>
                                    <h5 className='text-dark'>
                                      {previewData.total_records}
                                    </h5>
                                    <small className='text-muted'>
                                      Total Records
                                    </small>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {previewData.new_contracts.details &&
                              previewData.new_contracts.details.length > 0 && (
                                <div className='mt-4'>
                                  <h6>Sample New Contracts:</h6>
                                  <div className='table-responsive'>
                                    <table className='table table-sm'>
                                      <thead>
                                        <tr>
                                          <th>Loan ID</th>
                                          <th>Applicant</th>
                                          <th>Amount</th>
                                          <th>Created</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {previewData.new_contracts.details.map(
                                          (contract, index) => (
                                            <tr
                                              key={`new-contract-${contract.loan_id}-${index}`}
                                            >
                                              <td>{contract.loan_id}</td>
                                              <td>{contract.applicant_name}</td>
                                              <td>
                                                €
                                                {contract.amount.toLocaleString()}
                                              </td>
                                              <td>
                                                {formatDate(
                                                  contract.created_at
                                                )}
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                          </>
                        ) : (
                          <div className='text-center py-4'>
                            <p className='text-muted'>
                              Click "Refresh" to load preview data
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                  <div className='tab-pane show active'>
                    <div className='card'>
                      <div className='card-header d-flex justify-content-between align-items-center'>
                        <h6 className='card-title mb-0'>Submission History</h6>
                        <button
                          className='btn btn-sm btn-outline-primary'
                          onClick={loadSubmissionHistory}
                          disabled={isLoading}
                        >
                          <RefreshCw size={16} />
                          Refresh
                        </button>
                      </div>
                      <div className='card-body'>
                        {submissionHistory.length > 0 ? (
                          <div className='table-responsive'>
                            <table className='table'>
                              <thead>
                                <tr>
                                  <th>Reference Date</th>
                                  <th>Records</th>
                                  <th>Breakdown</th>
                                  <th>Status</th>
                                  <th>Generated</th>
                                  <th>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {submissionHistory.map((submission) => (
                                  <tr key={`submission-${submission.id}`}>
                                    <td>
                                      {formatDate(submission.reference_date)}
                                    </td>
                                    <td>{submission.total_records}</td>
                                    <td>
                                      <small className='text-muted'>
                                        {submission.breakdown && (
                                          <>
                                            New: {submission.breakdown.new || 0}{' '}
                                            | Active:{' '}
                                            {submission.breakdown.updates || 0}{' '}
                                            | Settled:{' '}
                                            {submission.breakdown.settlements ||
                                              0}
                                          </>
                                        )}
                                      </small>
                                    </td>
                                    <td>
                                      <span
                                        className={getStatusBadgeClass(
                                          submission.status
                                        )}
                                      >
                                        {submission.status}
                                      </span>
                                      {submission.is_test && (
                                        <span className='badge bg-warning ms-2'>
                                          TEST
                                        </span>
                                      )}
                                    </td>
                                    <td>
                                      {formatDate(submission.generated_at)}
                                    </td>
                                    <td>
                                      <button
                                        className='btn btn-sm btn-outline-primary'
                                        onClick={() =>
                                          handleDownloadSubmissionFile(
                                            submission.id
                                          )
                                        }
                                        title='Download/Regenerate file'
                                      >
                                        <Download size={14} />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className='text-center py-4'>
                            <p className='text-muted'>No submissions found</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Testing Tab */}
                {activeTab === 'testing' && (
                  <div className='tab-pane show active'>
                    <div className='row g-3'>
                      <div className='col-md-6'>
                        <div className='card'>
                          <div className='card-header'>
                            <h6 className='card-title mb-0'>Test Sequence</h6>
                          </div>
                          <div className='card-body'>
                            <p className='card-text'>
                              Generate multiple monthly submissions for testing
                              CCR workflow.
                            </p>
                            <button
                              className='btn btn-warning'
                              onClick={handleGenerateTestSequence}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <div
                                    className='spinner-border spinner-border-sm me-2'
                                    role='status'
                                  ></div>
                                  Generating...
                                </>
                              ) : (
                                <>
                                  <Calendar className='me-2' size={16} />
                                  Generate 3 Month Sequence
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className='col-md-6'>
                        <div className='card'>
                          <div className='card-header'>
                            <h6 className='card-title mb-0'>Clear Test Data</h6>
                          </div>
                          <div className='card-body'>
                            <p className='card-text'>
                              Remove all test submissions to start fresh.
                            </p>
                            <button
                              className='btn btn-danger'
                              onClick={handleClearTestData}
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <>
                                  <div
                                    className='spinner-border spinner-border-sm me-2'
                                    role='status'
                                  ></div>
                                  Clearing...
                                </>
                              ) : (
                                <>
                                  <Trash2 className='me-2' size={16} />
                                  Clear Test Data
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Generated Test Files Section */}
                    {sequenceFiles.length > 0 && (
                      <div className='mt-4'>
                        <div className='card'>
                          <div className='card-header'>
                            <h6 className='card-title mb-0'>
                              Generated Test Files ({sequenceFiles.length})
                            </h6>
                          </div>
                          <div className='card-body'>
                            <div className='table-responsive'>
                              <table className='table table-sm'>
                                <thead>
                                  <tr>
                                    <th>Month</th>
                                    <th>Filename</th>
                                    <th>Size</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {sequenceFiles.map((file, index) => (
                                    <tr
                                      key={`sequence-file-${file.month}-${index}`}
                                    >
                                      <td>
                                        <span className='badge bg-primary'>
                                          Month {file.month}
                                        </span>
                                      </td>
                                      <td>
                                        <code>{file.filename}</code>
                                      </td>
                                      <td>
                                        <small className='text-muted'>
                                          {file.size} bytes
                                        </small>
                                      </td>
                                      <td>
                                        <div className='btn-group btn-group-sm'>
                                          <button
                                            className='btn btn-outline-primary'
                                            onClick={() => handleViewFile(file)}
                                            title='View file content'
                                          >
                                            <Eye size={14} />
                                          </button>
                                          <button
                                            className='btn btn-outline-secondary'
                                            onClick={() =>
                                              downloadFile(
                                                file.filename,
                                                file.content
                                              )
                                            }
                                            title='Download file'
                                          >
                                            <Download size={14} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className='mt-3'>
                              <small className='text-muted'>
                                📋{' '}
                                <strong>What to check in these files:</strong>
                                <br />
                                • Month 1: Should contain ID records
                                (onboarding) but no CI records
                                <br />
                                • Month 2: Should contain CI records for Month 1
                                loans + new ID records
                                <br />• Month 3: Should contain CI updates + any
                                settlements
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className='mt-4'>
                      <div className='alert alert-info'>
                        <h6 className='alert-heading d-flex align-items-center'>
                          <AlertCircle className='me-2' size={16} />
                          Testing Information
                        </h6>
                        <ul className='mb-0'>
                          <li>
                            <strong>Test Mode:</strong> Allows multiple
                            submissions for the same reference date
                          </li>
                          <li>
                            <strong>Force Date:</strong> Override the reference
                            date to test different scenarios
                          </li>
                          <li>
                            <strong>Test Sequence:</strong> Creates submissions
                            for 3 consecutive months with file inspection
                          </li>
                          <li>
                            <strong>File Inspection:</strong> View generated CCR
                            files to verify correct ID/CI timing
                          </li>
                          <li>
                            <strong>Download Files:</strong> Use the download
                            buttons in History tab to get any submission file
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='modal-footer'>
              <button
                type='button'
                className='btn btn-secondary'
                onClick={onHide}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CCRModal;
