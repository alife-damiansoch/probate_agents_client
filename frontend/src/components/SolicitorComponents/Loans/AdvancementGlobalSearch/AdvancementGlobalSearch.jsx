import { useState, useEffect, Fragment } from 'react';
import GlobalSearchComponent from '../../../GenericComponents/GlobalSearchSharedComponents/GlobalSerchComponent';
import { fetchData } from '../../../GenericFunctions/AxiosGenericFunctions';
import LoadingComponent from '../../../GenericComponents/LoadingComponent';
import SearchSummaryCard from '../../../GenericComponents/GlobalSearchSharedComponents/SearchSummaryCard';
import { formatDate } from '../../../GenericFunctions/HelperGenericFunctions';

const AdvancementGlobalSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsIe, setSearchResultsIe] = useState([]);
  const [searchResultsUk, setSearchResultsUk] = useState([]);

  const [totalAmountAgreed, setTotalAmountAgreed] = useState(0);
  const [totalAmountAgreedIe, setTotalAmountAgreedIe] = useState(0);
  const [totalAmountAgreedUk, setTotalAmountAgreedUk] = useState(0);

  const [totalAmountAgreedWithFees, setTotalAmountAgreedWithFees] = useState(0);
  const [totalAmountAgreedWithFeesIe, setTotalAmountAgreedWithFeesIe] =
    useState(0);
  const [totalAmountAgreedWithFeesUk, setTotalAmountAgreedWithFeesUk] =
    useState(0);

  const [allLoans, setAllLoans] = useState([]);
  const [ieLoans, setIeLoans] = useState([]);
  const [ukLoans, setUkLoans] = useState([]);

  const [totalAllLoansAmountAgreed, setTotalAllLoansAmountAgreed] = useState(0);
  const [totalAllLoansAmountAgreedIe, setTotalAllLoansAmountAgreedIe] =
    useState(0);
  const [totalAllLoansAmountAgreedUk, setTotalAllLoansAmountAgreedUk] =
    useState(0);

  const [
    totalAllLoansAmountAgreedWithFees,
    setTotalAllLoansAmountAgreedWithFees,
  ] = useState(0);
  const [
    totalAllLoansAmountAgreedWithFeesIe,
    setTotalAllLoansAmountAgreedWithFeesIe,
  ] = useState(0);
  const [
    totalAllLoansAmountAgreedWithFeesUk,
    setTotalAllLoansAmountAgreedWithFeesUk,
  ] = useState(0);

  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [solicitors, setSolicitors] = useState([]);
  const [assignedTo, setAssignedTo] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});

  // Define the endpoint and search parameters
  const searchConfig = {
    endpoint: '/api/loans/loans/search-advanced-loans/', // The search endpoint for advanced loans
    searchFields: {
      id: { type: 'number', label: 'Advancement ID' },
      amount_agreed: { type: 'range', label: 'Agreed Amount' },
      fee_agreed: { type: 'range', label: 'Agreed Fee' },
      term_agreed: { type: 'range', label: 'Agreed Term' },
      is_settled: { type: 'boolean', label: 'Settled' },
      settled_date: { type: 'date_range', label: 'Settled Date Range' },
      is_paid_out: { type: 'boolean', label: 'Paid Out' },
      paid_out_date: { type: 'date_range', label: 'Paid Out Date Range' },
      maturity_date: { type: 'date_range', label: 'Maturity Date Range' },
      extension_fees_gt_zero: { type: 'boolean', label: 'Extension Fees > 0' },
      application_user_id: { type: 'select', label: 'User', options: users },
      application_solicitor_id: {
        type: 'select',
        label: 'Solicitor',
        options: solicitors,
      },
      application_assigned_to_id: {
        type: 'select',
        label: 'Assigned To',
        options: assignedTo,
      },
      current_balance: { type: 'range', label: 'Current Balance' },

      // New fields for committee approval
      needs_committee_approval: {
        type: 'boolean',
        label: 'Needs Committee Approval',
      },
      is_committee_approved: {
        type: 'nullable_boolean',
        label: 'Committee Approval Status',
      }, // Use a nullable boolean type
    },
  };

  // Fetch users, solicitors, and assignedTo data for dropdowns
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

  // UseEffect for getting all loans for comparison
  useEffect(() => {
    const handleGetAllLoans = async () => {
      setLoading(true);
      try {
        const response = await fetchData('token', `${searchConfig.endpoint}`);
        setAllLoans(response.data);

        // Filter loans based on the country
        const ieLoans = response.data.filter(
          (loan) => loan.application_details?.user?.country === 'IE'
        );
        console.log('IE Loans: ', ieLoans);
        const ukLoans = response.data.filter(
          (loan) => loan.application_details?.user?.country === 'UK'
        );
        console.log('UK Loans: ', ukLoans);
        setIeLoans(ieLoans);
        setUkLoans(ukLoans);

        // Calculate the total amount for all loans
        const totalAmountAllLoans = response.data.reduce(
          (acc, loan) => acc + (parseFloat(loan.amount_agreed) || 0),
          0
        );
        setTotalAllLoansAmountAgreed(totalAmountAllLoans);
        // Calculate the total amount for all loans in IE
        const totalAmountAllLoansIe = ieLoans.reduce(
          (acc, loan) => acc + (parseFloat(loan.amount_agreed) || 0),
          0
        );
        setTotalAllLoansAmountAgreedIe(totalAmountAllLoansIe);
        // Calculate the total amount for all loans in UK
        const totalAmountAllLoansUk = ukLoans.reduce(
          (acc, loan) => acc + (parseFloat(loan.amount_agreed) || 0),
          0
        );
        setTotalAllLoansAmountAgreedUk(totalAmountAllLoansUk);

        // Calculate the total amount for all loans with all fees
        const totalAmountAllLoansWithFees = response.data.reduce(
          (acc, loan) => acc + (parseFloat(loan.current_balance) || 0),
          0
        );
        setTotalAllLoansAmountAgreedWithFees(totalAmountAllLoansWithFees);
        // Calculate the total amount for all loans in IE with all fees
        const totalAmountAllLoansWithFeesIe = ieLoans.reduce(
          (acc, loan) => acc + (parseFloat(loan.current_balance) || 0),
          0
        );
        setTotalAllLoansAmountAgreedWithFeesIe(totalAmountAllLoansWithFeesIe);
        // Calculate the total amount for all loans in UK with all fees
        const totalAmountAllLoansWithFeesUk = ukLoans.reduce(
          (acc, loan) => acc + (parseFloat(loan.current_balance) || 0),
          0
        );
        setTotalAllLoansAmountAgreedWithFeesUk(totalAmountAllLoansWithFeesUk);
      } catch (error) {
        console.error('Error fetching all loans:', error);
      }
      setLoading(false);
    };

    if (searchConfig.endpoint) {
      handleGetAllLoans();
    }
  }, [searchConfig.endpoint]);

  // Calculate total amount whenever search results are updated
  useEffect(() => {
    if (searchResults) {
      // console.log(searchResults);
      const total = searchResults?.reduce(
        (acc, result) => acc + (parseFloat(result.amount_agreed) || 0),
        0
      );
      setTotalAmountAgreed(total);
      // Calculate total amount for IE loans
      const totalIe = searchResultsIe?.reduce(
        (acc, result) => acc + (parseFloat(result.amount_agreed) || 0),
        0
      );
      setTotalAmountAgreedIe(totalIe);
      // Calculate total amount for UK loans
      const totalUk = searchResultsUk?.reduce(
        (acc, result) => acc + (parseFloat(result.amount_agreed) || 0),
        0
      );
      setTotalAmountAgreedUk(totalUk);
      const totalWithFees = searchResults.reduce(
        (acc, result) => acc + (parseFloat(result.current_balance) || 0),
        0
      );
      setTotalAmountAgreedWithFees(totalWithFees);
      // Calculate total amount with fees for IE loans
      const totalWithFeesIe = searchResultsIe.reduce(
        (acc, result) => acc + (parseFloat(result.current_balance) || 0),
        0
      );
      setTotalAmountAgreedWithFeesIe(totalWithFeesIe);
      // Calculate total amount with fees for UK loans
      const totalWithFeesUk = searchResultsUk.reduce(
        (acc, result) => acc + (parseFloat(result.current_balance) || 0),
        0
      );
      setTotalAmountAgreedWithFeesUk(totalWithFeesUk);
    }
  }, [searchResults]);

  // Handle search results
  const handleSearchResults = (results) => {
    setSearchResults(results);
    setSearchResultsIe(
      results.filter(
        (result) => result.application_details?.user?.country === 'IE'
      )
    );
    setSearchResultsUk(
      results.filter(
        (result) => result.application_details?.user?.country === 'UK'
      )
    );
  };

  const formatAmount = (amount, currency = 'EUR') => {
    const locale = currency === 'GBP' ? 'en-GB' : 'en-IE'; // use en-IE for EUR

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
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
      if (
        field === 'current_balance' ||
        field === 'amount_agreed' ||
        field === 'id'
      ) {
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
    return Object.entries(data).map(([key, value]) => {
      if (key === 'loan') {
        // Skip rendering the 'loan' property under 'application_details'
        return null;
      }
      return (
        <div key={key} style={{ paddingLeft: `${level * 20}px` }}>
          <strong>{key}:</strong>{' '}
          {typeof value === 'object' && value !== null ? (
            <div>{renderNestedData(value, level + 1)}</div>
          ) : (
            <span>{value?.toString() || 'N/A'}</span>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className='container'>
      <h1 className='text-center my-3'>Search Advancements</h1>
      <GlobalSearchComponent
        config={searchConfig}
        onSearchResults={handleSearchResults}
        setExpandedRows={setExpandedRows}
        setSearchResults={setSearchResults}
      />

      {/* General Information Card */}
      {searchResults.length > 0 && (
        <SearchSummaryCard
          allItems={allLoans}
          ukItems={ukLoans}
          ieItems={ieLoans}
          searchedItems={searchResults}
          searchedItemsIe={searchResultsIe}
          searchedItemsUk={searchResultsUk}
          totalAllItemsAmount={totalAllLoansAmountAgreed}
          totatIeItemsAmount={totalAllLoansAmountAgreedIe}
          totalUkItemsAmount={totalAllLoansAmountAgreedUk}
          totalAllItemsAmountWithFees={totalAllLoansAmountAgreedWithFees}
          totalAllItemsAmountWithFeesIe={totalAllLoansAmountAgreedWithFeesIe}
          totalAllItemsAmountWithFeesUk={totalAllLoansAmountAgreedWithFeesUk}
          totalSearchedItemsAmount={totalAmountAgreed}
          totalSearchedItemsAmountIe={totalAmountAgreedIe}
          totalSearchedItemsAmountUk={totalAmountAgreedUk}
          totalSearchedItemsAmountWithFees={totalAmountAgreedWithFees}
          totalSearchedItemsAmountWithFeesIe={totalAmountAgreedWithFeesIe}
          totalSearchedItemsAmountWithFeesUk={totalAmountAgreedWithFeesUk}
          formatAmount={formatAmount}
          calculatePercentage={calculatePercentage}
        />
      )}

      {/* Search Results Table */}
      <div className='my-4'>
        <h2>Search Results</h2>
        {searchResults.length > 0 ? (
          <table className='table table-sm table-bordered table-striped'>
            <thead className='thead-dark'>
              <tr>
                <th
                  style={{ cursor: 'pointer' }}
                  onClick={() => sortData('id')}
                >
                  Advancement ID {getSortIcon('id')}
                </th>
                <th
                  style={{ cursor: 'pointer' }}
                  onClick={() => sortData('maturity_date')}
                >
                  Maturity Date {getSortIcon('maturity_date')}
                </th>
                <th
                  style={{ cursor: 'pointer' }}
                  onClick={() => sortData('amount_agreed')}
                >
                  Agreed Amount {getSortIcon('amount_agreed')}
                </th>
                <th
                  style={{ cursor: 'pointer' }}
                  onClick={() => sortData('current_balance')}
                >
                  Current Balance {getSortIcon('current_balance')}
                </th>
                <th
                  style={{ cursor: 'pointer' }}
                  onClick={() => sortData('application_details.user.name')}
                >
                  User Name {getSortIcon('application_details.user.name')}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((result) => (
                <Fragment key={result.id}>
                  <tr>
                    <td>{result.id}</td>
                    {result.maturity_date ? (
                      <td className='text-info'>
                        {formatDate(result.maturity_date)}
                      </td>
                    ) : !result.is_paid_out ? (
                      <td className=' text-warning'>
                        <sub>Not paid out</sub>
                      </td>
                    ) : result.is_settled ? (
                      <td className=' text-success'>
                        {' '}
                        <sub>Settled</sub>
                      </td>
                    ) : (
                      <td className='text-danger'>
                        {' '}
                        <sub>Unknown</sub>
                      </td>
                    )}
                    {/* Conditional rendering for amount_agreed */}

                    <td
                      className={
                        result?.country === 'IE'
                          ? 'text-success'
                          : 'text-danger'
                      }
                    >
                      {formatAmount(
                        result.amount_agreed,
                        result?.country === 'IE' ? 'EUR' : 'GBP'
                      )}
                    </td>
                    <td
                      className={
                        result?.country === 'IE'
                          ? 'text-success'
                          : 'text-danger'
                      }
                    >
                      {formatAmount(
                        result.current_balance,
                        result?.country === 'IE' ? 'EUR' : 'GBP'
                      )}
                    </td>
                    <td>{result.application_details?.user?.name || 'N/A'}</td>
                    <td>
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
                      <td colSpan='5'>
                        <div className='p-3 border'>
                          {renderNestedData(result)}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
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

export default AdvancementGlobalSearch;
