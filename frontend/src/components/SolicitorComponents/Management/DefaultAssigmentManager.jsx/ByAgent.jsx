import  { useEffect, useState } from 'react';
import {
  deleteData,
  fetchData,
  patchData,
  postData,
} from '../../../GenericFunctions/AxiosGenericFunctions';
import Cookies from 'js-cookie';
import { BiEdit, BiSave } from 'react-icons/bi';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import renderErrors, {
  displayUserTeams,
} from '../../../GenericFunctions/HelperGenericFunctions';

const ByAgent = () => {
  const token = Cookies.get('auth_token_agents');
  const [assignments, setAssignments] = useState([]);
  const [assignmentsWithNotAssigned, setAssignmentsWithNotAssigned] = useState(
    []
  );
  const [sortBy, setSortBy] = useState(''); // Tracks which column is being sorted
  const [sortDirection, setSortDirection] = useState('asc'); // Tracks the sort direction
  const [editMode, setEditMode] = useState(false);
  const [editModeIndex, setEditModeIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState('');
  const [staffUsers, setStaffUsers] = useState([]); // Store list of staff users
  const [nonStaffUsers, setNonStaffUsers] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [
    overwritExistingApplicationsAssignedSolicitor,
    setOverwritExistingApplicationsAssignedSolicitor,
  ] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (token) {
        const endpoint = '/api/assignments/assignments/';
        const response = await fetchData(token, endpoint);
        // console.log(response.data);

        if (response.status === 200) {
          //setting up two of them, because when im adding not assigned im getting the infinite loop
          setAssignments(response.data);
          setAssignmentsWithNotAssigned(response.data);
        } else {
          setErrors(response.data);
        }
      }
    };

    const fetchUsers = async () => {
      setIsLoading(true);
      if (token) {
        const endpoint = '/api/user/';
        const response = await fetchData(token, endpoint);

        if (response.status === 200) {
          const allUsers = response.data;
          // console.log(allUsers);

          const activeStaffUsers = allUsers.filter(
            (user) =>
              user.is_active &&
              (user.is_staff === true || user.is_superuser === true)
          );
          setStaffUsers(activeStaffUsers);
          const nsUsers = allUsers.filter((user) => user.is_staff === false);
          setNonStaffUsers(nsUsers);
        } else {
          setErrors(response.data);
        }
        setIsLoading(false);
      }
    };

    fetchAssignments();
    fetchUsers();
  }, [token, refresh]);

  // Toggle sorting on column header click
  const handleSort = (column) => {
    setEditMode(false);
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  // Helper function to sort the data
  const sortedAssignments = [...assignmentsWithNotAssigned].sort((a, b) => {
    let aValue = '';
    let bValue = '';

    if (sortBy === 'staff_user') {
      aValue = a.staff_user?.email || '';
      bValue = b.staff_user?.email || '';
    } else if (sortBy === 'agency_user') {
      aValue = a.agency_user?.email || '';
      bValue = b.agency_user?.email || '';
    } else if (sortBy === 'agency_name') {
      aValue = a.agency_user?.name || '';
      bValue = b.agency_user?.name || '';
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const editModeToggle = (i) => {
    setEditMode(!editMode);
    setEditModeIndex(i);
  };

  //useffect to get all the non staff users that have no staff user assigned to them
  useEffect(() => {
    if (nonStaffUsers && assignments) {
      const agencies_with_no_default_assigments = nonStaffUsers.filter(
        (obj) =>
          !assignments.some((item) => item.agency_user.email === obj.email)
      );

      const agencies_with_no_default_assigments_obj =
        agencies_with_no_default_assigments.map((item) => ({
          staff_user: null, // Set staff_user to null as required
          id: `${Date.now()}-${Math.random()}`,
          agency_user: {
            ...item, // Copy all properties, including teams
          },
        }));

      // Filter out duplicates based on `agency_user.id` before adding to the state
      const uniqueAssignments = agencies_with_no_default_assigments_obj.filter(
        (newAssignment) =>
          !assignmentsWithNotAssigned.some(
            (existingAssignment) =>
              existingAssignment.agency_user.id === newAssignment.agency_user.id
          )
      );

      // console.log(uniqueAssignments);

      // Add the new assignments to the existing state
      // Add only unique assignments to the state
      setAssignmentsWithNotAssigned((prevAssignments) => [
        ...prevAssignments,
        ...uniqueAssignments,
      ]);
    }
  }, [assignments, nonStaffUsers]);

  // Handler for changing the selected admin in the dropdown
  const handleAgentChange = (e, assignmentId) => {
    const selectedValue = e.target.value;
    setSelectedAgent(selectedValue); // Update the selected admin value in state
    console.log(
      `Selected staff ID for assignment ${assignmentId}:`,
      selectedValue
    );

    // Update the assignments state if needed (this part would depend on your update logic)
    // Example: setAssignmentsWithNotAssigned or any other state
  };

  // CRUD

  const saveOrUpdateAssigmentHandler = async (assigmentId) => {
    const originalAssigment = assignmentsWithNotAssigned.find(
      (x) => x.id === assigmentId
    );
    if (
      selectedAgent !== null &&
      selectedAgent !== originalAssigment.staff_user?.id
    ) {
      if (originalAssigment.staff_user === null) {
        console.log('Creating new assigment');

        setIsLoading(true);

        if (token) {
          const newAssigmentObj = {
            staff_user_id: selectedAgent,
            agency_user_id: originalAssigment.agency_user.id,
          };
          console.log(newAssigmentObj);
          const endpoint = `/api/assignments/assignments/?overwrite_existing_applications_assigned_solicitor=${overwritExistingApplicationsAssignedSolicitor}`;
          const response = await postData(token, endpoint, newAssigmentObj);
          // console.log(response);

          if (response.status === 201) {
            const result = response.data.results;

            console.log(result);
            setRefresh(!refresh);
          } else {
            setErrors(response.data);
          }
          setIsLoading(false);
        }
      } else {
        console.log('Updating assigment');

        const newAssigmentObj = {
          staff_user_id: selectedAgent,
        };
        const endpoint = `/api/assignments/assignments/${assigmentId}/?overwrite_existing_applications_assigned_solicitor=${overwritExistingApplicationsAssignedSolicitor}`;
        const response = await patchData(endpoint, newAssigmentObj);

        if (response.status === 200) {
          setRefresh(!refresh);
        } else {
          setErrors(response.data);
        }
        setIsLoading(false);
      }
    } else {
      console.log(
        'Selected agent is either null or the same as before, no changes needed'
      );
    }
    setEditMode(false);
    setSelectedAgent(null);
    setEditModeIndex(null);
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  const deleteAssigmentHandler = async (assigmentId) => {
    const endpoint = `/api/assignments/assignments/${assigmentId}/`;
    const response = await deleteData(endpoint);

    if (response.status === 204) {
      setRefresh(!refresh);
    } else {
      setErrors(response.data);
    }
    setIsLoading(false);
  };

  console.log(sortedAssignments);

  return (
    <>
      {sortedAssignments && (
        <div className='container my-4'>
          <h3 className='text-center mb-4'>Default Assignment Management</h3>

          <table className='table table-borderless table-sm table-hover'>
            <thead className=' table-info'>
              <tr>
                <th
                  onClick={() => handleSort('staff_user')}
                  style={{ cursor: 'pointer' }}
                >
                  Agent Email{' '}
                  {sortBy === 'staff_user' &&
                    (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('agency_user')}
                  style={{ cursor: 'pointer' }}
                >
                  Solicitor Firm Email{' '}
                  {sortBy === 'agency_user' &&
                    (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('agency_name')}
                  style={{ cursor: 'pointer' }}
                >
                  Solicitor Firm Name{' '}
                  {sortBy === 'agency_name' &&
                    (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAssignments.map((item, index) => (
                <tr
                  key={index}
                  className={`${!item.staff_user && 'table-warning'} ${
                    item.staff_user &&
                    !item.staff_user.is_active &&
                    'table-danger'
                  }`}
                >
                  {/* Render Staff Email with Dropdown in Edit Mode */}
                  {index === 0 ||
                  sortBy !== 'staff_user' ||
                  editMode === true ? (
                    <td
                      className={`border-top border-start ${
                        index === sortedAssignments.length - 1
                          ? 'border-bottom'
                          : ''
                      } ${
                        editMode &&
                        editModeIndex === item.id &&
                        'bg-danger-subtle'
                      }`}
                    >
                      {editMode && item.id === editModeIndex ? (
                        // Render a dropdown when in edit mode
                        <>
                          <select
                            className='form-select form-select-sm'
                            defaultValue={item.staff_user?.id || ''}
                            onChange={(e) => handleAgentChange(e, item.id)} // Call handler on change
                          >
                            <option value='' disabled>
                              Select Staff
                            </option>
                            {staffUsers.map((user) => (
                              <option key={user.id} value={user.id}>
                                {user.email} {displayUserTeams(user)}
                              </option>
                            ))}
                          </select>
                          {/* Checkbox to check if overwrite existing applications assigned agent */}
                          <div className='p-3'>
                            <div className='form-check mb-3'>
                              <input
                                type='checkbox'
                                id='overwriteCheckbox'
                                className='form-check-input'
                                checked={
                                  overwritExistingApplicationsAssignedSolicitor
                                }
                                onChange={() =>
                                  setOverwritExistingApplicationsAssignedSolicitor(
                                    !overwritExistingApplicationsAssignedSolicitor
                                  )
                                }
                              />
                              <label
                                htmlFor='overwriteCheckbox'
                                className='form-check-label'
                              >
                                Overwrite Existing Application Assigned Agent
                              </label>
                            </div>
                          </div>
                        </>
                      ) : (
                        <p
                          className={`${
                            item.staff_user &&
                            !item.staff_user.is_active &&
                            'text-end'
                          }`}
                        >
                          {item.staff_user?.email || 'Not Assigned'}{' '}
                          {item.staff_user &&
                            `${displayUserTeams(item.staff_user)}`}{' '}
                          <br />
                          <span className=' text-danger'>
                            {item.staff_user &&
                              !item.staff_user.is_active &&
                              'NOT ACTIVE'}
                          </span>
                        </p>
                      )}
                    </td>
                  ) : item.staff_user?.email !==
                    sortedAssignments[index - 1].staff_user?.email ? (
                    <td
                      className={`border-top border-start ${
                        index === sortedAssignments.length - 1
                          ? 'border-bottom'
                          : ''
                      }`}
                    >
                      {item.staff_user?.email || 'Not Assigned'}
                      <br />
                      {item.staff_user &&
                        !item.staff_user.is_active &&
                        'NOT ACTIVE'}
                    </td>
                  ) : (
                    <td
                      className={`border-start ${
                        index === sortedAssignments.length - 1
                          ? 'border-bottom'
                          : ''
                      }  `}
                    ></td>
                  )}

                  {/* Render Agency Email */}
                  <td
                    className={` border-1 ${
                      !item.agency_user?.is_active && 'text-danger'
                    }`}
                  >
                    {item.agency_user?.email || 'N/A'}
                  </td>

                  {/* Render Agency Name */}
                  <td
                    className={` border-1 ${
                      !item.agency_user?.is_active && 'text-danger'
                    }`}
                  >
                    {item.agency_user?.name || 'N/A'}
                    {' ('}
                    {item.agency_user?.country}
                    {')'}{' '}
                    {item.agency_user?.applications_owed_len &&
                    item.agency_user?.applications_owed_len > 0 ? (
                      <>
                        <br />
                        <sub className=' text-info'>
                          Number of active applications:{' '}
                          {item.agency_user?.applications_owed_len}
                        </sub>
                      </>
                    ) : (
                      item.agency_user?.applications_owed_len === 0 && (
                        <>
                          <br />
                          <sub className=' text-info'>
                            Number of active applications: 0
                          </sub>
                        </>
                      )
                    )}
                    {item.agency_user?.advancements_owed_len &&
                    item.agency_user?.advancements_owed_len > 0 ? (
                      <>
                        <br />
                        <sub className=' text-success'>
                          Number of active advancements:{' '}
                          {item.agency_user?.advancements_owed_len}
                        </sub>
                      </>
                    ) : (
                      item.agency_user?.advancements_owed_len === 0 && (
                        <>
                          <br />
                          <sub className=' text-success'>
                            Number of active advancements: 0
                          </sub>
                        </>
                      )
                    )}
                    {!item.agency_user?.is_active && (
                      <>
                        <br />
                        <sub>ACCOUNT NOT ACTIVATED</sub>
                      </>
                    )}
                  </td>

                  {/* Actions Column */}
                  <td className=' border-1 '>
                    {!editMode || item.id !== editModeIndex ? (
                      <div className=' d-flex  align-items-center justify-content-evenly'>
                        <BiEdit
                          className=' text-warning'
                          size={20}
                          onClick={() => editModeToggle(item.id)}
                        />
                        {item.staff_user && (
                          <RiDeleteBin2Fill
                            className=' text-danger'
                            size={20}
                            onClick={() => {
                              deleteAssigmentHandler(item.id);
                            }}
                          />
                        )}
                      </div>
                    ) : (
                      <div className='d-flex align-items-center justify-content-evenly'>
                        <BiSave
                          className=' text-success'
                          size={20}
                          onClick={() => saveOrUpdateAssigmentHandler(item.id)}
                        />
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {errors && (
        <div className='alert alert-danger'>
          <div className={`alert text-center text-danger`} role='alert'>
            {renderErrors(errors)}
          </div>
        </div>
      )}
    </>
  );
};

export default ByAgent;
