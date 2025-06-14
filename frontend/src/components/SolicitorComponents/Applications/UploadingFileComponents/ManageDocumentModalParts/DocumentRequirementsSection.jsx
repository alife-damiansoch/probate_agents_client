import LoadingComponent from '../../../../GenericComponents/LoadingComponent.jsx';
import DocumentTypeCard from './DocumentTypeCard';

const DocumentRequirementsSection = ({
  availableDocumentTypes,
  currentRequirements,
  loadingRequirements,
  addingRequirement,
  removingRequirement,
  onAddRequirement,
  onRemoveRequirement,
}) => {
  // Helper function to check if a document type is already required
  const isDocumentTypeRequired = (documentTypeId) => {
    return currentRequirements.some(
      (req) => req.document_type.id === documentTypeId
    );
  };

  return (
    <div className='mb-5'>
      <div className='d-flex align-items-center justify-content-between mb-4'>
        <div className='d-flex align-items-center gap-3'>
          <div
            className='d-flex align-items-center justify-content-center rounded-3'
            style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
            }}
          >
            <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
              <path
                fillRule='evenodd'
                d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                clipRule='evenodd'
              />
            </svg>
          </div>
          <div>
            <h5 className='mb-0 fw-bold' style={{ color: '#1e293b' }}>
              Document Requirements
            </h5>
            <p className='mb-0 text-muted small'>
              Manage which documents are required for this application
            </p>
          </div>
        </div>
        {currentRequirements.length > 0 && (
          <div
            className='px-3 py-1 rounded-pill'
            style={{
              backgroundColor: '#10b981',
              color: 'white',
              fontSize: '0.8rem',
              fontWeight: '600',
            }}
          >
            {currentRequirements.length} Required
          </div>
        )}
      </div>

      {loadingRequirements ? (
        <div className='text-center py-5'>
          <LoadingComponent />
          <p className='mt-3 text-muted'>Loading document requirements...</p>
        </div>
      ) : (
        <div className='row g-3'>
          {availableDocumentTypes.map((docType) => (
            <DocumentTypeCard
              key={docType.id}
              docType={docType}
              isRequired={isDocumentTypeRequired(docType.id)}
              isProcessing={
                addingRequirement === docType.id ||
                removingRequirement === docType.id
              }
              onAdd={onAddRequirement}
              onRemove={onRemoveRequirement}
            />
          ))}

          {availableDocumentTypes.length === 0 && (
            <div className='col-12'>
              <div
                className='text-center p-5 rounded-4'
                style={{
                  background:
                    'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                  border: '2px dashed #cbd5e1',
                }}
              >
                <svg
                  width='48'
                  height='48'
                  fill='#9ca3af'
                  viewBox='0 0 20 20'
                  className='mx-auto mb-3'
                >
                  <path
                    fillRule='evenodd'
                    d='M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z'
                    clipRule='evenodd'
                  />
                </svg>
                <h6 className='fw-bold mb-2' style={{ color: '#6b7280' }}>
                  No Document Types Available
                </h6>
                <p
                  className='mb-0'
                  style={{
                    color: '#9ca3af',
                    fontSize: '0.875rem',
                  }}
                >
                  Please create document types in the admin panel first.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentRequirementsSection;
