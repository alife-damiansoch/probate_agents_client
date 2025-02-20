import {  useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';

import { RiLoginCircleLine, RiLogoutCircleRLine } from 'react-icons/ri';
import { MdManageAccounts } from 'react-icons/md';
import { TbWorldSearch } from 'react-icons/tb';
import { BiSolidLayerPlus } from 'react-icons/bi';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';

import { clearUser } from '../../store/userSlice';
import { motion } from 'framer-motion';
import NotificationComponent from '../SolicitorComponents/Notifications/RealTime/NotificationComponent.jsx';

import InfoEmialIcon from './InfoEmialIcon.jsx';
import { FaMailBulk } from 'react-icons/fa';
import { OWN_INFO_EMAIL } from '../../baseUrls';
import NotificationsWrapper from '../SolicitorComponents/Notifications/RealTime/NotificationWrapper.jsx';
import {
  fetchData,
  patchData,
  postData,
} from '../GenericFunctions/AxiosGenericFunctions.jsx';

const NavBar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [childCounts, setChildCounts] = useState([0, 0]); // Assuming 3 child components
  const [totalUnseenMessages, setTotalUnseenMessages] = useState(0);

  const [newApplicationsIds, setNewApplicationIds] = useState(null);
  // const [loadingNewApplicationIds, setLoadingNewApplicationIds] =
  //   useState(false);
  const [refreshNewIds, setRefreshNewIds] = useState(false);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const logoVariant = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        delay: 1,
        duration: 1,
      },
    },
  };

  const handleLogout = async () => {
    try {
      await postData(
        'token',
        '/api/user/logout/',
        {},
        { withCredentials: true }
      );
      dispatch(logout());
      dispatch(clearUser());
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.auth?.token);

  const viewUserProfileHandler = () => {
    navigate('/user_profile');
  };

  //useffect to get all new applications
  useEffect(() => {
    const fetchNewApplicationsIds = async () => {
      console.log('running');
      // setLoadingNewApplicationIds(true);
      const endpoint =
        '/api/applications/agent_applications/new_applications/list/';
      const response = await fetchData(token, endpoint);

      // Handling the response
      if (response && response.status === 200) {
        const sortedApps = response.data.new_application_ids.sort(
          (a, b) => b.id - a.id
        );
        setNewApplicationIds(sortedApps); // Setting all applications

        // setLoadingNewApplicationIds(false);
      } else {
        // Transforming errors into an array of objects
        console.log(`Couldnt load new application id's: ${response.data}`);
        // setLoadingNewApplicationIds(false);
      }
    };
    if (token) {
      fetchNewApplicationsIds();
    }
  }, [token, refreshNewIds]);

  const markNotNewHandler = async (application_id) => {
    const endpoint = `/api/applications/agent_applications/new_applications/${application_id}/mark-seen/`;
    try {
      const response = await patchData(endpoint, {});
      if (response.status === 200) {
        setRefreshNewIds(!refreshNewIds);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Function to update unseen message count for each child component
  const updateUnseenMessages = (index, newCount) => {
    setChildCounts((prevCounts) => {
      // Only update state if the count has actually changed to prevent unnecessary renders
      if (prevCounts[index] !== newCount) {
        const newCounts = [...prevCounts];
        newCounts[index] = newCount;
        return newCounts;
      }
      return prevCounts; // Return previous state if no change
    });
  };

  // Use useEffect to update the total whenever childCounts changes
  useEffect(() => {
    const total = childCounts.reduce((sum, count) => sum + count, 0);
    setTotalUnseenMessages(total);
  }, [childCounts]);
  // console.log(user);

  console.log(newApplicationsIds);
  console.log(typeof newApplicationsIds);

  return (
    <div style={{ position: 'relative' }}>
      <nav className='navbar navbar-expand-lg navbar-light bg-light border-0'>
        <Link className='navbar-brand' to='/'>
          <div className='col text-center'>
            <motion.img
              id='logo'
              src='/img/ALI logo.png'
              alt='ALI logo'
              variants={logoVariant}
              initial='initial'
              animate='animate'
              whileHover={{
                filter: 'invert(50%)',
                cursor: 'pointer',
                opacity: 0.5,
              }}
              onClick={() => {
                navigate('');
              }}
              style={{
                filter: 'invert(100%)',
                width: '100px',
              }}
            />
          </div>
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          aria-controls='navbarNav'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav mr-auto'>
            {isLoggedIn ? (
              <>
                {/* Applications Dropdown */}
                <li className='nav-item dropdown mx-auto'>
                  <button
                    className='btn btn-outline-info border-0 dropdown-toggle'
                    id='applicationsDropdown'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'
                  >
                    Applications
                  </button>
                  <ul
                    className='dropdown-menu text-center shadow'
                    aria-labelledby='applicationsDropdown'
                  >
                    <li>
                      <Link
                        className='dropdown-item d-flex align-items-center justify-content-center gap-1 '
                        to='/applications'
                      >
                        All Applications
                      </Link>
                    </li>
                    <div className=' dropdown-divider'></div>
                    <li>
                      <Link
                        className='dropdown-item d-flex align-items-center justify-content-center gap-1  '
                        to='/applications_active'
                      >
                        Currently in Process
                      </Link>
                    </li>
                    <div className=' dropdown-divider'></div>
                    <li>
                      <Link
                        className='dropdown-item d-flex align-items-center justify-content-center gap-1  '
                        to='/applications_approved_notPaidOut'
                      >
                        Fully Approved (Not Paid Out)
                      </Link>
                    </li>
                    <div className=' dropdown-divider'></div>
                    <li>
                      <Link
                        className='dropdown-item d-flex align-items-center justify-content-center gap-1  '
                        to='/applications_PaidOut_notSettled'
                      >
                        Approved & Paid Out (Not Settled)
                      </Link>
                    </li>
                    <div className=' dropdown-divider'></div>
                    <li>
                      <Link
                        className='dropdown-item d-flex align-items-center justify-content-center gap-1  '
                        to='/applications_settled'
                      >
                        Settled (Closed)
                      </Link>
                    </li>
                    <div className=' dropdown-divider'></div>
                    <li>
                      <Link
                        className='dropdown-item d-flex align-items-center justify-content-center gap-1  '
                        to='/applications_rejected'
                      >
                        Rejected Applications
                      </Link>
                    </li>
                    <hr />
                    <li>
                      <Link
                        className='dropdown-item d-flex justify-content-center align-items-center gap-1'
                        to='/applications_global_search'
                      >
                        <TbWorldSearch size={20} />{' '}
                        <span className='ms-1'>Search</span>
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Advancements Dropdown */}
                <li className='nav-item dropdown mx-auto'>
                  <button
                    className='btn btn-outline-info border-0 dropdown-toggle'
                    id='advancementsDropdown'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'
                  >
                    Advancements
                  </button>
                  <ul
                    className='dropdown-menu text-center  shadow'
                    aria-labelledby='advancementsDropdown'
                  >
                    <li>
                      <Link
                        className='dropdown-item  d-flex align-items-center justify-content-center gap-1 '
                        to='/advancements'
                      >
                        All Advancements
                      </Link>
                    </li>
                    <div className=' dropdown-divider'></div>
                    <li>
                      <Link
                        className='dropdown-item  d-flex align-items-center justify-content-center gap-1 '
                        to='/advancements_active'
                      >
                        Active Advancements
                      </Link>
                    </li>
                    <div className=' dropdown-divider'></div>
                    <li>
                      <Link
                        className='dropdown-item  d-flex align-items-center justify-content-center gap-1 '
                        to='/advancements_paid_out'
                      >
                        Paid Out Advancements
                      </Link>
                    </li>
                    <div className=' dropdown-divider'></div>
                    <li>
                      <Link
                        className='dropdown-item   d-flex align-items-center justify-content-center gap-1 '
                        to='/advancements_settled'
                      >
                        Settled Advancements
                      </Link>
                    </li>
                    <div className=' dropdown-divider'></div>
                    <li>
                      <Link
                        className='dropdown-item  d-flex align-items-center justify-content-center gap-1'
                        to='/not_committee_approved'
                      >
                        Rejected By Committee Advancements
                      </Link>
                    </li>

                    {user &&
                      (user.is_superuser ||
                        (user.teams &&
                          user.teams.some(
                            (team) => team.name === 'finance'
                          ))) && (
                        <li>
                          <div className=' dropdown-divider'></div>
                          <Link
                            className='dropdown-item   d-flex align-items-center justify-content-center gap-1 bg-warning-subtle'
                            to='/advancements_notPaidOut'
                          >
                            Not paid out advancements
                          </Link>
                        </li>
                      )}
                    {user &&
                      (user.is_superuser ||
                        (user.teams &&
                          user.teams.some(
                            (team) => team.name === 'committee_members'
                          ))) && (
                        <li>
                          <div className=' dropdown-divider'></div>
                          <Link
                            className='dropdown-item   d-flex align-items-center justify-content-center gap-1 bg-warning-subtle'
                            to='/advancements_awaiting_approval'
                          >
                            Awaiting commitee approval
                          </Link>
                        </li>
                      )}
                    <hr />
                    <li>
                      <Link
                        className='dropdown-item d-flex justify-content-center align-items-center gap-1'
                        to='/advancements_global_search'
                      >
                        <TbWorldSearch size={20} />{' '}
                        <span className='ms-1'>Search</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className='nav-item dropdown mx-auto'>
                  <button
                    className='btn btn-outline-info border-0 dropdown-toggle'
                    id='advancementsDropdown'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'
                  >
                    Notifications
                  </button>
                  <ul
                    className='dropdown-menu text-center  shadow'
                    aria-labelledby='advancementsDropdown'
                  >
                    <li>
                      <Link className='dropdown-item' to='/notifications'>
                        All Notifications
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            ) : null}
          </ul>

          {isLoggedIn ? (
            <div className='d-flex ms-auto justify-content-center align-items-center mt-2 mt-md-0'>
              {/* icon if any new applications */}
              {newApplicationsIds && newApplicationsIds.length > 0 && (
                <div className='dropdown me-3'>
                  <button
                    className='btn btn-outline-danger border-0 dropdown-toggle mb-1 pb-2 pt-0 mt-0'
                    type='button'
                    id='newApplicationsDropdown'
                    data-bs-toggle='dropdown'
                    aria-expanded='false'
                  >
                    <sub>{newApplicationsIds.length}</sub> <br />
                    <BiSolidLayerPlus size={30} />
                  </button>

                  <ul
                    className='dropdown-menu dropdown-menu-end'
                    aria-labelledby='newApplicationsDropdown'
                  >
                    {newApplicationsIds.length > 0 ? (
                      newApplicationsIds.map((application) => (
                        <li key={application.id} className='dropdown-item'>
                          <span>
                            <strong>ID:</strong>{' '}
                            <span
                              className=' text-info text-decoration-underline'
                              style={{ cursor: 'pointer' }}
                              onClick={() => {
                                navigate(`/applications/${application.id}`);
                              }}
                            >
                              {application.id}
                            </span>{' '}
                            <sub>({application.user__country})</sub>,{' '}
                            <strong>Assigned to:</strong>{' '}
                            {application.assigned_to__email || (
                              <strong className=' text-danger'>
                                Unassigned
                              </strong>
                            )}
                          </span>
                          {(user?.is_superuser ||
                            user?.email === application.assigned_to__email) && (
                            <span>
                              <button
                                className='btn btn-sm btn-outline-success border-0'
                                onClick={() => {
                                  markNotNewHandler(application.id);
                                }}
                              >
                                <IoCheckmarkDoneSharp />
                              </button>
                            </span>
                          )}
                        </li>
                      ))
                    ) : (
                      <li className='dropdown-item text-muted'>
                        No new applications
                      </li>
                    )}
                  </ul>
                </div>
              )}
              {/* Dropdown for Emails */}
              <div className='dropdown me-3'>
                <button
                  className={`btn  dropdown-toggle ${
                    totalUnseenMessages === 0
                      ? 'btn-outline-success border-0'
                      : 'btn-outline-danger'
                  }`}
                  type='button'
                  id='emailDropdown'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  <FaMailBulk size={30} />
                  {totalUnseenMessages > 0 && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '0%',
                        right: '35%',
                      }}
                    >
                      {totalUnseenMessages}
                    </div>
                  )}
                </button>
                <ul className='dropdown-menu' aria-labelledby='emailDropdown'>
                  {/* <li className='dropdown-item'>
                    <InfoEmialIcon
                      title={user && user.email}
                      personal={true}
                      updateUnseenMessages={(newCount) =>
                        updateUnseenMessages(0, newCount)
                      }
                    />
                  </li> */}
                  <li className='dropdown-item'>
                    <InfoEmialIcon
                      title={OWN_INFO_EMAIL}
                      personal={false}
                      updateUnseenMessages={(newCount) =>
                        updateUnseenMessages(1, newCount)
                      }
                    />
                  </li>
                </ul>
              </div>

              {/* Management Button for Superusers */}
              {user && user.is_superuser && (
                <button
                  className='btn btn-outline-info border-0 me-3 d-flex flex-column justify-content-center align-items-center'
                  onClick={() => {
                    navigate('/userManagement');
                  }}
                >
                  <MdManageAccounts size={25} className='icon-shadow' />
                  Management
                </button>
              )}

              {/* Logout Button */}
              <button
                className='btn btn-outline-danger shadow'
                onClick={handleLogout}
              >
                <RiLogoutCircleRLine size={20} className='me-2' />
                Logout
              </button>
            </div>
          ) : (
            <Link
              className='btn btn-outline-primary ms-auto shadow'
              to='/login'
            >
              <RiLoginCircleLine size={20} className='me-2' />
              Login
            </Link>
          )}
        </div>
      </nav>
      {user ? (
        <div className='row mb-2'>
          <div className='col-auto ms-auto my-auto'>
            <div
              className='alert alert-success text-center py-2'
              style={{ backgroundColor: '#d4edda', cursor: 'pointer' }}
              data-bs-toggle='tooltip'
              data-bs-placement='bottom'
              title={user?.teams?.map((team) => team.name).join(', ')}
              onClick={viewUserProfileHandler}
            >
              <small>Welcome, {user.email}</small>
            </div>
          </div>
          <div className=' col-auto  my-auto'>
            <NotificationComponent
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </div>
        </div>
      ) : null}
      {showNotifications && (
        <NotificationsWrapper
          notifications={notifications}
          setNotifications={setNotifications}
          setShowNotifications={setShowNotifications}
        />
      )}
    </div>
  );
};

export default NavBar;
