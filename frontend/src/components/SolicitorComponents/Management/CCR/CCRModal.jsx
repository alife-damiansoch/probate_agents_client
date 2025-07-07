// components/CCRModal.jsx - Refactored main component with Status Management
import { FileText } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  addErrorRecord,
  clearCCRTestData,
  downloadSubmissionFile,
  generateCCRSubmission,
  generateCCRTestSequence,
  getCCRHistoryEnhanced,
  getCCRPreview,
  getSubmissionDetails,
  resolveErrorRecord,
  updateSubmissionStatus,
  uploadCCRResponse,
} from './ccrApi';

// Import child components
import AlertContainer from './CCRModalParts/AlertContainer';
import FileInspectionModal from './CCRModalParts/FileInspectionModal';
import GenerateTab from './CCRModalParts/GenerateTab';
import HistoryTab from './CCRModalParts/HistoryTab';
import PreviewTab from './CCRModalParts/PreviewTab';
import StatusManagementTab from './CCRModalParts/StatusManagementTab';
import TestingTab from './CCRModalParts/TestingTab';

const CCRModal = ({ show, onHide, triggerButton }) => {
  const [activeTab, setActiveTab] = useState('generate');
  const [isLoading, setIsLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [submissionHistory, setSubmissionHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [sequenceFiles, setSequenceFiles] = useState([]);
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
    const id = ++alertIdRef.current;
    const alert = { id, message, type };
    setAlerts((prev) => [...prev, alert]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, 5000);
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
      const data = await getCCRHistoryEnhanced({ showTest: true });
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
        setSequenceFiles([]);
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
        returnFiles: true,
      });

      if (result.success) {
        showAlert(
          `Generated ${result.results.length} test submissions`,
          'success'
        );

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
        const url = window.URL.createObjectURL(result.blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = result.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

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

  const removeAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
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

  return (
    <>
      <AlertContainer alerts={alerts} removeAlert={removeAlert} />

      <FileInspectionModal
        show={showFileModal}
        onHide={() => setShowFileModal(false)}
        selectedFile={selectedFile}
      />

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
                      activeTab === 'status' ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab('status')}
                    type='button'
                  >
                    Status Management
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
                {activeTab === 'generate' && (
                  <GenerateTab
                    formData={formData}
                    setFormData={setFormData}
                    isLoading={isLoading}
                    onGenerateSubmission={handleGenerateSubmission}
                    onLoadPreview={loadPreview}
                  />
                )}

                {activeTab === 'preview' && (
                  <PreviewTab
                    previewData={previewData}
                    isLoading={isLoading}
                    onLoadPreview={loadPreview}
                    formData={formData}
                    formatDate={formatDate}
                  />
                )}

                {activeTab === 'history' && (
                  <HistoryTab
                    submissionHistory={submissionHistory}
                    isLoading={isLoading}
                    onRefresh={loadSubmissionHistory}
                    onDownloadFile={handleDownloadSubmissionFile}
                    formatDate={formatDate}
                    getStatusBadgeClass={getStatusBadgeClass}
                  />
                )}

                {activeTab === 'status' && (
                  <StatusManagementTab
                    submissionHistory={submissionHistory}
                    onRefresh={loadSubmissionHistory}
                    getSubmissionDetails={getSubmissionDetails}
                    updateSubmissionStatus={updateSubmissionStatus}
                    addErrorRecord={addErrorRecord}
                    resolveErrorRecord={resolveErrorRecord}
                    uploadCCRResponse={uploadCCRResponse}
                    showAlert={showAlert}
                    isLoading={isLoading}
                  />
                )}

                {activeTab === 'testing' && (
                  <TestingTab
                    isLoading={isLoading}
                    sequenceFiles={sequenceFiles}
                    onGenerateTestSequence={handleGenerateTestSequence}
                    onClearTestData={handleClearTestData}
                    onViewFile={handleViewFile}
                  />
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
