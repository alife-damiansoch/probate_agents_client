// InternalFilesGrid.jsx
import InternalFileCard from './InternalFileCard.jsx';
import InternalFilesEmptyState from './InternalFilesEmptyState.jsx';

const InternalFilesGrid = ({
  internalFiles,
  isAdmin,
  token,
  onEditClick,
  setErrorMessage,
  setSuccessMessage,
  refresh,
  setRefresh,
}) => {
  return (
    <>
      {/* Section Header */}
      <div
        className='px-3 py-2 mb-3 rounded-3'
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)',
          color: 'white',
        }}
      >
        <h6 className='mb-0 fw-semibold d-flex align-items-center gap-2'>
          <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z'
              clipRule='evenodd'
            />
          </svg>
          Internal Files ({internalFiles.length})
        </h6>
      </div>

      {/* Files Grid */}
      {internalFiles.length > 0 ? (
        <div className='row g-3'>
          {internalFiles.map((file) => (
            <div key={file.id} className='col-lg-6'>
              <InternalFileCard
                file={file}
                isAdmin={isAdmin}
                token={token}
                onEditClick={onEditClick}
                setErrorMessage={setErrorMessage}
                setSuccessMessage={setSuccessMessage}
                refresh={refresh}
                setRefresh={setRefresh}
              />
            </div>
          ))}
        </div>
      ) : (
        <InternalFilesEmptyState isAdmin={isAdmin} />
      )}
    </>
  );
};

export default InternalFilesGrid;
