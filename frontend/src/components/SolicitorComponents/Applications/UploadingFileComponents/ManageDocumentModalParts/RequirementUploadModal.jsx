import { useState } from 'react';
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

  // Build new filename: requirement.template_filename (strip ext) + _applicationId + .realext
  function buildCustomFilename(templateFilename, applicationId, realFile) {
    let base = templateFilename.replace(/\.[^/.]+$/, ''); // remove extension
    let ext = realFile.name.split('.').pop();
    return `${base}_${applicationId}.${ext}`;
  }

  // Upload handler
  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }
    setUploading(true);
    setError('');
    setStatus('');

    // Generate new filename
    const newFilename = buildCustomFilename(
      requirement.template_filename,
      applicationId,
      file
    );

    // Read file into Blob and make a new File object with the custom name
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
        <div className='modal-content' style={{ borderRadius: 12 }}>
          <div className='modal-header' style={{ borderBottom: 0 }}>
            <h5 className='modal-title'>Upload Document</h5>
            <button
              type='button'
              className='btn-close'
              onClick={onClose}
              disabled={uploading}
            />
          </div>
          <div className='modal-body'>
            <div className='mb-3'>
              <label className='form-label'>
                Select file to upload <span className='text-danger'>*</span>
              </label>
              <input
                type='file'
                className='form-control'
                onChange={handleFileChange}
                accept={
                  '.jpeg,.jpg,.png,.gif,.bmp,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt,.ods,.odp'
                }
                disabled={uploading}
                style={{
                  borderRadius: 8,
                  fontSize: '0.92rem',
                  padding: '7px 10px',
                }}
              />
            </div>
            <div className='mb-2'>
              <small className='text-muted'>
                Accepted types: PDF, Word, Excel, Images, etc.
              </small>
            </div>
            {file && (
              <div className='mb-2'>
                <div style={{ fontSize: '0.95rem', color: '#334155' }}>
                  <strong>Will be uploaded as:</strong>
                  <br />
                  <span style={{ color: '#0ea5e9', fontFamily: 'monospace' }}>
                    {buildCustomFilename(
                      requirement.template_filename,
                      applicationId,
                      file
                    )}
                  </span>
                </div>
              </div>
            )}
            {error && (
              <div
                className='alert alert-danger py-2 mt-3 mb-0'
                style={{ fontSize: '0.92rem', borderRadius: 8 }}
              >
                {error}
              </div>
            )}
            {status && (
              <div
                className='alert alert-success py-2 mt-3 mb-0'
                style={{ fontSize: '0.92rem', borderRadius: 8 }}
              >
                {status}
              </div>
            )}
          </div>
          <div className='modal-footer' style={{ borderTop: 0 }}>
            <button
              className='btn btn-secondary'
              onClick={onClose}
              disabled={uploading}
              style={{ borderRadius: 8, padding: '7px 24px' }}
            >
              Cancel
            </button>
            <button
              className='btn btn-primary'
              onClick={handleUpload}
              disabled={!file || uploading}
              style={{ borderRadius: 8, padding: '7px 24px' }}
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
