import { MdAttachment } from 'react-icons/md';

const AttachmentsComponent = ({ handleFileChange }) => {
  return (
    <div className='row text-end mx-0'>
      <label className='btn btn-sm btn-outline-dark col-1 ms-auto border-0 mt-2'>
        <MdAttachment className='icon-shadow' size={30} />
        <input
          type='file'
          multiple
          onChange={(e) => {
            handleFileChange(e);
          }}
          style={{ display: 'none' }} // Hide the input
        />
      </label>
    </div>
  );
};

export default AttachmentsComponent;
