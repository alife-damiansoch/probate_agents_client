// InternalFilesManager.jsx
import { useEffect, useState } from 'react';
import LoadingComponent from '../../../GenericComponents/LoadingComponent.jsx';
import { fetchData } from '../../../GenericFunctions/AxiosGenericFunctions.jsx';
import InternalFileEditModal from './InternalFileEditModal.jsx';
import InternalFilesGrid from './InternalFilesGrid.jsx';
import InternalFilesHeader from './InternalFilesHeader.jsx';
import InternalFileUploadModal from './InternalFileUploadModal.jsx';
import MessageDisplay from './MessageDisplay.jsx';

const InternalFilesManager = ({ applicationId, refresh, setRefresh, user }) => {
  const [internalFiles, setInternalFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user && user.is_superuser) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // Fetch internal files
  useEffect(() => {
    console.log('useEffect triggered with:', { applicationId, refresh }); // Debug log

    const fetchInternalFiles = async () => {
      console.log('fetchInternalFiles function called'); // Debug log
      console.log('applicationId check:', applicationId); // Debug log

      if (applicationId) {
        console.log('Inside applicationId condition'); // Debug log
        setLoading(true);
        try {
          const endpoint = `/api/internal-files/?application_id=${applicationId}`;
          console.log('Fetching internal files from:', endpoint); // Debug log
          const response = await fetchData('token', endpoint);
          console.log('Internal files response:', response); // Debug log
          setInternalFiles(response.data || response || []);
        } catch (error) {
          console.error('Error fetching internal files:', error);
          setErrorMessage(['Failed to fetch internal files']);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('applicationId is falsy:', applicationId); // Debug log
      }
    };

    fetchInternalFiles();
  }, [applicationId, refresh]); // Make sure these dependencies are correct

  const clearMessages = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleEditClick = (file) => {
    setSelectedFile(file);
    setIsEditModalOpen(true);
  };

  // Debug logs
  console.log('=== COMPONENT RENDER ===');
  console.log(
    'InternalFilesManager - applicationId:',
    applicationId,
    typeof applicationId
  );
  console.log('InternalFilesManager - refresh:', refresh);
  console.log('InternalFilesManager - internalFiles:', internalFiles);
  console.log('InternalFilesManager - loading:', loading);

  if (loading && internalFiles.length === 0) {
    return (
      <div
        className='d-flex justify-content-center align-items-center'
        style={{ minHeight: '200px' }}
      >
        <LoadingComponent />
      </div>
    );
  }

  return (
    <div className='mb-5'>
      <InternalFilesHeader
        isAdmin={isAdmin}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      <MessageDisplay
        successMessage={successMessage}
        errorMessage={errorMessage}
      />

      <InternalFilesGrid
        internalFiles={internalFiles}
        isAdmin={isAdmin}
        token={'token'}
        onEditClick={handleEditClick}
        setErrorMessage={setErrorMessage}
        setSuccessMessage={setSuccessMessage}
        refresh={refresh}
        setRefresh={setRefresh}
      />

      <InternalFileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        applicationId={applicationId}
        token={'token'}
        setSuccessMessage={setSuccessMessage}
        setErrorMessage={setErrorMessage}
        refresh={refresh}
        setRefresh={setRefresh}
        loading={loading}
        setLoading={setLoading}
        clearMessages={clearMessages}
      />

      <InternalFileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        selectedFile={selectedFile}
        token={'token'}
        setSuccessMessage={setSuccessMessage}
        setErrorMessage={setErrorMessage}
        refresh={refresh}
        setRefresh={setRefresh}
        loading={loading}
        setLoading={setLoading}
        clearMessages={clearMessages}
      />
    </div>
  );
};

export default InternalFilesManager;
