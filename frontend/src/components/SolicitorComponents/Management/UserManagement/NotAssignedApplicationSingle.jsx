import  { useEffect, useState } from 'react';
import AssignComponent from './AssignComponent';
import { Link } from 'react-router-dom';
import { patchData } from '../../../GenericFunctions/AxiosGenericFunctions';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import renderErrors from '../../../GenericFunctions/HelperGenericFunctions';

const NotAssignedApplicationSingle = ({
  application,
  advancement,
  staffUsers,
  refresh,
  setRefresh,
  assignments,
}) => {
  const [revealedApplicationId, setRevealedApplicationId] = useState(null);
  const [defaultAssignment, setDefaultAssignment] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (assignments && application) {
      const def_assigment = assignments.find(
        (x) => x.agency_user.email === application.user.email
      );

      if (def_assigment) {
        setDefaultAssignment(def_assigment);
      }
    }
  }, [assignments, application]);

  const handleAssignClick = (applicationId) => {
    setRevealedApplicationId((prevId) =>
      prevId === applicationId ? null : applicationId
    );
  };

  const handleAssignToDefault = async (applicationId) => {
    setLoading(true);
    const patchObj = {
      assigned_to: defaultAssignment.staff_user.id,
    };
    const endpoint = `/api/applications/agent_applications/${applicationId}/`;
    const result = await patchData(endpoint, patchObj);
    if (result.status === 200) {
      console.log('Assigned Successfully');
      setRefresh(!refresh);
    } else {
      setErrorMessage(result.data);
      console.log(result.data);
    }
    setLoading(false);
  };

  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <div key={application.id} className='card mb-2 p-2 shadow border-0'>
      <div className='row g-1'>
        <div className='col-md-3'>
          <p className='mb-1'>
            <strong>Application id:</strong>{' '}
            <Link to={`/applications/${application.id}`} className=' link-info'>
              {application.id} ({application?.user?.country})
            </Link>
          </p>
        </div>
        <div className='col-md-3'>
          <p className='mb-1'>
            <strong>Approved Advancement id:</strong>{' '}
            {advancement ? (
              <Link
                to={`/advancements/${advancement.id}`}
                className='link-info'
              >
                {advancement.id}
              </Link>
            ) : (
              'N/A'
            )}
          </p>
        </div>
        <div className='col-6 d-flex justify-content-evenly'>
          <button
            className={`btn btn-sm shadow  ${
              revealedApplicationId !== application.id
                ? 'btn-outline-success'
                : 'btn-outline-primary'
            }`}
            onClick={() => handleAssignClick(application.id)}
          >
            {revealedApplicationId !== application.id
              ? 'Assign manually'
              : 'Close'}
          </button>
          {defaultAssignment && (
            <div className=' d-flex flex-column align-items-center justify-content-center'>
              <button
                className={`btn btn-sm shadow btn-outline-info`}
                onClick={() => handleAssignToDefault(application.id)}
                disabled={!defaultAssignment.staff_user.is_active}
              >
                Assign to default user <br />
              </button>
              {defaultAssignment.staff_user.is_active ? (
                <small className='text-success mt-1'>
                  {defaultAssignment.staff_user.email}
                </small>
              ) : (
                <small className='text-danger mt-1 text-center'>
                  {defaultAssignment.staff_user.email} <br /> is not active
                </small>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reveal div under the card */}
      {revealedApplicationId === application.id && (
        <div className='mt-2'>
          <AssignComponent
            staffUsers={staffUsers}
            applicationIds={[application.id]}
            refresh={refresh}
            setRefresh={setRefresh}
          />
        </div>
      )}
      {errorMessage && (
        <div className='alert alert-danger'>
          <div className={`alert text-center text-danger`} role='alert'>
            {renderErrors(errorMessage)}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotAssignedApplicationSingle;
