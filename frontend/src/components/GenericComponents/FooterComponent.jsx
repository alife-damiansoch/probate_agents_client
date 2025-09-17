const FooterComponent = () => {
  return (
    <footer className='bg-white text-dark py-4 border-top'>
      <div className='container'>
        <div className='row'>
          <div className='col text-center text-md-left '>
            <p className='mb-0'>
              &copy; {new Date().getFullYear()} PFI. All rights reserved.
            </p>
          </div>
          {/* <Col md={6} className='text-center text-md-right'>
            <p className='mb-0'>Designed and Developed by Your Company</p>
          </Col> */}
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
