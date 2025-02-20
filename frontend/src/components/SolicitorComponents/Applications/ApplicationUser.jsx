
const ApplicationUser = ({ application }) => {
  return (
    <div className='row'>
      <div className='col-12 col-md-6'>
        <h5 className='card-title'>User:</h5>
        <table className='table table-sm table-striped table-hover'>
          <tbody>
            <tr>
              <td className='bg-secondary' style={{ padding: '0.3rem' }}>
                <strong>ID:</strong>
              </td>
              <td className='bg-secondary' style={{ padding: '0.3rem' }}>
                {application.user.id}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.3rem' }}>
                <strong>User:</strong>
              </td>
              <td style={{ padding: '0.3rem' }}>{application.user.name}</td>
            </tr>
            <tr>
              <td style={{ padding: '0.3rem' }}>
                <strong>Email:</strong>
              </td>
              <td style={{ padding: '0.3rem' }}>{application.user.email}</td>
            </tr>
            <tr>
              <td style={{ padding: '0.3rem' }}>
                <strong>Phone Number:</strong>
              </td>
              <td style={{ padding: '0.3rem' }}>
                {application.user.phone_number}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className='col-12 col-md-6 mt-2 mt-md-0'>
        <h5 className='card-title'>Address:</h5>
        <table className='table table-sm table-striped table-hover'>
          <tbody>
            <tr>
              <td style={{ padding: '0.3rem' }}>
                <strong>Line 1:</strong>
              </td>
              <td style={{ padding: '0.3rem' }}>
                {application.user.address.line1}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.3rem' }}>
                <strong>Line 2:</strong>
              </td>
              <td style={{ padding: '0.3rem' }}>
                {application.user.address.line2}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.3rem' }}>
                <strong>Town/City:</strong>
              </td>
              <td style={{ padding: '0.3rem' }}>
                {application.user.address.town_city}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '0.3rem' }}>
                <strong>County:</strong>
              </td>
              <td style={{ padding: '0.3rem' }}>
                {application.user.address.county}
              </td>
            </tr>
            <tr>
              <td
                style={{ padding: '0.3rem', fontWeight: 'bold' }}
                className=' text-danger-emphasis'
              >
                <strong>Country:</strong>
              </td>
              <td
                className=' text-danger-emphasis'
                style={{ padding: '0.3rem', fontWeight: 'bold' }}
              >
                {application.user.country}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ApplicationUser;
