const LoadingComponent = () => {
  return (
    <div className='row'>
      <div className='d-flex justify-content-center align-items-center my-5'>
        <div className='spinner-border text-warning' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
        <br />
      </div>
      <p className='col text-warning text-center'>Loading...</p>
    </div>
  );
};

export default LoadingComponent;
