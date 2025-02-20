import { useState } from 'react';
import { uploadFile } from '../../../GenericFunctions/AxiosGenericFunctions'; // Import your generic axios function

const UploadFile = ({ refresh, setRefresh }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      setUploadStatus('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await uploadFile(
        '/api/downloadableFiles/add/',
        formData
      ); // Using the generic function
      if (response && response.status === 201) {
        setUploadStatus(
          `File "${response.data.filename}" uploaded successfully.`
        );
        setSelectedFile(null); // Reset the file input
        setRefresh(!refresh);
      } else {
        setUploadStatus(response.data.error || 'Error uploading file');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Failed to upload file.');
    }
  };

  return (
    <div className='container my-4'>
      <h3 className='mb-4'>Upload a File</h3>
      <form onSubmit={handleFileUpload}>
        <div className='input-group input-group-sm mb-3'>
          <input
            type='file'
            className='form-control'
            onChange={handleFileChange}
          />

          <button
            className='btn btn-primary'
            type='submit'
            disabled={!selectedFile}
          >
            Upload File
          </button>
        </div>
      </form>
      {uploadStatus && (
        <div className='alert alert-info' role='alert'>
          {uploadStatus}
        </div>
      )}
    </div>
  );
};

export default UploadFile;
