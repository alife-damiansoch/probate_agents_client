import {
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Eye,
  FileText,
  Loader2,
  Mail,
  Paperclip,
  Plus,
  Send,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  deleteData,
  downloadFileAxios,
  fetchData,
  postData,
} from '../../../GenericFunctions/AxiosGenericFunctions';

const EmailCommunicationsComponent = ({
  applicationId = 123,
  token,
  application,
}) => {
  const [emails, setEmails] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailsLoading, setEmailsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Custom CSS styles
  const styles = {
    container: {
      minHeight: '100vh',
      background:
        'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
      padding: '2rem',
    },
    card: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: '1rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(4px)',
      zIndex: 1050,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      backgroundColor: 'rgba(15, 23, 42, 0.95)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(148, 163, 184, 0.3)',
      borderRadius: '1rem',
      maxHeight: '90vh',
      overflow: 'auto',
    },
    gradientText: {
      background:
        'linear-gradient(90deg, #60a5fa 0%, #a855f7 50%, #ec4899 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text',
    },
    button: {
      background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
      border: 'none',
      borderRadius: '0.75rem',
      color: 'white',
      padding: '0.75rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    input: {
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid #374151',
      borderRadius: '0.75rem',
      color: 'white',
      padding: '0.75rem 1rem',
    },
    table: {
      backgroundColor: 'transparent',
      color: 'white',
    },
    statusBadge: {
      padding: '0.25rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
      border: '1px solid',
    },
  };

  // Helper function to extract body content from full HTML document
  const extractBodyContent = (htmlContent) => {
    if (!htmlContent) return 'No message content';

    // Try to extract just the body content
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch && bodyMatch[1]) {
      return bodyMatch[1].trim();
    }

    // If no body tag, check if it's already clean HTML (no DOCTYPE, html, head tags)
    if (
      !htmlContent.includes('<!DOCTYPE') &&
      !htmlContent.includes('<html') &&
      !htmlContent.includes('<head')
    ) {
      return htmlContent;
    }

    // Fallback - return the content as-is
    return htmlContent;
  };

  // Fetch emails for application
  const fetchEmails = async () => {
    try {
      setEmailsLoading(true);
      setError(null);
      const response = await fetchData(
        token,
        `api/applications/${applicationId}/emails/`
      );

      if (response && response.status >= 200 && response.status < 300) {
        setEmails(response.data);
      } else if (response && response.status === 0) {
        setError(response.data);
      } else {
        setError('Failed to fetch emails');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setEmailsLoading(false);
    }
  };

  // Fetch available templates
  const fetchTemplates = async () => {
    try {
      const response = await fetchData(token, 'api/email-templates/');
      if (response && response.status >= 200 && response.status < 300) {
        setTemplates(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch templates:', err);
    }
  };

  // Fetch available documents for the application
  const fetchDocuments = async () => {
    try {
      const response = await fetchData(
        token,
        `api/applications/agent_applications/document_file/${applicationId}/`
      );
      if (response && response.status >= 200 && response.status < 300) {
        setDocuments(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err);
    }
  };

  // Fetch email details
  const fetchEmailDetails = async (emailId) => {
    try {
      setLoading(true);
      const response = await fetchData(token, `api/emails/${emailId}/`);

      if (response && response.status >= 200 && response.status < 300) {
        setSelectedEmail(response.data);
      } else {
        setError('Failed to fetch email details');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create new email
  const createEmail = async (formData) => {
    try {
      setLoading(true);
      const response = await postData(
        token,
        `api/applications/${applicationId}/emails/`,
        formData
      );

      if (response && response.status >= 200 && response.status < 300) {
        setEmails([response.data, ...emails]);
        setShowCreateModal(false);
        return response.data;
      } else {
        const errorMessage = response?.data?.detail || 'Failed to create email';
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Send email
  const sendEmail = async (emailId) => {
    try {
      setLoading(true);
      const response = await postData(token, `api/emails/${emailId}/send/`, {
        send_immediately: true,
      });

      if (response && response.status >= 200 && response.status < 300) {
        await fetchEmails();
        if (selectedEmail && selectedEmail.id === emailId) {
          await fetchEmailDetails(emailId);
        }
      } else {
        const errorMessage = response?.data?.detail || 'Failed to send email';
        setError(errorMessage);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete email
  const deleteEmail = async (emailId) => {
    try {
      setLoading(true);
      const response = await deleteData(`api/emails/${emailId}/`);

      if (response && response.status >= 200 && response.status < 300) {
        setEmails(emails.filter((email) => email.id !== emailId));
        if (selectedEmail && selectedEmail.id === emailId) {
          setShowDetailModal(false);
          setSelectedEmail(null);
        }
      } else {
        const errorMessage = response?.data?.detail || 'Failed to delete email';
        setError(errorMessage);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Download document
  const downloadDocument = async (documentId, filename) => {
    try {
      const response = await downloadFileAxios(
        token,
        `api/email-documents/${documentId}/download/`
      );

      if (response && response.status >= 200 && response.status < 300) {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } else {
        setError('Failed to download document');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEmails();
      fetchTemplates();
      fetchDocuments();
    }
  }, [applicationId, token]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <CheckCircle size={16} style={{ color: '#10b981' }} />;
      case 'draft':
        return <Clock size={16} style={{ color: '#f59e0b' }} />;
      case 'failed':
        return <XCircle size={16} style={{ color: '#ef4444' }} />;
      default:
        return <AlertCircle size={16} style={{ color: '#3b82f6' }} />;
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'sent':
        return {
          ...styles.statusBadge,
          backgroundColor: 'rgba(16, 185, 129, 0.2)',
          color: '#a7f3d0',
          borderColor: 'rgba(16, 185, 129, 0.3)',
        };
      case 'draft':
        return {
          ...styles.statusBadge,
          backgroundColor: 'rgba(245, 158, 11, 0.2)',
          color: '#fde68a',
          borderColor: 'rgba(245, 158, 11, 0.3)',
        };
      case 'failed':
        return {
          ...styles.statusBadge,
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          color: '#fca5a5',
          borderColor: 'rgba(239, 68, 68, 0.3)',
        };
      default:
        return {
          ...styles.statusBadge,
          backgroundColor: 'rgba(59, 130, 246, 0.2)',
          color: '#93c5fd',
          borderColor: 'rgba(59, 130, 246, 0.3)',
        };
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const CreateEmailModal = () => {
    const [formData, setFormData] = useState({
      recipient_email: application?.applicants?.[0]?.email || '',
      recipient_name: application?.applicants?.[0]
        ? `${application.applicants[0].title || ''} ${
            application.applicants[0].full_name || ''
          }`.trim()
        : '',
      subject: 'Your application documents',
      message: '',
      email_template: '',
      document_ids: [],
    });
    const [createLoading, setCreateLoading] = useState(false);

    const isTemplateSelected = formData.email_template !== '';

    const handleTemplateChange = (templateValue) => {
      setFormData({
        ...formData,
        email_template: templateValue,
        subject: 'Your application documents',
        message: templateValue ? '' : formData.message,
      });
    };

    const handleSubmit = async () => {
      try {
        setCreateLoading(true);
        await createEmail(formData);
        setFormData({
          recipient_email: application?.applicants?.[0]?.email || '',
          recipient_name: application?.applicants?.[0]
            ? `${application.applicants[0].title || ''} ${
                application.applicants[0].full_name || ''
              }`.trim()
            : '',
          subject: 'Your application documents',
          message: '',
          email_template: '',
          document_ids: [],
        });
      } catch (err) {
        // Error is handled in createEmail
      } finally {
        setCreateLoading(false);
      }
    };

    return (
      <div style={styles.modal}>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-8'>
              <div style={styles.modalContent} className='p-4'>
                <div className='d-flex justify-content-between align-items-center mb-4'>
                  <h2 style={styles.gradientText} className='mb-0 fw-bold'>
                    Create Email Communication
                  </h2>
                  <button
                    className='btn btn-link text-secondary p-0'
                    onClick={() => setShowCreateModal(false)}
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                <div className='row g-3'>
                  <div className='col-md-6'>
                    <label className='form-label text-light'>
                      Recipient Email
                    </label>
                    <input
                      type='email'
                      className='form-control'
                      style={styles.input}
                      value={formData.recipient_email}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className='col-md-6'>
                    <label className='form-label text-light'>
                      Recipient Name
                    </label>
                    <input
                      type='text'
                      className='form-control'
                      style={styles.input}
                      value={formData.recipient_name}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className='col-12'>
                    <label className='form-label text-light'>
                      Email Template
                    </label>
                    <select
                      className='form-select'
                      style={styles.input}
                      value={formData.email_template}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                    >
                      <option value=''>Select a template (required)</option>
                      {templates.map((template) => (
                        <option key={template.name} value={template.name}>
                          {template.display_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className='col-12'>
                    <label className='form-label text-light'>Subject</label>
                    <input
                      type='text'
                      className='form-control'
                      style={styles.input}
                      value={formData.subject}
                      readOnly
                      disabled
                    />
                  </div>
                  <div className='col-12'>
                    <label className='form-label text-light'>Message</label>
                    <textarea
                      className='form-control'
                      style={{ ...styles.input, resize: 'none' }}
                      rows={4}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder={
                        isTemplateSelected
                          ? 'Will be auto-generated from template'
                          : 'Enter your email message...'
                      }
                      disabled={isTemplateSelected}
                      required={!isTemplateSelected}
                    />
                  </div>

                  {documents.length > 0 && (
                    <div className='col-12'>
                      <label className='form-label text-light'>
                        Attach Documents
                      </label>
                      <div className='row g-2'>
                        {documents.map((doc) => (
                          <div key={doc.id} className='col-md-6'>
                            <div
                              className='p-3 border rounded'
                              style={{
                                backgroundColor: 'rgba(30, 41, 59, 0.3)',
                                borderColor: '#374151',
                                cursor: 'pointer',
                              }}
                              onClick={() => {
                                if (formData.document_ids.includes(doc.id)) {
                                  setFormData({
                                    ...formData,
                                    document_ids: formData.document_ids.filter(
                                      (id) => id !== doc.id
                                    ),
                                  });
                                } else {
                                  setFormData({
                                    ...formData,
                                    document_ids: [
                                      ...formData.document_ids,
                                      doc.id,
                                    ],
                                  });
                                }
                              }}
                            >
                              <div className='d-flex align-items-center'>
                                <input
                                  type='checkbox'
                                  className='form-check-input me-3'
                                  checked={formData.document_ids.includes(
                                    doc.id
                                  )}
                                  onChange={() => {}}
                                />
                                <div className='flex-grow-1'>
                                  <div className='text-white small'>
                                    {doc.original_name}
                                  </div>
                                  {doc.file_size && (
                                    <div
                                      className='text-muted'
                                      style={{ fontSize: '0.75rem' }}
                                    >
                                      {formatFileSize(doc.file_size)}
                                    </div>
                                  )}
                                </div>
                                <FileText
                                  size={16}
                                  className='text-muted ms-2'
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className='col-12'>
                      <div
                        className='alert alert-danger'
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          borderColor: 'rgba(239, 68, 68, 0.2)',
                          color: '#fca5a5',
                        }}
                      >
                        {error}
                      </div>
                    </div>
                  )}

                  <div className='col-12 pt-3'>
                    <div className='d-flex gap-3'>
                      <button
                        className='btn btn-secondary flex-fill'
                        onClick={() => setShowCreateModal(false)}
                        disabled={createLoading}
                      >
                        Cancel
                      </button>
                      <button
                        style={styles.button}
                        className='flex-fill'
                        onClick={handleSubmit}
                        disabled={
                          createLoading ||
                          !formData.email_template ||
                          (!isTemplateSelected && !formData.message)
                        }
                      >
                        {createLoading && (
                          <Loader2
                            size={16}
                            className='spinner-border spinner-border-sm'
                          />
                        )}
                        {createLoading ? 'Creating...' : 'Create Email'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EmailDetailModal = () => {
    if (!selectedEmail) return null;

    return (
      <div style={styles.modal}>
        <div className='container'>
          <div className='row justify-content-center'>
            <div className='col-lg-10'>
              <div style={styles.modalContent} className='p-4'>
                <div className='d-flex justify-content-between align-items-center mb-4'>
                  <div className='d-flex align-items-center'>
                    <Mail size={24} className='text-primary me-3' />
                    <h2 className='text-white mb-0'>Email Details</h2>
                  </div>
                  <button
                    className='btn btn-link text-secondary p-0'
                    onClick={() => setShowDetailModal(false)}
                  >
                    <XCircle size={24} />
                  </button>
                </div>

                <div className='row g-4'>
                  <div className='col-12'>
                    <div
                      className='d-flex justify-content-between align-items-center p-3 border rounded'
                      style={{
                        backgroundColor: 'rgba(30, 41, 59, 0.3)',
                        borderColor: '#374151',
                      }}
                    >
                      <div className='d-flex align-items-center'>
                        {getStatusIcon(selectedEmail.status)}
                        <span
                          style={getStatusBadgeStyle(selectedEmail.status)}
                          className='ms-3'
                        >
                          {selectedEmail.status.toUpperCase()}
                        </span>
                      </div>
                      <div className='d-flex gap-2'>
                        {selectedEmail.status === 'draft' && (
                          <>
                            <button
                              style={{
                                ...styles.button,
                                background:
                                  'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                              }}
                              onClick={() => sendEmail(selectedEmail.id)}
                              disabled={loading}
                            >
                              {loading ? (
                                <Loader2
                                  size={16}
                                  className='spinner-border spinner-border-sm'
                                />
                              ) : (
                                <Send size={16} />
                              )}
                              {loading ? 'Sending...' : 'Send Email'}
                            </button>
                            <button
                              className='btn btn-danger'
                              onClick={() => {
                                if (
                                  window.confirm(
                                    'Are you sure you want to delete this email?'
                                  )
                                ) {
                                  deleteEmail(selectedEmail.id);
                                }
                              }}
                              disabled={loading}
                            >
                              <Trash2 size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='col-md-6'>
                    <div className='mb-3'>
                      <label className='form-label text-muted small'>
                        Recipient
                      </label>
                      <div className='text-white'>
                        {selectedEmail.recipient_name ||
                          selectedEmail.recipient_email}
                      </div>
                      <div className='text-muted small'>
                        {selectedEmail.recipient_email}
                      </div>
                    </div>
                    <div className='mb-3'>
                      <label className='form-label text-muted small'>
                        Subject
                      </label>
                      <div className='text-white'>{selectedEmail.subject}</div>
                    </div>
                  </div>

                  <div className='col-md-6'>
                    <div className='mb-3'>
                      <label className='form-label text-muted small'>
                        Created
                      </label>
                      <div className='text-white'>
                        {formatDate(selectedEmail.created_at)}
                      </div>
                    </div>
                    {selectedEmail.sent_at && (
                      <div className='mb-3'>
                        <label className='form-label text-muted small'>
                          Sent
                        </label>
                        <div className='text-white'>
                          {formatDate(selectedEmail.sent_at)}
                        </div>
                      </div>
                    )}
                    {selectedEmail.sent_by_name && (
                      <div className='mb-3'>
                        <label className='form-label text-muted small'>
                          Sent by
                        </label>
                        <div className='text-white'>
                          {selectedEmail.sent_by_name}
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedEmail.message && (
                    <div className='col-12'>
                      <label className='form-label text-muted small'>
                        Message Preview
                      </label>
                      <div
                        className='p-3 border rounded'
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          borderColor: '#374151',
                          maxHeight: '400px',
                          overflowY: 'auto',
                          color: '#333',
                        }}
                        dangerouslySetInnerHTML={{
                          __html: extractBodyContent(selectedEmail.message),
                        }}
                      />
                    </div>
                  )}

                  {selectedEmail.email_documents &&
                    selectedEmail.email_documents.length > 0 && (
                      <div className='col-12'>
                        <label className='form-label text-muted small'>
                          Attachments ({selectedEmail.email_documents.length})
                        </label>
                        <div className='row g-2'>
                          {selectedEmail.email_documents.map((doc) => (
                            <div key={doc.id} className='col-md-6'>
                              <div
                                className='d-flex justify-content-between align-items-center p-3 border rounded'
                                style={{
                                  backgroundColor: 'rgba(30, 41, 59, 0.3)',
                                  borderColor: '#374151',
                                }}
                              >
                                <div className='d-flex align-items-center'>
                                  <FileText
                                    size={20}
                                    className='text-primary me-3'
                                  />
                                  <div>
                                    <div className='text-white small'>
                                      {doc.original_name}
                                    </div>
                                    {doc.file_size && (
                                      <div
                                        className='text-muted'
                                        style={{ fontSize: '0.75rem' }}
                                      >
                                        {formatFileSize(doc.file_size)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <button
                                  className='btn btn-link text-secondary p-2'
                                  onClick={() =>
                                    downloadDocument(doc.id, doc.original_name)
                                  }
                                >
                                  <Download size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {error && (
                    <div className='col-12'>
                      <div
                        className='alert alert-danger'
                        style={{
                          backgroundColor: 'rgba(239, 68, 68, 0.1)',
                          borderColor: 'rgba(239, 68, 68, 0.2)',
                          color: '#fca5a5',
                        }}
                      >
                        {error}
                      </div>
                    </div>
                  )}

                  <div className='col-12 pt-3'>
                    <button
                      className='btn btn-secondary w-100'
                      onClick={() => setShowDetailModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!token) {
    return (
      <div
        style={styles.container}
        className='d-flex align-items-center justify-content-center'
      >
        <div style={styles.card} className='p-4 text-center'>
          <AlertCircle
            size={48}
            style={{ color: '#f59e0b' }}
            className='mb-3'
          />
          <h2 style={{ color: '#f59e0b' }} className='mb-2'>
            Authentication Required
          </h2>
          <p style={{ color: '#fde68a' }}>
            Please provide a valid token to access email communications.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={styles.container}
        className='d-flex align-items-center justify-content-center'
      >
        <div
          style={{ ...styles.card, borderColor: 'rgba(239, 68, 68, 0.2)' }}
          className='p-4 text-center'
        >
          <XCircle size={48} style={{ color: '#ef4444' }} className='mb-3' />
          <h2 style={{ color: '#ef4444' }} className='mb-2'>
            Error
          </h2>
          <p style={{ color: '#fca5a5' }} className='mb-3'>
            {error}
          </p>
          <button
            className='btn btn-danger'
            onClick={() => {
              setError(null);
              fetchEmails();
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div className='container-fluid'>
        {/* Header */}
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <div>
            <h1 style={styles.gradientText} className='display-4 fw-bold mb-2'>
              Direct Applicant Email send only
            </h1>
            <p className='text-muted'>
              Manage document emails for Application #{applicationId}
            </p>
          </div>
          <button
            style={styles.button}
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={20} />
            Create Email
          </button>
        </div>

        {/* Stats Cards */}
        <div className='row g-4 mb-4'>
          {[
            {
              label: 'Total Emails',
              value: emails.length,
              icon: Mail,
              color: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
            },
            {
              label: 'Sent',
              value: emails.filter((e) => e.status === 'sent').length,
              icon: CheckCircle,
              color: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
            },
            {
              label: 'Drafts',
              value: emails.filter((e) => e.status === 'draft').length,
              icon: Clock,
              color: 'linear-gradient(90deg, #f59e0b 0%, #d97706 100%)',
            },
            {
              label: 'Failed',
              value: emails.filter((e) => e.status === 'failed').length,
              icon: XCircle,
              color: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
            },
          ].map((stat, index) => (
            <div key={index} className='col-lg-3 col-md-6'>
              <div style={styles.card} className='p-4 h-100'>
                <div className='d-flex justify-content-between align-items-center'>
                  <div>
                    <p className='text-muted small mb-1'>{stat.label}</p>
                    <h3 className='text-white fw-bold mb-0'>{stat.value}</h3>
                  </div>
                  <div
                    className='p-3 rounded'
                    style={{ background: stat.color, opacity: 0.2 }}
                  >
                    <stat.icon size={24} className='text-white' />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Email List */}
        <div style={styles.card}>
          <div
            className='p-4 border-bottom'
            style={{ borderColor: 'rgba(148, 163, 184, 0.2)' }}
          >
            <h3 className='text-white mb-0 d-flex align-items-center'>
              <Users size={20} className='text-primary me-2' />
              Email Communications
            </h3>
          </div>

          {emailsLoading ? (
            <div className='p-5 text-center'>
              <Loader2 size={32} className='text-primary mb-3 spinner-border' />
              <p className='text-muted'>Loading emails...</p>
            </div>
          ) : emails.length === 0 ? (
            <div className='p-5 text-center'>
              <Mail size={48} className='text-muted mb-3' />
              <p className='text-muted'>No emails found for this application</p>
              <p className='text-muted small'>
                Create your first email to get started
              </p>
            </div>
          ) : (
            <div className='table-responsive'>
              <table
                className='table table-dark table-hover'
                style={styles.table}
              >
                <thead>
                  <tr style={{ backgroundColor: 'rgba(71, 85, 105, 0.3)' }}>
                    <th className='text-muted'>Recipient</th>
                    <th className='text-muted'>Subject</th>
                    <th className='text-muted'>Status</th>
                    <th className='text-muted'>Documents</th>
                    <th className='text-muted'>Created</th>
                    <th className='text-muted'>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {emails.map((email) => (
                    <tr
                      key={email.id}
                      style={{ borderColor: 'rgba(148, 163, 184, 0.1)' }}
                    >
                      <td>
                        <div>
                          <div className='text-white fw-medium'>
                            {email.recipient_name || email.recipient_email}
                          </div>
                          <div className='text-muted small'>
                            {email.recipient_email}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div
                          className='text-white'
                          style={{
                            maxWidth: '300px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {email.subject}
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center'>
                          {getStatusIcon(email.status)}
                          <span
                            style={getStatusBadgeStyle(email.status)}
                            className='ms-2'
                          >
                            {email.status.toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className='d-flex align-items-center text-muted'>
                          <Paperclip size={16} className='me-1' />
                          <span>{email.document_count || 0}</span>
                        </div>
                      </td>
                      <td className='text-muted'>
                        {formatDate(email.created_at)}
                      </td>
                      <td>
                        <div className='d-flex gap-2'>
                          <button
                            className='btn btn-link text-muted p-1'
                            onClick={() => {
                              setSelectedEmail(email);
                              setShowDetailModal(true);
                              fetchEmailDetails(email.id);
                            }}
                            title='View Details'
                          >
                            <Eye size={16} />
                          </button>
                          {email.status === 'draft' && (
                            <>
                              <button
                                className='btn btn-link text-success p-1'
                                onClick={() => sendEmail(email.id)}
                                disabled={loading}
                                title='Send Email'
                              >
                                <Send size={16} />
                              </button>
                              <button
                                className='btn btn-link text-danger p-1'
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      'Are you sure you want to delete this email?'
                                    )
                                  ) {
                                    deleteEmail(email.id);
                                  }
                                }}
                                disabled={loading}
                                title='Delete Email'
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && <CreateEmailModal />}
      {showDetailModal && <EmailDetailModal />}
    </div>
  );
};

export default EmailCommunicationsComponent;
