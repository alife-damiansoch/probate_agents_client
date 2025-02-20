import { useEffect, useState } from 'react';
import {
  fetchData,
  deleteData,
  downloadFileAxios,
} from '../../../GenericFunctions/AxiosGenericFunctions'; // Import your generic axios functions
import { LiaFileDownloadSolid } from 'react-icons/lia';
import { LuFileX } from 'react-icons/lu';

const ListFiles = ({ refresh, setRefresh }) => {
  const [files, setFiles] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState(''); // Success or danger

  useEffect(() => {
    fetchFiles();
  }, [refresh]);

  const fetchFiles = async () => {
    try {
      const response = await fetchData(null, '/api/downloadableFiles/list/');
      if (response && response.status === 200) {
        setFiles(response.data);
        // setStatusMessage('Files loaded successfully.');
        setStatusType('success');
      } else {
        setStatusMessage('Failed to load files.');
        setStatusType('danger');
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      setStatusMessage('Error fetching files.');
      setStatusType('danger');
    }
  };

  const deleteFile = async (filename) => {
    try {
      const response = await deleteData(
        `/api/downloadableFiles/delete/${filename}/`
      );
      if (response && response.status === 200) {
        setStatusMessage(`File ${filename} deleted.`);
        setStatusType('success');
        await fetchFiles(); // Refresh the file list after deletion
        setRefresh(!refresh);
      } else {
        setStatusMessage(response.data.error || 'Failed to delete file.');
        setStatusType('danger');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      setStatusMessage('Failed to delete file.');
      setStatusType('danger');
    }
  };

   // Handle file download
  const downloadFile = async (filename) => {
    try {
      const response = await downloadFileAxios(
        null,
        `/api/downloadableFiles/download/${filename}`
      );
      if (response && response.status === 200) {
        const blob = new Blob([response.data], {
          type: response.headers['content-type'],
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename); // Set filename
        document.body.appendChild(link);
        link.click(); // Trigger the download
        link.remove();
        window.URL.revokeObjectURL(url);
        setStatusMessage(`File ${filename} downloaded successfully.`);
        setStatusType('success');
      } else {
        setStatusMessage('Failed to download file.');
        setStatusType('danger');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      setStatusMessage('Error downloading file.');
      setStatusType('danger');
    }
  };

  return (
    <div className='container my-4'>
      <h3 className='mb-4'>Available Files</h3>
      {statusMessage && (
        <div className={`alert alert-${statusType}`} role='alert'>
          {statusMessage}
        </div>
      )}
      {files.length > 0 ? (
        <table className='table  table-striped table-hover table-sm table-primary  table-responsive shadow'>
          <thead>
            <tr>
              <th className=' col-10'>Filename</th>
              <th className=' col-2'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => (
              <tr key={index}>
                <td className=' align-middle'>
                  <span>{file}</span>
                </td>
                <td className=''>
                  <button
                    className='col-6 btn btn-sm btn-outline-success border-0 '
                    onClick={() => downloadFile(file)}
                  >
                    <LiaFileDownloadSolid size={30} />
                  </button>
                  <button
                    className='col-6 btn btn-sm btn-outline-danger border-0'
                    onClick={() => deleteFile(file)}
                  >
                    <LuFileX size={30} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No files available.</p>
      )}
    </div>
  );
};

export default ListFiles;
