// components/CCRModalParts/TestingTab.jsx
import { AlertCircle, Calendar, Download, Eye, Trash2 } from 'lucide-react';

const TestingTab = ({
  isLoading,
  sequenceFiles,
  onGenerateTestSequence,
  onClearTestData,
  onViewFile,
}) => {
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

  return (
    <div className='tab-pane show active'>
      <div className='row g-3'>
        <div className='col-md-6'>
          <div className='card'>
            <div className='card-header'>
              <h6 className='card-title mb-0'>Test Sequence</h6>
            </div>
            <div className='card-body'>
              <p className='card-text'>
                Generate multiple monthly submissions for testing CCR workflow.
              </p>
              <button
                className='btn btn-warning'
                onClick={onGenerateTestSequence}
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
                onClick={onClearTestData}
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
                      <tr key={`sequence-file-${file.month}-${index}`}>
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
                              onClick={() => onViewFile(file)}
                              title='View file content'
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              className='btn btn-outline-secondary'
                              onClick={() =>
                                downloadFile(file.filename, file.content)
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
                  📋 <strong>What to check in these files:</strong>
                  <br />
                  • Month 1: Should contain ID records (onboarding) but no CI
                  records
                  <br />
                  • Month 2: Should contain CI records for Month 1 loans + new
                  ID records
                  <br />• Month 3: Should contain CI updates + any settlements
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
              <strong>Test Mode:</strong> Allows multiple submissions for the
              same reference date
            </li>
            <li>
              <strong>Force Date:</strong> Override the reference date to test
              different scenarios
            </li>
            <li>
              <strong>Test Sequence:</strong> Creates submissions for 3
              consecutive months with file inspection
            </li>
            <li>
              <strong>File Inspection:</strong> View generated CCR files to
              verify correct ID/CI timing
            </li>
            <li>
              <strong>Download Files:</strong> Use the download buttons in
              History tab to get any submission file
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestingTab;
