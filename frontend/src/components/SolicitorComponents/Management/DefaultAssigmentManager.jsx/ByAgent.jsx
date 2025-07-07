import Cookies from 'js-cookie';
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Building,
  CheckCircle2,
  DollarSign,
  Edit3,
  FileText,
  Globe,
  Loader2,
  Mail,
  Save,
  Trash2,
  User,
  Users,
  XCircle,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  deleteData,
  fetchData,
  patchData,
  postData,
} from '../../../GenericFunctions/AxiosGenericFunctions';
import renderErrors, {
  displayUserTeams,
} from '../../../GenericFunctions/HelperGenericFunctions';

const ByAgent = () => {
  const token = Cookies.get('auth_token_agents');
  const [assignments, setAssignments] = useState([]);
  const [assignmentsWithNotAssigned, setAssignmentsWithNotAssigned] = useState(
    []
  );
  const [sortBy, setSortBy] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');
  const [editMode, setEditMode] = useState(false);
  const [editModeIndex, setEditModeIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState('');
  const [staffUsers, setStaffUsers] = useState([]);
  const [nonStaffUsers, setNonStaffUsers] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [
    overwritExistingApplicationsAssignedSolicitor,
    setOverwritExistingApplicationsAssignedSolicitor,
  ] = useState(false);
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [currentEditingItem, setCurrentEditingItem] = useState(null);

  // Modern styles matching the design system
  const styles = {
    container: {
      position: 'relative',
      padding: '1.5rem',
    },
    tableCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '1rem',
      boxShadow: '0 8px 32px rgba(139, 92, 246, 0.1)',
      overflow: 'hidden',
    },
    tableHeader: {
      background:
        'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
      borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
    },
    sortableHeader: {
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '1rem',
      fontWeight: '600',
      color: 'white',
    },
    tableRow: {
      borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
      transition: 'all 0.3s ease',
    },
    tableCell: {
      padding: '1rem',
      verticalAlign: 'middle',
      color: 'rgba(255, 255, 255, 0.9)',
    },
    notAssignedRow: {
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      border: '1px solid rgba(245, 158, 11, 0.3)',
    },
    inactiveRow: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    editMode: {
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
    },
    select: {
      backgroundColor: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '0.5rem',
      color: 'white',
      padding: '0.5rem',
      fontSize: '0.875rem',
      width: '100%',
    },
    actionButton: {
      background: 'none',
      border: 'none',
      borderRadius: '0.5rem',
      padding: '0.5rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    editButton: {
      color: '#f59e0b',
      '&:hover': {
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
      },
    },
    saveButton: {
      color: '#10b981',
      '&:hover': {
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
      },
    },
    deleteButton: {
      color: '#ef4444',
      '&:hover': {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
      },
    },
    statusBadge: {
      padding: '0.25rem 0.5rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontWeight: '500',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.25rem',
    },
    activeBadge: {
      backgroundColor: 'rgba(16, 185, 129, 0.2)',
      color: '#a7f3d0',
      border: '1px solid rgba(16, 185, 129, 0.3)',
    },
    inactiveBadge: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      color: '#fca5a5',
      border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    notAssignedBadge: {
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      color: '#fbbf24',
      border: '1px solid rgba(245, 158, 11, 0.3)',
    },
    checkboxCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '0.5rem',
      padding: '0.75rem',
      marginTop: '0.5rem',
    },
    statsCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.2)',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem',
    },
    errorAlert: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      borderRadius: '0.5rem',
      color: '#fca5a5',
      padding: '1rem',
      marginTop: '1rem',
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
      zIndex: 1050,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '1rem',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
      width: '90%',
      maxWidth: '500px',
      maxHeight: '80vh',
      overflow: 'hidden',
    },
    modalHeader: {
      background:
        'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
      borderBottom: '1px solid rgba(139, 92, 246, 0.3)',
      padding: '1.5rem',
    },
    modalBody: {
      padding: '1.5rem',
      maxHeight: '400px',
      overflowY: 'auto',
    },
    staffCard: {
      backgroundColor: 'rgba(30, 41, 59, 0.5)',
      border: '1px solid rgba(139, 92, 246, 0.3)',
      borderRadius: '0.75rem',
      padding: '1rem',
      marginBottom: '0.75rem',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    selectedStaffCard: {
      backgroundColor: 'rgba(139, 92, 246, 0.2)',
      border: '1px solid rgba(139, 92, 246, 0.5)',
      boxShadow: '0 0 0 2px rgba(139, 92, 246, 0.3)',
    },
    staffAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '1rem',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
    },
    modalButton: {
      background: 'linear-gradient(90deg, #8b5cf6 0%, #a855f7 100%)',
      border: 'none',
      borderRadius: '0.5rem',
      color: 'white',
      padding: '0.75rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
    },
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      if (token) {
        const endpoint = '/api/assignments/assignments/';
        const response = await fetchData(token, endpoint);

        if (response.status === 200) {
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

  const handleSort = (column) => {
    setEditMode(false);
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

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
    if (!editMode) {
      const item = assignmentsWithNotAssigned.find((x) => x.id === i);
      setCurrentEditingItem(item);
      setSelectedAgent(item.staff_user?.id || null);
      setShowStaffModal(true);
    }
  };

  useEffect(() => {
    if (nonStaffUsers && assignments) {
      const agencies_with_no_default_assigments = nonStaffUsers.filter(
        (obj) =>
          !assignments.some((item) => item.agency_user.email === obj.email)
      );

      const agencies_with_no_default_assigments_obj =
        agencies_with_no_default_assigments.map((item) => ({
          staff_user: null,
          id: `${Date.now()}-${Math.random()}`,
          agency_user: {
            ...item,
          },
        }));

      const uniqueAssignments = agencies_with_no_default_assigments_obj.filter(
        (newAssignment) =>
          !assignmentsWithNotAssigned.some(
            (existingAssignment) =>
              existingAssignment.agency_user.id === newAssignment.agency_user.id
          )
      );

      setAssignmentsWithNotAssigned((prevAssignments) => [
        ...prevAssignments,
        ...uniqueAssignments,
      ]);
    }
  }, [assignments, nonStaffUsers]);

  const handleAgentChange = (staffId) => {
    setSelectedAgent(staffId);
  };

  const handleModalSave = () => {
    setShowStaffModal(false);
    if (currentEditingItem) {
      saveOrUpdateAssigmentHandler(currentEditingItem.id);
    }
  };

  const handleModalCancel = () => {
    setShowStaffModal(false);
    setEditMode(false);
    setEditModeIndex(null);
    setSelectedAgent(null);
    setCurrentEditingItem(null);
  };

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
          const endpoint = `/api/assignments/assignments/?overwrite_existing_applications_assigned_solicitor=${overwritExistingApplicationsAssignedSolicitor}`;
          const response = await postData(token, endpoint, newAssigmentObj);

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

  const getAssignmentStats = () => {
    const total = sortedAssignments.length;
    const assigned = sortedAssignments.filter((item) => item.staff_user).length;
    const unassigned = total - assigned;
    const inactive = sortedAssignments.filter(
      (item) => item.staff_user && !item.staff_user.is_active
    ).length;

    return { total, assigned, unassigned, inactive };
  };

  const stats = getAssignmentStats();

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div className='text-center py-5'>
          <Loader2 className='text-primary mb-3 spinner-border' size={32} />
          <div className='text-white'>Loading assignment data...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Stats Overview */}
      <div className='row g-3 mb-4'>
        <div className='col-md-3'>
          <div style={styles.statsCard}>
            <div className='d-flex align-items-center'>
              <Users size={20} className='text-primary me-2' />
              <div>
                <div className='text-muted small'>Total Assignments</div>
                <div className='text-white fw-bold fs-5'>{stats.total}</div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-3'>
          <div style={styles.statsCard}>
            <div className='d-flex align-items-center'>
              <CheckCircle2 size={20} className='text-success me-2' />
              <div>
                <div className='text-muted small'>Assigned</div>
                <div className='text-white fw-bold fs-5'>{stats.assigned}</div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-3'>
          <div style={styles.statsCard}>
            <div className='d-flex align-items-center'>
              <AlertTriangle size={20} className='text-warning me-2' />
              <div>
                <div className='text-muted small'>Unassigned</div>
                <div className='text-white fw-bold fs-5'>
                  {stats.unassigned}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-3'>
          <div style={styles.statsCard}>
            <div className='d-flex align-items-center'>
              <XCircle size={20} className='text-danger me-2' />
              <div>
                <div className='text-muted small'>Inactive</div>
                <div className='text-white fw-bold fs-5'>{stats.inactive}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div style={styles.tableCard}>
        <div style={styles.tableHeader} className='p-3'>
          <h4 className='text-white mb-0 fw-bold d-flex align-items-center'>
            <Building size={20} className='me-2' />
            Assignment Matrix
          </h4>
          <p className='text-muted small mb-0 mt-1'>
            Manage agent-solicitor assignments
          </p>
        </div>

        <div className='table-responsive'>
          <table
            className='table table-dark mb-0'
            style={{ fontSize: '0.875rem' }}
          >
            <thead>
              <tr style={styles.tableHeader}>
                <th style={{ minWidth: '200px' }}>
                  <div
                    style={{
                      ...styles.sortableHeader,
                      padding: '0.75rem 0.5rem',
                    }}
                    onClick={() => handleSort('staff_user')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(139, 92, 246, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <User size={14} />
                    <span className='d-none d-md-inline'>Agent</span>
                    <span className='d-md-none'>Staff</span>
                    {sortBy === 'staff_user' &&
                      (sortDirection === 'asc' ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      ))}
                  </div>
                </th>
                <th style={{ minWidth: '250px' }}>
                  <div
                    style={{
                      ...styles.sortableHeader,
                      padding: '0.75rem 0.5rem',
                    }}
                    onClick={() => handleSort('agency_name')}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(139, 92, 246, 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <Building size={14} />
                    <span className='d-none d-lg-inline'>Solicitor Firm</span>
                    <span className='d-lg-none'>Firm</span>
                    {sortBy === 'agency_name' &&
                      (sortDirection === 'asc' ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      ))}
                  </div>
                </th>
                <th
                  style={{
                    ...styles.sortableHeader,
                    cursor: 'default',
                    padding: '0.75rem 0.5rem',
                    minWidth: '80px',
                  }}
                >
                  <Edit3 size={14} />
                  <span className='d-none d-md-inline ms-1'>Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedAssignments.map((item, index) => {
                const isEditing = editMode && item.id === editModeIndex;
                const isNotAssigned = !item.staff_user;
                const isInactive =
                  item.staff_user && !item.staff_user.is_active;

                let rowStyles = { ...styles.tableRow };
                if (isEditing) rowStyles = { ...rowStyles, ...styles.editMode };
                else if (isNotAssigned)
                  rowStyles = { ...rowStyles, ...styles.notAssignedRow };
                else if (isInactive)
                  rowStyles = { ...rowStyles, ...styles.inactiveRow };

                return (
                  <tr
                    key={index}
                    style={rowStyles}
                    onMouseEnter={(e) => {
                      if (!isEditing) {
                        e.currentTarget.style.backgroundColor =
                          'rgba(139, 92, 246, 0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isEditing) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {/* Agent Column */}
                    <td
                      style={{ ...styles.tableCell, padding: '0.75rem 0.5rem' }}
                    >
                      {isEditing ? (
                        <div>
                          <div
                            style={{
                              backgroundColor: 'rgba(139, 92, 246, 0.1)',
                              border: '1px solid rgba(139, 92, 246, 0.3)',
                              borderRadius: '0.5rem',
                              padding: '0.75rem',
                              cursor: 'pointer',
                              transition: 'all 0.3s ease',
                            }}
                            onClick={() => setShowStaffModal(true)}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor =
                                'rgba(139, 92, 246, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor =
                                'rgba(139, 92, 246, 0.1)';
                            }}
                          >
                            <div className='d-flex align-items-center justify-content-between'>
                              <div>
                                {selectedAgent ? (
                                  <div>
                                    <div
                                      className='text-white fw-medium'
                                      style={{ fontSize: '0.8rem' }}
                                    >
                                      {staffUsers
                                        .find((u) => u.id == selectedAgent)
                                        ?.email?.substring(0, 20)}
                                      ...
                                    </div>
                                    <div
                                      className='small text-success'
                                      style={{ fontSize: '0.7rem' }}
                                    >
                                      Selected
                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    <div
                                      className='text-white fw-medium'
                                      style={{ fontSize: '0.8rem' }}
                                    >
                                      Select Staff Member
                                    </div>
                                    <div
                                      className='small text-muted'
                                      style={{ fontSize: '0.7rem' }}
                                    >
                                      Click to choose
                                    </div>
                                  </div>
                                )}
                              </div>
                              <Users size={16} className='text-primary' />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className='mb-1'>
                            {isNotAssigned ? (
                              <div
                                style={{
                                  ...styles.notAssignedBadge,
                                  fontSize: '0.7rem',
                                  padding: '0.2rem 0.4rem',
                                }}
                              >
                                <AlertTriangle size={10} />
                                <span className='d-none d-md-inline ms-1'>
                                  Not Assigned
                                </span>
                                <span className='d-md-none ms-1'>N/A</span>
                              </div>
                            ) : (
                              <div>
                                <div
                                  className='text-white fw-medium'
                                  style={{ fontSize: '0.8rem' }}
                                >
                                  {item.staff_user?.email?.length > 25
                                    ? item.staff_user.email.substring(0, 25) +
                                      '...'
                                    : item.staff_user?.email}
                                </div>
                                {item.staff_user &&
                                  displayUserTeams(item.staff_user) && (
                                    <div
                                      className='small text-muted d-none d-lg-block'
                                      style={{ fontSize: '0.7rem' }}
                                    >
                                      {displayUserTeams(item.staff_user)}
                                    </div>
                                  )}
                              </div>
                            )}
                          </div>
                          {isInactive && (
                            <div
                              style={{
                                ...styles.inactiveBadge,
                                fontSize: '0.7rem',
                                padding: '0.1rem 0.3rem',
                              }}
                            >
                              <XCircle size={10} />
                              <span className='d-none d-md-inline ms-1'>
                                NOT ACTIVE
                              </span>
                              <span className='d-md-none ms-1'>OFF</span>
                            </div>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Solicitor Firm Column (Email + Details) */}
                    <td
                      style={{ ...styles.tableCell, padding: '0.75rem 0.5rem' }}
                    >
                      <div>
                        {/* Firm Name */}
                        <div className='d-flex align-items-center mb-2'>
                          <Building
                            size={12}
                            className='text-muted me-1 d-none d-md-inline'
                          />
                          <span
                            className={
                              !item.agency_user?.is_active
                                ? 'text-danger fw-medium'
                                : 'text-white fw-medium'
                            }
                            style={{ fontSize: '0.85rem' }}
                            title={item.agency_user?.name}
                          >
                            {item.agency_user?.name?.length > 25
                              ? item.agency_user.name.substring(0, 25) + '...'
                              : item.agency_user?.name || 'N/A'}
                          </span>
                        </div>

                        {/* Email */}
                        <div className='d-flex align-items-center mb-1'>
                          <Mail size={12} className='text-muted me-1' />
                          <span
                            className={
                              !item.agency_user?.is_active
                                ? 'text-danger'
                                : 'text-muted'
                            }
                            style={{ fontSize: '0.75rem' }}
                            title={item.agency_user?.email}
                          >
                            {item.agency_user?.email?.length > 30
                              ? item.agency_user.email.substring(0, 30) + '...'
                              : item.agency_user?.email || 'N/A'}
                          </span>
                        </div>

                        {/* Country */}
                        <div className='d-flex align-items-center mb-1 d-none d-lg-block'>
                          <Globe size={10} className='text-muted me-1' />
                          <span
                            className='text-muted'
                            style={{ fontSize: '0.7rem' }}
                          >
                            {item.agency_user?.country}
                          </span>
                        </div>

                        {/* Application/Advancement Counts */}
                        <div className='d-flex gap-3 d-none d-xl-block'>
                          {item.agency_user?.applications_owed_len !==
                            undefined && (
                            <div
                              className='d-flex align-items-center mb-1'
                              style={{ fontSize: '0.7rem' }}
                            >
                              <FileText size={10} className='text-info me-1' />
                              <span className='text-info'>
                                Apps: {item.agency_user.applications_owed_len}
                              </span>
                            </div>
                          )}

                          {item.agency_user?.advancements_owed_len !==
                            undefined && (
                            <div
                              className='d-flex align-items-center'
                              style={{ fontSize: '0.7rem' }}
                            >
                              <DollarSign
                                size={10}
                                className='text-success me-1'
                              />
                              <span className='text-success'>
                                Adv: {item.agency_user.advancements_owed_len}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Status Badges */}
                        {!item.agency_user?.is_active && (
                          <div
                            style={{
                              ...styles.inactiveBadge,
                              fontSize: '0.7rem',
                              padding: '0.1rem 0.3rem',
                            }}
                            className='mt-2'
                          >
                            <XCircle size={10} />
                            <span className='d-none d-md-inline ms-1'>
                              NOT ACTIVATED
                            </span>
                            <span className='d-md-none ms-1'>OFF</span>
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions Column */}
                    <td
                      style={{ ...styles.tableCell, padding: '0.75rem 0.5rem' }}
                    >
                      <div className='d-flex gap-1'>
                        {!isEditing ? (
                          <>
                            <button
                              style={{
                                ...styles.actionButton,
                                color: '#f59e0b',
                                padding: '0.4rem',
                              }}
                              onClick={() => editModeToggle(item.id)}
                              onMouseEnter={(e) => {
                                e.target.style.backgroundColor =
                                  'rgba(245, 158, 11, 0.2)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.backgroundColor = 'transparent';
                              }}
                              title='Edit Assignment'
                            >
                              <Edit3 size={16} />
                            </button>
                            {item.staff_user && (
                              <button
                                style={{
                                  ...styles.actionButton,
                                  color: '#ef4444',
                                  padding: '0.4rem',
                                }}
                                onClick={() => {
                                  if (
                                    window.confirm('Delete this assignment?')
                                  ) {
                                    deleteAssigmentHandler(item.id);
                                  }
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.backgroundColor =
                                    'rgba(239, 68, 68, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.backgroundColor =
                                    'transparent';
                                }}
                                title='Delete Assignment'
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            style={{
                              ...styles.actionButton,
                              color: '#10b981',
                              padding: '0.4rem',
                            }}
                            onClick={() => handleModalSave()}
                            onMouseEnter={(e) => {
                              e.target.style.backgroundColor =
                                'rgba(16, 185, 129, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.backgroundColor = 'transparent';
                            }}
                            title='Save Changes'
                          >
                            <Save size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Selection Modal */}
      {showStaffModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            {/* Modal Header */}
            <div style={styles.modalHeader}>
              <div className='d-flex align-items-center justify-content-between'>
                <div>
                  <h4 className='text-white mb-1 fw-bold d-flex align-items-center'>
                    <Users size={20} className='me-2' />
                    Select Staff Member
                  </h4>
                  <p className='text-muted small mb-0'>
                    Choose an agent for{' '}
                    {currentEditingItem?.agency_user?.name || 'this solicitor'}
                  </p>
                </div>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    padding: '0.5rem',
                  }}
                  onClick={handleModalCancel}
                >
                  <XCircle size={24} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div style={styles.modalBody}>
              {/* Search/Filter could go here in the future */}
              <div className='mb-3'>
                <div className='small text-muted mb-2'>
                  Available Staff Members ({staffUsers.length})
                </div>
              </div>

              {/* Staff List */}
              <div>
                {staffUsers.map((user) => (
                  <div
                    key={user.id}
                    style={{
                      ...styles.staffCard,
                      ...(selectedAgent == user.id
                        ? styles.selectedStaffCard
                        : {}),
                    }}
                    onClick={() => handleAgentChange(user.id)}
                    onMouseEnter={(e) => {
                      if (selectedAgent != user.id) {
                        e.currentTarget.style.backgroundColor =
                          'rgba(139, 92, 246, 0.1)';
                        e.currentTarget.style.borderColor =
                          'rgba(139, 92, 246, 0.4)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedAgent != user.id) {
                        e.currentTarget.style.backgroundColor =
                          'rgba(30, 41, 59, 0.5)';
                        e.currentTarget.style.borderColor =
                          'rgba(139, 92, 246, 0.3)';
                      }
                    }}
                  >
                    <div className='d-flex align-items-center'>
                      <div style={styles.staffAvatar}>
                        <User className='text-white' size={20} />
                      </div>
                      <div className='flex-grow-1'>
                        <div className='text-white fw-medium mb-1'>
                          {user.email}
                        </div>
                        {displayUserTeams(user) && (
                          <div className='small text-muted d-flex align-items-center'>
                            <Shield size={12} className='me-1' />
                            {displayUserTeams(user)}
                          </div>
                        )}
                        <div className='small text-success d-flex align-items-center mt-1'>
                          <CheckCircle2 size={12} className='me-1' />
                          Active Staff Member
                        </div>
                      </div>
                      {selectedAgent == user.id && (
                        <div className='ms-2'>
                          <CheckCircle2 size={20} className='text-success' />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Overwrite Option */}
              <div
                style={{
                  backgroundColor: 'rgba(30, 41, 59, 0.5)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  marginTop: '1rem',
                }}
              >
                <div className='form-check'>
                  <input
                    type='checkbox'
                    id='modalOverwriteCheckbox'
                    className='form-check-input'
                    checked={overwritExistingApplicationsAssignedSolicitor}
                    onChange={() =>
                      setOverwritExistingApplicationsAssignedSolicitor(
                        !overwritExistingApplicationsAssignedSolicitor
                      )
                    }
                  />
                  <label
                    htmlFor='modalOverwriteCheckbox'
                    className='form-check-label text-light'
                  >
                    <div className='fw-medium'>
                      Overwrite Existing Assignments
                    </div>
                    <div className='small text-muted mt-1'>
                      This will reassign all existing applications from this
                      solicitor to the selected agent
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                padding: '1.5rem',
                borderTop: '1px solid rgba(139, 92, 246, 0.2)',
              }}
            >
              <div className='d-flex gap-3'>
                <button
                  className='btn btn-secondary flex-fill'
                  onClick={handleModalCancel}
                >
                  Cancel
                </button>
                <button
                  style={styles.modalButton}
                  className='flex-fill'
                  onClick={handleModalSave}
                  disabled={!selectedAgent}
                  onMouseEnter={(e) => {
                    if (selectedAgent) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow =
                        '0 6px 16px rgba(139, 92, 246, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow =
                      '0 4px 12px rgba(139, 92, 246, 0.3)';
                  }}
                >
                  <Save size={16} />
                  Assign Staff Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {errors && (
        <div style={styles.errorAlert}>
          <div className='d-flex align-items-center mb-2'>
            <AlertTriangle size={16} className='me-2' />
            <span className='fw-medium'>Error Occurred</span>
          </div>
          <div>{renderErrors(errors)}</div>
        </div>
      )}
    </div>
  );
};

export default ByAgent;
