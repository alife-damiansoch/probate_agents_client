
import CommentsComponent from '../SolicitorComponents/Applications/Comments/CommentsComponent';

const OffcanvasComponent = ({ applicationId, comments, setComments }) => {
  return (
    <div className=' col-2 text-end text-md-center my-auto mx-auto ms-md-auto'>
      <button
        className='btn btn-sm btn-info shadow'
        type='button'
        data-bs-toggle='offcanvas'
        data-bs-target='#offcanvasBottom'
        aria-controls='offcanvasBottom'
      >
        Comments
      </button>

      <div
        className='offcanvas offcanvas-bottom custom-offcanvas'
        data-bs-scroll='true'
        tabIndex='-1'
        id='offcanvasBottom'
        aria-labelledby='offcanvasBottomLabel'
      >
        <div className='offcanvas-header'>
          <button
            type='button'
            className='btn-close text-reset'
            data-bs-dismiss='offcanvas'
            aria-label='Close'
          ></button>
        </div>
        <div
          className='offcanvas-body small custom-offcanvas-body'
          style={{ overflowY: 'auto' }}
        >
          <CommentsComponent
            applicationId={applicationId}
            comments={comments}
            setComments={setComments}
          />
        </div>
      </div>
    </div>
  );
};

export default OffcanvasComponent;
