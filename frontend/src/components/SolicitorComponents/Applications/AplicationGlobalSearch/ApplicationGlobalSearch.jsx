import React, { useState, useEffect } from 'react';
import GlobalSearchComponent from '../../../GenericComponents/GlobalSearchSharedComponents/GlobalSerchComponent';
import { fetchData } from '../../../GenericFunctions/AxiosGenericFunctions';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import SearchSummaryCard from '../../../GenericComponents/GlobalSearchSharedComponents/SearchSummaryCard';

const ApplicationGlobalSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [totalAmount, setTotalAmount] = useState(0);
  const [allApplications, setAllApplications] = useState([]);
  const [totalAllApplicationsAmount, setTotalAllApplicationsAmount] =
    useState(0);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [solicitors, setSolicitors] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  // Define the endpoint and search parameters
  const searchConfig = {
    endpoint: '/api/applications/agent_applications/search-applications/', // The search endpoint
    searchFields: {
      id: { type: 'number', label: 'Application ID' },
      amount: { type: 'range', label: 'Amount' },
      term: { type: 'range', label: 'Term' },
      approved: { type: 'boolean', label: 'Approved' },
      is_rejected: { type: 'boolean', label: 'Rejected' },
      date_submitted: {
        type: 'date_range',
        label: 'Date Submitted Range',
      }, // Single date range input
      user_id: { type: 'select', label: 'User', options: users },
      solicitor_id: { type: 'select', label: 'Solicitor', options: solicitors },
      assigned_to_id: {
        type: 'select',
        label: 'Assigned To',
        options: assignedTo,
      },
    },
  };

  // UseEffect for getting all applications for comparison
  useEffect(() => {
    const handleGetAllApplications = async () => {
      setLoading(true);
      try {
        const response = await fetchData('token', `${searchConfig.endpoint}`);
        setAllApplications(response.data);
        // Calculate the total amount for all applications
        const totalAmountAllApps = response.data.reduce(
          (acc, app) => acc + (parseFloat(app.amount) || 0),
          0
        );
        setTotalAllApplicationsAmount(totalAmountAllApps);
      } catch (error) {
        console.error('Error fetching all applications:', error);
      }
      setLoading(false);
    };

    if (searchConfig.endpoint) {
      handleGetAllApplications();
    }
  }, [searchConfig.endpoint]);

  // Fetch users, solicitors, applicants, and assignedTo
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const usersResponse = await fetchData('token', '/api/user/solicitors/');
        setUsers(usersResponse.data);

        const solicitorsResponse = await fetchData(
          'token',
          '/api/applications/solicitors/'
        );
        setSolicitors(solicitorsResponse.data);

        const assignedToResponse = await fetchData('token', '/api/user/');
        const activeStaffUsers = assignedToResponse.data.filter(
          (x) => x.is_staff === true && x.is_active === true
        );

        setAssignedTo(activeStaffUsers);
      } catch (error) {
        console.error('Error fetching dropdown data:', error);
      }
    };

    fetchDropdownData();
  }, []);

  // Calculate total amount whenever search results are updated
  useEffect(() => {
    const total = searchResults.reduce(
      (acc, result) => acc + (parseFloat(result.amount) || 0),
      0
    );
    setTotalAmount(total);
  }, [searchResults]);

  // Handle search results
  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  // Function to format the amount in euros
  const formatAmount = (amount) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  };

  // Function to calculate percentage
  const calculatePercentage = (part, total) => {
    if (total === 0) return '0%';
    return `${((part / total) * 100).toFixed(2)}%`;
  };

  // Function to sort the data
  const sortData = (field) => {
    console.log(field);
    const order = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);

    const sortedResults = [...searchResults].sort((a, b) => {
      let valueA = a;
      let valueB = b;

      // Support nested fields like 'user.name'
      field.split('.').forEach((key) => {
        valueA = valueA[key];
        valueB = valueB[key];
      });

      // Parse float if the field is numeric
      if (field === 'amount' || field === 'id') {
        valueA = parseFloat(valueA) || 0;
        valueB = parseFloat(valueB) || 0;
      }

      if (order === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });

    setSearchResults(sortedResults);
  };

  // Helper function to get the sorting icon
  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === 'asc' ? '▲' : '▼';
    }
    return '';
  };

  // Handle row expansion
  const toggleRowExpansion = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Recursive function to render nested data
  const renderNestedData = (data, level = 0) => {
    return Object.entries(data).map(([key, value]) => (
      <div key={key} style={{ paddingLeft: `${level * 20}px` }}>
        <strong>{key}:</strong>{' '}
        {typeof value === 'object' && value !== null ? (
          <div>{renderNestedData(value, level + 1)}</div>
        ) : (
          <span>{value?.toString() || 'N/A'}</span>
        )}
      </div>
    ));
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className='container'>
      <h1 className='text-center my-3'>Search Applications</h1>
      <GlobalSearchComponent
        config={searchConfig}
        onSearchResults={handleSearchResults}
        setExpandedRows={setExpandedRows}
        setSearchResults={setSearchResults}
      />

      {/* General Information Card */}
      {searchResults.length > 0 && (
        <SearchSummaryCard
          allItems={allApplications}
          searchedItems={searchResults}
          totalAllItemsAmount={totalAllApplicationsAmount}
          totalAllItemsAmountWithFees={0}
          totalSearchedItemsAmount={totalAmount}
          totalSearchedItemsAmountWithFees={0}
          formatAmount={formatAmount}
          calculatePercentage={calculatePercentage}
        />
      )}

      {/* Search Results Table */}
      <div className='my-4'>
        <h2>Search Results</h2>
        {searchResults.length > 0 ? (
          <table className='table table-bordered table-striped  table-sm table-hover'>
            <thead className='thead-dark'>
              <tr className=' py-0'>
                <th
                  style={{ cursor: 'pointer' }}
                  onClick={() => sortData('id')}
                >
                  App ID {getSortIcon('id')}
                </th>

                <th
                  style={{ cursor: 'pointer' }}
                  onClick={() => sortData('amount')}
                >
                  Amount {getSortIcon('amount')}
                </th>
                <th
                  style={{ cursor: 'pointer' }}
                  onClick={() => sortData('user.name')}
                >
                  User Name {getSortIcon('user.name')}
                </th>
                <th
                  style={{ cursor: 'pointer' }}
                  onClick={() => sortData('user.country')}
                >
                  Country {getSortIcon('user.country')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result) => (
                <React.Fragment key={result.id}>
                  <tr>
                    <td className=' py-0'>{result.id}</td>

                    <td className=' py-0 '>{formatAmount(result.amount)}</td>
                    <td className=' py-0 '>{result.user?.name || 'N/A'}</td>
                    <td className=' py-0'>{result.user?.country}</td>
                    <td className=' py-0'>
                      <button
                        className='btn btn-link'
                        onClick={() => toggleRowExpansion(result.id)}
                      >
                        {expandedRows[result.id]
                          ? 'Hide Details'
                          : 'Show Details'}
                      </button>
                    </td>
                  </tr>
                  {expandedRows[result.id] && (
                    <tr>
                      <td colSpan='4'>
                        <div className='p-3 border'>
                          {renderNestedData(result)}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No results found</p>
        )}
      </div>
    </div>
  );
};

export default ApplicationGlobalSearch;
