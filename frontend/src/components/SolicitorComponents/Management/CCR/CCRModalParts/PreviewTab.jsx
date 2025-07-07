// components/CCRModalParts/PreviewTab.jsx
import { RefreshCw } from 'lucide-react';

const PreviewTab = ({
  previewData,
  isLoading,
  onLoadPreview,
  formData,
  formatDate,
}) => {
  return (
    <div className='tab-pane show active'>
      <div className='card'>
        <div className='card-header d-flex justify-content-between align-items-center'>
          <h6 className='card-title mb-0'>Submission Preview</h6>
          <button
            className='btn btn-sm btn-outline-primary'
            onClick={() =>
              onLoadPreview(
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
                      <small className='text-muted'>New Contracts</small>
                    </div>
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className='card bg-light'>
                    <div className='card-body text-center'>
                      <h5 className='text-primary'>
                        {previewData.active_contracts.count}
                      </h5>
                      <small className='text-muted'>Active Updates</small>
                    </div>
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className='card bg-light'>
                    <div className='card-body text-center'>
                      <h5 className='text-warning'>
                        {previewData.settled_contracts.count}
                      </h5>
                      <small className='text-muted'>Settlements</small>
                    </div>
                  </div>
                </div>
                <div className='col-md-3'>
                  <div className='card bg-light'>
                    <div className='card-body text-center'>
                      <h5 className='text-dark'>{previewData.total_records}</h5>
                      <small className='text-muted'>Total Records</small>
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
                                <td>€{contract.amount.toLocaleString()}</td>
                                <td>{formatDate(contract.created_at)}</td>
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
              <p className='text-muted'>Click "Refresh" to load preview data</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewTab;
