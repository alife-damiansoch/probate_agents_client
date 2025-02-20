import  { Fragment, useState } from 'react';
import AssignComponent from './AssignComponent';
import { Link } from 'react-router-dom';
import { displayUserTeams } from '../../../GenericFunctions/HelperGenericFunctions';

const ListUsersWithAssignedApplications = ({
  staffUsers,
  refresh,
  setRefresh,
}) => {
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [revealedApplicationId, setRevealedApplicationId] = useState(null);
  const [revealedUserId, setRevealedUserId] = useState(null);
  const [reassingAllApplicationIds, setReassingAllApplicationIds] = useState(
    []
  );

  const handleUserClick = (userId) => {
    setSelectedUserId(userId === selectedUserId ? null : userId);
    setRevealedApplicationId(null);
  };

  const handleReassignClick = (applicationId) => {
    setRevealedApplicationId((prevId) =>
      prevId === applicationId ? null : applicationId
    );
    setRevealedUserId(null);
  };

  const reassignAllClickHandler = (user) => {
    setSelectedUserId(null);
    setRevealedApplicationId(null);
    setRevealedUserId((prevId) => (prevId === user.id ? null : user.id));
    const allAgentApplicationIds = user.applications.map((app) => app.id);
    setReassingAllApplicationIds(allAgentApplicationIds);
  };

  return (
    <div className='container'>
      <div className=' card '>
        <div className=' card-header bg-dark-subtle'>
          <h4 className='mt-2 text-subtitle text-info-emphasis'>{`Agents <---> Applications`}</h4>
        </div>

        <ul className='list-group'>
          {staffUsers.map((user) => (
            <Fragment key={user.id}>
              {(user.is_active ||
                (!user.is_active && user.applications.length > 0)) && (
                <div key={user.id}>
                  <li
                    className={`list-group-item pb-2 border border-info-subtle ${
                      !user.is_active && 'bg-danger-subtle'
                    }`}
                  >
                    <div>
                      <div
                        className='text-decoration-underline row text-center'
                        style={{ cursor: 'pointer', color: 'blue' }}
                        onClick={() => handleUserClick(user.id)}
                      >
                        <strong className='col-12 col-md-6'>
                          {user.email} <br />{' '}
                          {!user.is_active && (
                            <span className=' text-danger'>NOT ACTIVE</span>
                          )}
                          {displayUserTeams(user)}
                        </strong>
                        <span className=' col-12 col-md-6'>
                          Applications: {user.applications.length}
                        </span>
                      </div>

                      <div className='row m-3 mx-auto'>
                        <div className='col-12 col-md-6 text-center mx-auto'>
                          {user.applications.length > 0 ? (
                            <button
                              className={`btn btn-sm  ${
                                revealedUserId !== user.id
                                  ? 'btn-outline-danger'
                                  : 'btn-outline-success'
                              }`}
                              onClick={() => reassignAllClickHandler(user)}
                              style={{ width: '100%' }}
                            >
                              {revealedUserId !== user.id
                                ? 'Reassign all applications'
                                : 'Close'}
                            </button>
                          ) : (
                            <span className='badge rounded-pill bg-info'>
                              No applications assigned
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {selectedUserId === user.id &&
                      user.applications.length > 0 && (
                        <ul className='list-group mt-3'>
                          {user.applications
                            .slice() // Create a shallow copy of the array to avoid mutating the original
                            .sort((a, b) => a.id - b.id) // Sort by id in ascending order
                            .map((application) => (
                              <li
                                key={application.id}
                                className='list-group-item shadow my-1 border-0'
                              >
                                <div className='row'>
                                  <div className='col-6 col-md-5 my-auto'>
                                    <Link
                                      to={`/applications/${application.id}`}
                                      style={{ color: 'blue' }}
                                    >
                                      App ID: {application.id}{' '}
                                      {application?.country && (
                                        <sub>({application?.country})</sub>
                                      )}
                                    </Link>
                                  </div>

                                  {application.loan && (
                                    <div className='col-6 col-md-5 my-auto'>
                                      <Link
                                        to={`/advancements/${application.loan.id}`}
                                        style={{ color: 'blue' }}
                                      >
                                        <span className='ms-2'>
                                          Adv ID: {application.loan.id}
                                        </span>
                                      </Link>
                                    </div>
                                  )}
                                  <div className='col-12 col-md-2 my-auto ms-auto mt-2 mt-md-0'>
                                    <button
                                      className={`btn btn-sm shadow ${
                                        revealedApplicationId !== application.id
                                          ? 'btn-outline-primary'
                                          : 'btn-outline-success'
                                      }`}
                                      onClick={() =>
                                        handleReassignClick(application.id)
                                      }
                                      style={{ width: '100%' }}
                                    >
                                      {revealedApplicationId !== application.id
                                        ? 'Reassign'
                                        : 'Close'}
                                    </button>
                                  </div>
                                </div>

                                {revealedApplicationId === application.id && (
                                  <div className='col-12 my-2 '>
                                    <AssignComponent
                                      staffUsers={staffUsers}
                                      applicationIds={[application.id]}
                                      refresh={refresh}
                                      setRefresh={setRefresh}
                                    />
                                  </div>
                                )}
                              </li>
                            ))}
                        </ul>
                      )}
                    {revealedUserId === user.id && (
                      <div className='col-12 mt-2'>
                        <AssignComponent
                          staffUsers={staffUsers}
                          applicationIds={reassingAllApplicationIds}
                          refresh={refresh}
                          setRefresh={setRefresh}
                        />
                      </div>
                    )}
                  </li>
                </div>
              )}
            </Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ListUsersWithAssignedApplications;
