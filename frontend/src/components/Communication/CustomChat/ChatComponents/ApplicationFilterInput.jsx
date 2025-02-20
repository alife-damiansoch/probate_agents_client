

const ApplicationFilterInput = ({
  selectedApplicationIdForFilterring,
  setSelectedApplicationIdForFilterring,
}) => {
  return (
    <div className='row my-2 mx-2 shadow'>
      <form className='form-control d-flex align-items-center justify-content-center'>
        <label htmlFor='appInp' className='me-2'>
          Type the application id to filter messages:
        </label>
        <input
          className='form-control form-control-sm w-25 border-1 border-info'
          id='appInp'
          type='number'
          value={selectedApplicationIdForFilterring}
          onChange={(e) =>
            setSelectedApplicationIdForFilterring(e.target.value)
          }
        />
      </form>
    </div>
  );
};

export default ApplicationFilterInput;
