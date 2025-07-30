import { useState } from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import { API_URL } from '../../../../../baseUrls';
import { uploadFile } from '../../../../GenericFunctions/AxiosGenericFunctions';

const RequirementUploadModal = ({
  requirement,
  applicationId,
  onClose,
  onUploadComplete,
}) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  // Only one file, validate extension
  const handleFileChange = (e) => {
    setError('');
    if (!e.target.files.length) return;
    const f = e.target.files[0];
    const ext = f.name.split('.').pop().toLowerCase();
    const valid = [
      'jpeg',
      'jpg',
      'png',
      'gif',
      'bmp',
      'webp',
      'pdf',
      'doc',
      'docx',
      'xls',
      'xlsx',
      'ppt',
      'pptx',
      'txt',
      'rtf',
      'odt',
      'ods',
      'odp',
    ];
    if (!valid.includes(ext)) {
      setError('Invalid file type.');
      setFile(null);
      return;
    }
    setFile(f);
  };

  function buildCustomFilename(templateFilename, applicationId, realFile) {
    if (!templateFilename || !applicationId || !realFile) return realFile.name;
    let base = templateFilename.replace(/\.[^/.]+$/, '');
    let ext = realFile.name.split('.').pop();
    return `${base}_${applicationId}.${ext}`;
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }
    setUploading(true);
    setError('');
    setStatus('');

    const newFilename = buildCustomFilename(
      requirement.template_filename,
      applicationId,
      file
    );

    const fileData = await file.arrayBuffer();
    const renamedFile = new File([fileData], newFilename, { type: file.type });

    const formData = new FormData();
    formData.append('document', renamedFile, renamedFile.name);
    formData.append('document_type_requirement', requirement.id);

    try {
      const resp = await uploadFile(
        `${API_URL}/api/applications/solicitor_applications/document_file/${applicationId}/`,
        formData
      );
      if (resp.status === 201) {
        setStatus('Upload successful.');
        setTimeout(() => {
          onUploadComplete();
          onClose();
        }, 1000);
      } else {
        setError('Upload failed.');
      }
    } catch (err) {
      setError('Upload failed.');
    }
    setUploading(false);
  };

  return (
    <div
      className='modal show d-block'
      tabIndex={-1}
      style={{ background: 'rgba(0,0,0,0.3)', zIndex: 1050 }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !uploading) onClose();
      }}
    >
      <div className='modal-dialog modal-dialog-centered'>
        <div
          className='modal-content'
          style={{
            borderRadius: 18,
            border: '1px solid #f1c56a',
            boxShadow: '0 12px 36px rgba(0,0,0,0.10)',
            background: '#fffdfa',
            minWidth: 370,
            maxWidth: 500,
            margin: 'auto',
          }}
        >
          <div
            className='modal-header'
            style={{
              borderBottom: 'none',
              padding: '24px 28px 16px 28px',
              background: 'linear-gradient(90deg, #fef9c3 0%, #fdf6b2 100%)',
              borderTopLeftRadius: 18,
              borderTopRightRadius: 18,
            }}
          >
            <h5
              className='modal-title fw-semibold'
              style={{
                color: '#845900',
                fontSize: '1.28rem',
                letterSpacing: 0.1,
              }}
            >
              Upload Required Document
            </h5>
            <button
              type='button'
              className='btn-close'
              onClick={onClose}
              disabled={uploading}
              style={{ filter: 'invert(0.5)', opacity: 0.8 }}
            />
          </div>
          <div
            className='modal-body'
            style={{ padding: '24px 28px 12px 28px', background: '#fffdfa' }}
          >
            {/* Professional Warning Block */}
            <div
              className='mb-4 d-flex align-items-start'
              style={{
                background: 'linear-gradient(90deg, #fef9c3 0%, #fdf6b2 100%)',
                border: '1.5px solid #fde68a',
                borderRadius: 12,
                padding: '16px 18px',
                color: '#845900',
                boxShadow: '0 2px 12px 0 rgba(251,191,36,0.09)',
                fontSize: '1rem',
                fontWeight: 500,
              }}
            >
              <FaExclamationTriangle
                size={22}
                className='me-3'
                style={{ flexShrink: 0, marginTop: 2, color: '#f59e0b' }}
              />
              <div>
                <div>
                  <strong>Not Preferred Method:</strong> Documents should be
                  uploaded by the solicitor via their portal.
                  <br />
                  <span style={{ fontWeight: 400 }}>
                    <u>
                      Use this only if a wet-signed copy was received and cannot
                      be uploaded by the solicitor.
                    </u>
                  </span>
                </div>
              </div>
            </div>

            {/* Main Document Name Display */}
            <div
              className='mb-3 px-3 py-2'
              style={{
                background: '#f6f8fa',
                border: '1px solid #f1c56a',
                borderRadius: 10,
                fontWeight: 500,
                color: '#7c5e00',
                fontSize: '1.08rem',
                marginBottom: 24,
              }}
            >
              <span style={{ color: '#845900' }}>Required:</span>{' '}
              {requirement?.document_type?.name ||
                requirement?.template_filename}
            </div>

            {/* File Input */}
            <div className='mb-3'>
              <label
                className='form-label'
                style={{
                  fontWeight: 600,
                  color: '#0e1726',
                  fontSize: '1.04rem',
                }}
              >
                Select file to upload <span className='text-danger'>*</span>
              </label>
              <input
                type='file'
                className='form-control'
                onChange={handleFileChange}
                accept='.jpeg,.jpg,.png,.gif,.bmp,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt,.ods,.odp'
                disabled={uploading}
                style={{
                  borderRadius: 10,
                  fontSize: '1rem',
                  padding: '9px 14px',
                  background: '#fffefa',
                  border: '1.5px solid #f1c56a',
                }}
              />
              <div className='mt-1 mb-2'>
                <small className='text-muted'>
                  Accepted types: PDF, Word, Excel, Images, etc.
                </small>
              </div>
            </div>
            {/* Final File Name Preview */}
            {file && (
              <div
                className='mb-3 px-2 py-1'
                style={{
                  background: '#e0f2fe',
                  borderRadius: 7,
                  fontSize: '0.98rem',
                  color: '#0ea5e9',
                  fontFamily: 'monospace',
                  border: '1px solid #bae6fd',
                  wordBreak: 'break-all',
                }}
              >
                <strong>Will be uploaded as: </strong>
                {buildCustomFilename(
                  requirement.template_filename,
                  applicationId,
                  file
                )}
              </div>
            )}
            {/* Error & Success Alerts */}
            {error && (
              <div
                className='alert alert-danger py-2 mt-2 mb-0'
                style={{
                  fontSize: '0.98rem',
                  borderRadius: 8,
                  background: '#fef2f2',
                  color: '#b91c1c',
                  border: '1.2px solid #fca5a5',
                }}
              >
                {error}
              </div>
            )}
            {status && (
              <div
                className='alert alert-success py-2 mt-2 mb-0'
                style={{
                  fontSize: '0.98rem',
                  borderRadius: 8,
                  background: '#f0fdf4',
                  color: '#15803d',
                  border: '1.2px solid #bbf7d0',
                }}
              >
                {status}
              </div>
            )}
          </div>
          <div
            className='modal-footer'
            style={{
              borderTop: 'none',
              background: '#fffdfa',
              padding: '18px 28px 28px 28px',
              borderBottomLeftRadius: 18,
              borderBottomRightRadius: 18,
            }}
          >
            <button
              className='btn btn-outline-secondary'
              onClick={onClose}
              disabled={uploading}
              style={{
                borderRadius: 8,
                padding: '8px 30px',
                fontWeight: 500,
                fontSize: '1.02rem',
                border: '1.4px solid #fde68a',
                color: '#665200',
                background: '#fffcf2',
              }}
            >
              Cancel
            </button>
            <button
              className='btn'
              onClick={handleUpload}
              disabled={!file || uploading}
              style={{
                borderRadius: 8,
                padding: '8px 34px',
                fontWeight: 600,
                fontSize: '1.08rem',
                border: 'none',
                background:
                  !file || uploading
                    ? 'linear-gradient(90deg, #e5e7eb, #f3f4f6)'
                    : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
                color: !file || uploading ? '#b0b0b0' : '#fff',
                boxShadow: !file || uploading ? 'none' : '0 2px 16px #fcd34d55',
              }}
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequirementUploadModal;
