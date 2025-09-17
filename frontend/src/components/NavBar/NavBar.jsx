import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';

import { BiSolidLayerPlus } from 'react-icons/bi';
import { IoCheckmarkDoneSharp } from 'react-icons/io5';
import { MdManageAccounts } from 'react-icons/md';
import { RiLoginCircleLine, RiLogoutCircleRLine } from 'react-icons/ri';
import { TbWorldSearch } from 'react-icons/tb';

import { motion } from 'framer-motion';
import { clearUser } from '../../store/userSlice';
import NotificationComponent from '../SolicitorComponents/Notifications/RealTime/NotificationComponent.jsx';

import { FaMailBulk } from 'react-icons/fa';
import { OWN_INFO_EMAIL } from '../../baseUrls';
import {
  fetchData,
  patchData,
  postData,
} from '../GenericFunctions/AxiosGenericFunctions.jsx';
import NotificationsWrapper from '../SolicitorComponents/Notifications/RealTime/NotificationWrapper.jsx';
import InfoEmialIcon from './InfoEmialIcon.jsx';

const NavBar = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const [childCounts, setChildCounts] = useState([0, 0]);
  const [totalUnseenMessages, setTotalUnseenMessages] = useState(0);

  const [newApplicationsIds, setNewApplicationIds] = useState(null);
  const [refreshNewIds, setRefreshNewIds] = useState(false);

  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const logoVariant = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { delay: 1, duration: 1 },
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

  useEffect(() => {
    const fetchNewApplicationsIds = async () => {
      const endpoint =
        '/api/applications/agent_applications/new_applications/list/';
      const response = await fetchData(token, endpoint);

      if (response && response.status === 200) {
        const sortedApps = response.data.new_application_ids.sort(
          (a, b) => b.id - a.id
        );
        setNewApplicationIds(sortedApps);
      } else {
        console.log(`Couldn't load new application id's: ${response.data}`);
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

  const updateUnseenMessages = (index, newCount) => {
    setChildCounts((prevCounts) => {
      if (prevCounts[index] !== newCount) {
        const newCounts = [...prevCounts];
        newCounts[index] = newCount;
        return newCounts;
      }
      return prevCounts;
    });
  };

  useEffect(() => {
    const total = childCounts.reduce((sum, count) => sum + count, 0);
    setTotalUnseenMessages(total);
  }, [childCounts]);

  return (
    <div style={{ position: 'relative' }}>
      {/* Modern Navigation Bar */}
      <nav
        className='navbar navbar-expand-lg'
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          borderBottom: '2px solid #e5e7eb',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '12px 24px',
        }}
      >
        {/* Logo Section */}
        <Link className='navbar-brand' to='/'>
          <motion.img
            id='logo'
            src='/img/logofull.webp'
            alt='PFI logo'
            // variants={logoVariant}
            // initial='initial'
            // animate='animate'
            // whileHover={{
            //   filter: 'invert(50%)',
            //   cursor: 'pointer',
            //   opacity: 0.5,
            //   scale: 1.05,
            // }}
            onClick={() => navigate('')}
            style={{
              // filter: 'invert(100%)',
              width: '70px',
              // transition: 'all 0.2s ease',
            }}
          />
        </Link>

        {/* Mobile Toggle */}
        <button
          className='navbar-toggler border-0'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNav'
          style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            borderRadius: '8px',
            padding: '8px 12px',
          }}
        >
          <span
            className='navbar-toggler-icon'
            style={{ filter: 'invert(1)' }}
          ></span>
        </button>

        <div className='collapse navbar-collapse' id='navbarNav'>
          <ul className='navbar-nav me-auto'>
            {isLoggedIn ? (
              <>
                {/* Applications Dropdown */}
                <li className='nav-item dropdown mx-2'>
                  <button
                    className='btn d-flex align-items-center gap-2 dropdown-toggle'
                    id='applicationsDropdown'
                    data-bs-toggle='dropdown'
                    style={{
                      background:
                        'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 16px',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <svg
                      width='18'
                      height='18'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Applications
                  </button>
                  <ul
                    className='dropdown-menu shadow-lg'
                    style={{
                      borderRadius: '16px',
                      padding: '8px',
                      minWidth: '280px',
                    }}
                  >
                    <li>
                      <Link
                        className='dropdown-item'
                        to='/applications'
                        style={{
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontWeight: '500',
                        }}
                      >
                        All Applications
                      </Link>
                    </li>
                    <div className='dropdown-divider my-1'></div>
                    <li>
                      <Link
                        className='dropdown-item'
                        to='/applications_active'
                        style={{
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontWeight: '500',
                        }}
                      >
                        Currently in Process
                      </Link>
                    </li>
                    <div className='dropdown-divider my-1'></div>
                    <li>
                      <Link
                        className='dropdown-item'
                        to='/applications_approved_notPaidOut'
                        style={{
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontWeight: '500',
                        }}
                      >
                        Fully Approved (Not Paid Out)
                      </Link>
                    </li>
                    <div className='dropdown-divider my-1'></div>
                    <li>
                      <Link
                        className='dropdown-item'
                        to='/applications_PaidOut_notSettled'
                        style={{
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontWeight: '500',
                        }}
                      >
                        Approved & Paid Out (Not Settled)
                      </Link>
                    </li>
                    <div className='dropdown-divider my-1'></div>
                    <li>
                      <Link
                        className='dropdown-item'
                        to='/applications_settled'
                        style={{
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontWeight: '500',
                        }}
                      >
                        Settled (Closed)
                      </Link>
                    </li>
                    <div className='dropdown-divider my-1'></div>
                    <li>
                      <Link
                        className='dropdown-item'
                        to='/applications_rejected'
                        style={{
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontWeight: '500',
                        }}
                      >
                        Rejected Applications
                      </Link>
                    </li>
                    <hr className='my-2' />
                    <li>
                      <Link
                        className='dropdown-item d-flex align-items-center gap-2'
                        to='/applications_global_search'
                        style={{
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontWeight: '500',
                          background:
                            'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                          color: '#1e40af',
                        }}
                      >
                        <TbWorldSearch size={18} />
                        Search
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Advancements Dropdown */}
                <li className='nav-item dropdown mx-2'>
                  <button
                    className='btn d-flex align-items-center gap-2 dropdown-toggle'
                    id='advancementsDropdown'
                    data-bs-toggle='dropdown'
                    style={{
                      background:
                        'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 16px',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <svg
                      width='18'
                      height='18'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z' />
                      <path
                        fillRule='evenodd'
                        d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.51-1.31c-.562-.649-1.413-1.076-2.353-1.253V5z'
                        clipRule='evenodd'
                      />
                    </svg>
                    Advancements
                  </button>
                  <ul
                    className='dropdown-menu shadow-lg'
                    style={{
                      borderRadius: '16px',
                      padding: '8px',
                      minWidth: '280px',
                    }}
                  >
                    <li>
                      <Link
                        className='dropdown-item'
                        to='/advancements'
                        style={{
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontWeight: '500',
                        }}
                      >
                        All Advancements
                      </Link>
                    </li>
                    <div className='dropdown-divider my-1'></div>
                    <li>
                      <Link
                        className='dropdown-item'
                        to='/advancements_active'
                        style={{
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontWeight: '500',
                        }}
                      >
                        Active Advancements
                      </Link>
                    </li>
                    <div className='dropdown-divider my-1'></div>
                    <li>
                      <Link
                        className='dropdown-item'
                        to='/advancements_paid_out'
                        style={{
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontWeight: '500',
                        }}
                      >
                        Paid Out Advancements
                      </Link>
                    </li>
                    <div className='dropdown-divider my-1'></div>
                    <li>
                      <Link
                        className='dropdown-item'
                        to='/advancements_settled'
                        style={{
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontWeight: '500',
                        }}
                      >
                        Settled Advancements
                      </Link>
                    </li>
                    <div className='dropdown-divider my-1'></div>
                    <li>
                      <Link
                        className='dropdown-item'
                        to='/not_committee_approved'
                        style={{
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontWeight: '500',
                        }}
                      >
                        Rejected By Committee
                      </Link>
                    </li>

                    {user &&
                      (user.is_superuser ||
                        (user.teams &&
                          user.teams.some(
                            (team) => team.name === 'finance'
                          ))) && (
                        <li>
                          <div className='dropdown-divider my-1'></div>
                          <Link
                            className='dropdown-item'
                            to='/advancements_notPaidOut'
                            style={{
                              borderRadius: '8px',
                              padding: '10px 12px',
                              fontWeight: '500',
                              background:
                                'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                              color: '#d97706',
                            }}
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
                          <div className='dropdown-divider my-1'></div>
                          <Link
                            className='dropdown-item'
                            to='/advancements_awaiting_approval'
                            style={{
                              borderRadius: '8px',
                              padding: '10px 12px',
                              fontWeight: '500',
                              background:
                                'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                              color: '#d97706',
                            }}
                          >
                            Awaiting committee approval
                          </Link>
                        </li>
                      )}
                    <hr className='my-2' />
                    <li>
                      <Link
                        className='dropdown-item d-flex align-items-center gap-2'
                        to='/advancements_global_search'
                        style={{
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontWeight: '500',
                          background:
                            'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                          color: '#1e40af',
                        }}
                      >
                        <TbWorldSearch size={18} />
                        Search
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Notifications Dropdown */}
                <li className='nav-item dropdown mx-2'>
                  <button
                    className='btn d-flex align-items-center gap-2 dropdown-toggle'
                    id='notificationsDropdown'
                    data-bs-toggle='dropdown'
                    style={{
                      background:
                        'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 16px',
                      fontWeight: '500',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <svg
                      width='18'
                      height='18'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z' />
                    </svg>
                    Notifications
                  </button>
                  <ul
                    className='dropdown-menu shadow-lg'
                    style={{
                      borderRadius: '16px',
                      padding: '8px',
                      minWidth: '200px',
                    }}
                  >
                    <li>
                      <Link
                        className='dropdown-item'
                        to='/notifications'
                        style={{
                          borderRadius: '8px',
                          padding: '10px 12px',
                          fontWeight: '500',
                        }}
                      >
                        All Notifications
                      </Link>
                    </li>
                  </ul>
                </li>
              </>
            ) : null}
          </ul>

          {isLoggedIn ? (
            <div className='d-flex ms-auto align-items-center gap-3'>
              {/* New Applications Indicator */}
              {newApplicationsIds && newApplicationsIds.length > 0 && (
                <div className='dropdown'>
                  <button
                    className='btn position-relative d-flex flex-column align-items-center justify-content-center'
                    type='button'
                    id='newApplicationsDropdown'
                    data-bs-toggle='dropdown'
                    style={{
                      background:
                        'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '8px 12px',
                      minWidth: '60px',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <span
                      className='position-absolute top-0 start-100 translate-middle badge rounded-pill'
                      style={{
                        background: '#fbbf24',
                        color: '#000000',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {newApplicationsIds.length}
                    </span>
                    <BiSolidLayerPlus size={24} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>
                      New
                    </span>
                  </button>

                  <ul
                    className='dropdown-menu dropdown-menu-end shadow-lg'
                    style={{
                      borderRadius: '16px',
                      padding: '8px',
                      minWidth: '320px',
                      maxHeight: '400px',
                      overflowY: 'auto',
                    }}
                  >
                    {newApplicationsIds.map((application) => (
                      <li
                        key={application.id}
                        className='dropdown-item-text p-0'
                      >
                        <div
                          className='d-flex justify-content-between align-items-center p-3 rounded-2 mb-2'
                          style={{
                            background:
                              'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
                            border: '1px solid #fca5a5',
                          }}
                        >
                          <div className='flex-grow-1'>
                            <div className='d-flex align-items-center gap-2 mb-1'>
                              <strong
                                style={{ color: '#dc2626', fontSize: '0.9rem' }}
                              >
                                ID:
                              </strong>
                              <span
                                className='text-decoration-underline fw-bold'
                                style={{
                                  cursor: 'pointer',
                                  color: '#1e40af',
                                  fontSize: '0.9rem',
                                }}
                                onClick={() =>
                                  navigate(`/applications/${application.id}`)
                                }
                              >
                                {application.id}
                              </span>
                              <span
                                className='px-2 py-1 rounded-2'
                                style={{
                                  background: '#dbeafe',
                                  color: '#1e40af',
                                  fontSize: '0.7rem',
                                }}
                              >
                                {application.user__country}
                              </span>
                            </div>
                            <div
                              style={{ fontSize: '0.8rem', color: '#6b7280' }}
                            >
                              <strong>Assigned to:</strong>{' '}
                              {application.assigned_to__email || (
                                <strong style={{ color: '#dc2626' }}>
                                  Unassigned
                                </strong>
                              )}
                            </div>
                          </div>
                          {(user?.is_superuser ||
                            user?.email === application.assigned_to__email) && (
                            <button
                              className='btn btn-sm d-flex align-items-center justify-content-center'
                              style={{
                                background:
                                  'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '8px',
                                width: '32px',
                                height: '32px',
                              }}
                              onClick={() => markNotNewHandler(application.id)}
                            >
                              <IoCheckmarkDoneSharp size={16} />
                            </button>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Email Dropdown */}
              <div className='dropdown'>
                <button
                  className='btn position-relative d-flex flex-column align-items-center justify-content-center'
                  type='button'
                  id='emailDropdown'
                  data-bs-toggle='dropdown'
                  style={{
                    background:
                      totalUnseenMessages === 0
                        ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
                        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    minWidth: '60px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  {totalUnseenMessages > 0 && (
                    <span
                      className='position-absolute top-0 start-100 translate-middle badge rounded-pill'
                      style={{
                        background: '#fbbf24',
                        color: '#000000',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                      }}
                    >
                      {totalUnseenMessages}
                    </span>
                  )}
                  <FaMailBulk size={24} />
                  <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>
                    Mail
                  </span>
                </button>
                <ul
                  className='dropdown-menu dropdown-menu-end shadow-lg'
                  style={{
                    borderRadius: '16px',
                    padding: '8px',
                    minWidth: '250px',
                  }}
                >
                  <li className='dropdown-item-text p-0'>
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

              {/* Management Button */}
              {user && user.is_superuser && (
                <button
                  className='btn d-flex flex-column align-items-center justify-content-center'
                  onClick={() => navigate('/userManagement')}
                  style={{
                    background:
                      'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '8px 12px',
                    minWidth: '80px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <MdManageAccounts size={24} />
                  <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>
                    Manage
                  </span>
                </button>
              )}

              {/* Logout Button */}
              <button
                className='btn d-flex align-items-center gap-2'
                onClick={handleLogout}
                style={{
                  background:
                    'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '10px 16px',
                  fontWeight: '500',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              >
                <RiLogoutCircleRLine size={20} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              className='btn d-flex align-items-center gap-2 ms-auto'
              to='/login'
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: '#ffffff',
                textDecoration: 'none',
                border: 'none',
                borderRadius: '12px',
                padding: '10px 16px',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              }}
            >
              <RiLoginCircleLine size={20} />
              Login
            </Link>
          )}
        </div>
      </nav>

      {/* User Welcome Section */}
      {user ? (
        <div
          className='d-flex justify-content-between align-items-center'
          style={{
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            padding: '12px 24px',
            borderBottom: '1px solid #bbf7d0',
          }}
        >
          <div
            className='d-flex align-items-center gap-3 cursor-pointer'
            onClick={viewUserProfileHandler}
            style={{
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '12px',
              padding: '8px 16px',
              border: '1px solid #86efac',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            data-bs-toggle='tooltip'
            title={user?.teams?.map((team) => team.name).join(', ')}
          >
            <div
              className='d-flex align-items-center justify-content-center rounded-2'
              style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                color: '#ffffff',
              }}
            >
              <svg
                width='16'
                height='16'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z'
                  clipRule='evenodd'
                />
              </svg>
            </div>
            <div>
              <div
                style={{
                  fontSize: '0.8rem',
                  color: '#15803d',
                  fontWeight: '600',
                }}
              >
                Welcome, {user.email}
              </div>
              <div style={{ fontSize: '0.7rem', color: '#16a34a' }}>
                Click to view profile
              </div>
            </div>
          </div>

          <div className='d-flex align-items-center'>
            <NotificationComponent
              showNotifications={showNotifications}
              setShowNotifications={setShowNotifications}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </div>
        </div>
      ) : null}

      {/* Notifications Dropdown */}
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
