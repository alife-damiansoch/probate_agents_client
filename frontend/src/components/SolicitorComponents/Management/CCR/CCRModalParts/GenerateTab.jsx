// components/CCRModalParts/GenerateTab.jsx
import { Download, Eye } from 'lucide-react';

const GenerateTab = ({
  formData,
  setFormData,
  isLoading,
  onGenerateSubmission,
  onLoadPreview,
}) => {
  return (
    <div className='tab-pane show active'>
      <div className='card'>
        <div className='card-header'>
          <h6 className='card-title mb-0'>Generate CCR Submission</h6>
        </div>
        <div className='card-body'>
          <div className='row g-3'>
            <div className='col-md-6'>
              <label htmlFor='referenceDate' className='form-label'>
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
                <label className='form-check-label' htmlFor='testMode'>
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
              onClick={onGenerateSubmission}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div
                    className='spinner-border spinner-border-sm me-2'
                    role='status'
                  >
                    <span className='visually-hidden'>Loading...</span>
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
                onLoadPreview(
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
  );
};

export default GenerateTab;
