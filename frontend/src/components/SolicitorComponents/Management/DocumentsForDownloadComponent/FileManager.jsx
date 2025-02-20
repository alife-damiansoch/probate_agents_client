import { useState } from 'react';
import UploadFile from './UploadFile';
import ListFiles from './ListFiles';

const FileManager = () => {
  const [refresh, setRefresh] = useState(false);
  return (
    <div className='card border-0 shadow my-5'>
      <div className='bg-light text-white  mb-4 border-0'>
        <div className=' card-header'>
          <h4 className='text-dark'>File Manager</h4>
        </div>
      </div>
      <UploadFile refresh={refresh} setRefresh={setRefresh} />
      <ListFiles refresh={refresh} setRefresh={setRefresh} />
    </div>
  );
};

export default FileManager;
