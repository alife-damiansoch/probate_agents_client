import { useParams } from 'react-router-dom';
import FilesDropZone from './FileDropZone';
import BackToApplicationsIcon from '../../../GenericComponents/BackToApplicationsIcon';

const UploadNewDocument = () => {
  const { applicationId } = useParams();
  return (
    <>
      <BackToApplicationsIcon backUrl={`/applications/${applicationId}`} />
      <div className='card my-5 shadow'>
        <FilesDropZone applicationId={applicationId} />
      </div>
    </>
  );
};

export default UploadNewDocument;
