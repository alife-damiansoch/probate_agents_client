import { uploadFile } from '../../../GenericFunctions/AxiosGenericFunctions';
import  { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { API_URL } from '../../../../baseUrls';
import { useNavigate } from 'react-router-dom';

const FilesDropZone = ({ applicationId }) => {
  const [acceptedFiles, setAcceptedFiles] = useState([]);
  const [fileRejections, setFileRejections] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileProperties, setFileProperties] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validExtensions = [
    '.jpeg',
    '.jpg',
    '.png',
    '.gif',
    '.bmp',
    '.webp',
    '.pdf',
    '.doc',
    '.docx',
    '.xls',
    '.xlsx',
    '.ppt',
    '.pptx',
    '.txt',
    '.rtf',
    '.odt',
    '.ods',
    '.odp',
  ];

  // Add a new method to handle radio button changes
  const handleCheckboxChange = (e, file) => {
    const propName = e.target.name;
    const propValue = e.target.checked; // Updated this line to handle checkbox
    setFileProperties((prev) => ({
      ...prev,
      [file.name]: {
        ...prev[file.name],
        [propName]: propValue,
      },
    }));
  };

  const uploadFilesHandler = async () => {
    setIsLoading(true);
    setUploadStatus('Uploading');
    console.log('Uploading files: ');
    console.log(uploadedFiles);

    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('document', file, file.name);
      // Append newly added properties
      formData.append(
        'is_undertaking',
        fileProperties[file.name]?.is_undertaking ?? false
      );
      formData.append(
        'is_loan_agreement',
        fileProperties[file.name]?.is_loan_agreement ?? false
      );
      formData.append(
        'is_signed',
        fileProperties[file.name]?.is_signed ?? false
      );

      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ', ' + pair[1]);
      // }

      try {
        const response = await uploadFile(
          `${API_URL}/api/applications/agent_applications/document_file/${applicationId}/`,
          formData
        );

        console.log(response.data);
        setIsLoading(false);
        navigate(`/applications/${applicationId}`);
      } catch (error) {
        console.error(`Error uploading document: ${file.name}`, error);
        setIsError(`Error uploading document: ${file.name}`, error);
        setIsLoading(false);
        throw error; // Rethrow error to stop further uploads if needed
      }
    }
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      const newAcceptedFiles = [];
      const newFileRejections = [];

      acceptedFiles.forEach((file) => {
        const fileExtension = file.name
          .slice(file.name.lastIndexOf('.'))
          .toLowerCase();
        if (validExtensions.includes(fileExtension)) {
          newAcceptedFiles.push(file);
        } else {
          newFileRejections.push({
            file,
            errors: [
              { code: 'file-invalid-type', message: 'File type not accepted' },
            ],
          });
        }
      });

      setUploadedFiles((prevFiles) => [...prevFiles, ...newAcceptedFiles]);
      setAcceptedFiles((prev) => [...prev, ...newAcceptedFiles]);
      setFileRejections((prev) => [...prev, ...newFileRejections]);
    },
    [setUploadedFiles]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: true,
  });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <div
      key={`${file.path}-${file.lastModified}`}
      className='card rounded p-2 m-2'
    >
      <li>
        <div className='row'>
          <div className='col-md-8 my-auto text-success'>
            {file.path} - {file.size} bytes
          </div>
          <div className='col-md-4 '>
            <div className='form-check'>
              <input
                className='form-check-input'
                type='checkbox'
                id={`${file.name}-undertaking`}
                name='is_undertaking'
                checked={fileProperties[file.name]?.is_undertaking ?? false}
                onChange={(e) => handleCheckboxChange(e, file)}
              />
              <label
                className='form-check-label'
                htmlFor={`${file.name}-undertaking`}
              >
                Undertaking
              </label>
            </div>
            <div className='form-check'>
              <input
                className='form-check-input'
                type='checkbox'
                id={`${file.name}-loan`}
                name='is_loan_agreement'
                checked={fileProperties[file.name]?.is_loan_agreement ?? false}
                onChange={(e) => handleCheckboxChange(e, file)}
              />
              <label className='form-check-label' htmlFor={`${file.name}-loan`}>
                Loan Agreement
              </label>
            </div>
            <div className='form-check'>
              <input
                className='form-check-input'
                type='checkbox'
                id={`${file.name}-signed`}
                name='is_signed'
                checked={fileProperties[file.name]?.is_signed ?? false}
                onChange={(e) => handleCheckboxChange(e, file)}
              />
              <label
                className='form-check-label'
                htmlFor={`${file.name}-signed`}
              >
                Signed
              </label>
            </div>
          </div>
        </div>
      </li>
    </div>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li className=' text-danger' key={`${file.path}-${file.lastModified}`}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map((e) => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  return (
    <div className='card-body'>
      <div
        style={{
          border: '1px solid white',
          borderRadius: '5px',
          padding: '5px',
        }}
        className='shadow-lg'
      >
        <div className='card-header'>
          <h4 className='card-title text-info-emphasis'>
            Upload Supporting Documents
          </h4>
        </div>

        <div className='my-4 bg-light p-2 rounded-2'>
          <div className='card-body'>
            <div
              {...getRootProps({ className: 'dropzone' })}
              style={{
                border: '2px dashed #007bff',
                padding: '30px',
                textAlign: 'center',
              }}
              className=' shadow'
            >
              <input {...getInputProps()} />
              <p>Drag & drop some files here, or click to select files</p>
              <em>
                (Accepted file types: jpeg, jpg, png, gif, bmp, webp, pdf, doc,
                docx, xls, xlsx, ppt, pptx, txt, rtf, odt, ods, odp)
              </em>
            </div>
            <aside className='mt-3'>
              <h4>Accepted files</h4>
              <ul style={{ listStyle: 'none' }}>{acceptedFileItems}</ul>
              <h4>Rejected files</h4>
              <ul>{fileRejectionItems}</ul>
            </aside>
            <div className='row'>
              <button
                onClick={uploadFilesHandler}
                className='btn btn-info ms-auto shadow'
                disabled={acceptedFiles.length < 1 || isLoading}
              >
                {isLoading ? (
                  <div className='spinner-border text-warning' role='status'>
                    <span className='visually-hidden'>Loading...</span>
                  </div>
                ) : (
                  'Upload files'
                )}
              </button>
            </div>
            {uploadStatus !== '' && (
              <div className='row'>
                <p
                  className={`text-center my-1 ${
                    isError ? 'text-danger' : 'text-success'
                  }`}
                >
                  {uploadStatus}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilesDropZone;
