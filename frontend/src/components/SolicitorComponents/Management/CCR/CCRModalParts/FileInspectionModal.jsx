// components/CCRModalParts/FileInspectionModal.jsx
import { Code, Download } from 'lucide-react';

const FileInspectionModal = ({ show, onHide, selectedFile }) => {
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

  if (!show || !selectedFile) return null;

  return (
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
              onClick={onHide}
            ></button>
          </div>
          <div className='modal-body'>
            <div className='d-flex justify-content-between align-items-center mb-3'>
              <div>
                <small className='text-muted'>
                  Size: {selectedFile.size} bytes | Month: {selectedFile.month}
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
  );
};

export default FileInspectionModal;
