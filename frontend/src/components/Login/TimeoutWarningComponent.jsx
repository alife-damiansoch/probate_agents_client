
const TimeoutWarning = ({ remainingTime, stayLoggedIn }) => {
  return (
    <div className='timeout-warning-overlay'>
      <div className='timeout-warning-box'>
        <h5>Session Timeout Warning</h5>
        <p>
          You will be logged out in{' '}
          <span className=' text-danger'>{remainingTime}</span> seconds due to
          inactivity.
        </p>
        <button onClick={stayLoggedIn} className='btn btn-outline-success'>
          Stay Logged In
        </button>
      </div>
    </div>
  );
};

export default TimeoutWarning;
