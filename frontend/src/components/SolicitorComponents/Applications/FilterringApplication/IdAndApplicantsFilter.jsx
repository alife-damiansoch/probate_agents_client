import  { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IdAndApplicantsFilter = ({
  searchId,
  setSearchId,
  applicantDetailSearch,
  setApplicantDetailSearch,
  setIsFiltered,
  title = '',
}) => {
  const [localSearchId, setLocalSearchId] = useState('');
  const [localApplicantDetail, setLocalApplicantDetail] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (searchId) {
      setLocalSearchId(searchId);
    }
  }, [searchId]);

  useEffect(() => {
    if (applicantDetailSearch) {
      setLocalApplicantDetail(applicantDetailSearch);
    }
  }, [applicantDetailSearch]);

  const handleSearchIdSubmit = () => {
    setIsFiltered(true);
    setSearchId(localSearchId);
  };

  const handleSearchApplicantSubmit = () => {
    setIsFiltered(true);
    setApplicantDetailSearch(localApplicantDetail);
  };

  const handleClearAll = () => {
    setIsFiltered(false);
    setLocalApplicantDetail('');
    setApplicantDetailSearch('');
    setLocalSearchId('');
    setSearchId(null);

    setIsOpen(false); // Close the filter panel
  };

  const toggleFilterPanel = () => {
    setIsOpen(!isOpen);
  };

  const closeOnOutsideClick = (e) => {
    if (e.target.id === 'overlay') {
      setIsOpen(false);
    }
  };

  return (
    <div>
      {/* Toggle button */}
      <button
        className='vertical-button'
        onClick={toggleFilterPanel}
        aria-label={isOpen ? 'Close Filters' : 'Open Filters'}
      >
        {isOpen ? 'Close Search' : 'Open Search'}
      </button>

      {/* Background blur and sliding filter panel */}
      <AnimatePresence>
        {isOpen && (
          <div>
            {/* Background Blur */}
            <motion.div
              id='overlay'
              className='position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50'
              style={{ zIndex: 1039, backdropFilter: 'blur(5px)' }}
              onClick={closeOnOutsideClick}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Sliding Filter Panel */}
            <motion.div
              className='position-fixed top-50 start-50 translate-middle bg-white shadow-lg rounded p-4'
              style={{
                width: '350px',
                height: '500px',
                zIndex: 1040,
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <button
                className='btn-close position-absolute top-0 end-0 m-2'
                onClick={() => setIsOpen(false)}
                aria-label='Close'
              ></button>
              <div className=' h-100'>
                <div className='status-filter h-100 d-flex flex-column align-items-center justify-content-around '>
                  <h6 className='mb-4 text-primary'>Filter {title}s</h6>

                  <div className='mb-3'>
                    <label
                      htmlFor='searchIdInput'
                      className='form-label small mb-1'
                    >
                      Search by {title} ID
                    </label>
                    <div className='input-group input-group-sm'>
                      <input
                        id='searchIdInput'
                        type='number'
                        className='form-control form-control-sm'
                        placeholder='Enter ID'
                        value={localSearchId}
                        onChange={(e) => setLocalSearchId(e.target.value)}
                      />
                      <button
                        className='btn btn-success btn-sm'
                        onClick={handleSearchIdSubmit}
                      >
                        Search
                      </button>
                    </div>
                  </div>

                  <div className='mb-3'>
                    <label
                      htmlFor='searchApplicantInput'
                      className='form-label small mb-1'
                    >
                      Search by Applicant
                    </label>
                    <div className='input-group input-group-sm'>
                      <input
                        id='searchApplicantInput'
                        type='text'
                        className='form-control form-control-sm'
                        placeholder='Enter name or PPS'
                        value={localApplicantDetail}
                        onChange={(e) =>
                          setLocalApplicantDetail(e.target.value)
                        }
                        disabled={localSearchId !== ''}
                      />
                      <button
                        className='btn btn-success btn-sm'
                        onClick={handleSearchApplicantSubmit}
                        disabled={localSearchId !== ''}
                      >
                        Search
                      </button>
                    </div>
                    {localSearchId !== '' && (
                      <p className='text-warning small mt-1'>
                        Clear the application ID input to enable applicant
                        search.
                      </p>
                    )}
                  </div>

                  <div className='mt-4'>
                    <button
                      className='btn btn-info btn-sm w-100'
                      onClick={handleClearAll}
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IdAndApplicantsFilter;
