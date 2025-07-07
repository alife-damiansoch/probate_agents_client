// components/CCRModalParts/HistoryTab.jsx
import { Download, RefreshCw } from 'lucide-react';

const HistoryTab = ({
  submissionHistory,
  isLoading,
  onRefresh,
  onDownloadFile,
  formatDate,
  getStatusBadgeClass,
}) => {
  console.log('SUB HISTORY: ', submissionHistory);
  return (
    <div className='tab-pane show active'>
      <div className='card'>
        <div className='card-header d-flex justify-content-between align-items-center'>
          <h6 className='card-title mb-0'>Submission History</h6>
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
                      <td>{formatDate(submission.reference_date)}</td>
                      <td>{submission.total_records}</td>
                      <td>
                        <small className='text-muted'>
                          {submission.breakdown && (
                            <>
                              New: {submission.breakdown.new || 0} | Active:{' '}
                              {submission.breakdown.updates || 0} | Settled:{' '}
                              {submission.breakdown.settlements || 0}
                            </>
                          )}
                        </small>
                      </td>
                      <td>
                        <span
                          className={getStatusBadgeClass(submission.status)}
                        >
                          {submission.status}
                        </span>
                        {submission.is_test && (
                          <span className='badge bg-warning ms-2'>TEST</span>
                        )}
                      </td>
                      <td>{formatDate(submission.generated_at)}</td>
                      <td>
                        <button
                          className='btn btn-sm btn-outline-primary'
                          onClick={() => onDownloadFile(submission.id)}
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
  );
};

export default HistoryTab;
