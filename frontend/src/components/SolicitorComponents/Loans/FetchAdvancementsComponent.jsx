import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { fetchData } from '../../GenericFunctions/AxiosGenericFunctions';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import Loans from './Loans';
import PaginationComponent from '../../GenericComponents/PaginationComponent';
import BootstrapSwitch from '../../GenericComponents/BootstrapSwitch';
import { v4 as uuidv4 } from 'uuid';
import IdAndApplicantsFilter from '../Applications/FilterringApplication/IdAndApplicantsFilter';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';

const FetchAdvancementsComponent = () => {
  const token = Cookies.get('auth_token_agents');
  const [allLoans, setAllLoans] = useState(null); // State to hold all loans fetched from the server

  const [errors, setErrors] = useState('');
  const [pageTitle, setPageTitle] = useState('All Advancements');
  const [isLoading, setIsLoading] = useState(true);
  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  const [orderNewToOld, setOrderNewToOld] = useState(true);
  const [showAssignedAdvancementsOnly, setShowAssingedAdvancementsOnly] =
    useState(true); // State to toggle between showing all loans or only assigned loans
  const [assignedButtonVisible, setAssignedButtonVisible] = useState(true);

  const [searchId, setSearchId] = useState(null);
  const [applicantDetailSearch, setApplicantDetailSearch] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);

  // getting the last part of the url
  // so we will know what applications we want to get
  //and what api status we want to pass
  const lastPartOfUrl = window.location.pathname
    .split('/')
    .filter(Boolean)
    .pop();

  // Fetch all loans from the server when the component mounts or when the token changes
  useEffect(() => {
    setIsLoading(true);
    const fetchLoans = async () => {
      setAssignedButtonVisible(true);

      if (token && lastPartOfUrl) {
        let endpoint = `/api/loans/loans?page_size=${itemsPerPage}&page=${currentPage}`; // API endpoint to fetch loans

        if (searchId !== null || applicantDetailSearch !== '') {
          if (searchId !== null) {
            setPageTitle(
              `Advancement Search Results by:</br> <span style="color: purple;">ID: ${searchId}</span>`
            );
            endpoint += `&search_id=${searchId}`;
          }
          if (applicantDetailSearch !== '') {
            setPageTitle(
              `Addvancement Search Results by:</br> <span style="color: purple;">Applicant Details : "${applicantDetailSearch}"</span>`
            );
            endpoint += `&search_term=${applicantDetailSearch}`;
          }
        } else {
          if (lastPartOfUrl === 'advancements_notPaidOut') {
            endpoint += '&not_paid_out_only=true';
            setPageTitle('Not paid out advancements');
            setAssignedButtonVisible(false);
          } else if (lastPartOfUrl === 'advancements_awaiting_approval') {
            endpoint += '&awaiting_approval_only=true';
            setPageTitle('Awaiting approval');
            setAssignedButtonVisible(false);
          } else if (showAssignedAdvancementsOnly) {
            endpoint += `&assigned=${true}`;
          }

          if (!orderNewToOld) {
            endpoint += `&old_to_new=${true}`;
          }

          if (lastPartOfUrl === 'advancements_active') {
            endpoint += '&status=active';
            setPageTitle('Active Advancements');
          } else if (lastPartOfUrl === 'advancements_settled') {
            endpoint += '&status=settled';
            setPageTitle('Settled Advancements');
          } else if (lastPartOfUrl === 'not_committee_approved') {
            endpoint += '&status=not_committee_approved';
            setPageTitle('Rejected ByCommittee Advancements');
          } else if (lastPartOfUrl === 'advancements_paid_out') {
            endpoint += '&status=paid_out';
            setPageTitle('Paid Out Advancements');
          } else {
            setPageTitle('All advancements');
          }
        }
        const response = await fetchData(token, endpoint);

        if (response.status === 200) {
          setAllLoans(response.data.results); // Set the state with the fetched loans
          setTotalItems(response.data.count);
          setIsLoading(false);
        } else {
          setIsLoading(false);
          console.log(response.data);
          setErrors(response.data); // Set errors if the response status is not 200
        }
      }
    };

    fetchLoans();
  }, [
    token,
    lastPartOfUrl,
    currentPage,
    itemsPerPage,
    showAssignedAdvancementsOnly,
    orderNewToOld,
    applicantDetailSearch,
    searchId,
  ]);

  const handleClearAllFilters = () => {
    setSearchId(null);
    setApplicantDetailSearch('');
    setIsFiltered(false);
    setPageTitle('All advancements');
  };

  // Function to handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Make request to your API with updated pageNumber
  };

  if (isLoading) {
    return <LoadingComponent />;
  }
  return (
    <>
      {errors && (
        <div className='alert alert-danger'>{renderErrors(errors)}</div>
      )}
      {allLoans ? (
        <>
          <div className='row my-5 '>
            <div className=' col-auto bg-info-subtle rounded-pill p-3 mx-auto'>
              <BootstrapSwitch
                isChecked={showAssignedAdvancementsOnly}
                setIsChecked={setShowAssingedAdvancementsOnly}
                isCheckedMessage='Showing assigned only'
                isNotCheckedMessage='Showing assinged and not assigned'
                my_id={uuidv4()}
                visible={assignedButtonVisible}
              />
            </div>
            {lastPartOfUrl !== 'advancements_paid_out' && (
              <div className=' col-auto bg-info-subtle rounded-pill p-3 mx-auto'>
                <BootstrapSwitch
                  isChecked={orderNewToOld}
                  setIsChecked={setOrderNewToOld}
                  isCheckedMessage='New advancements first'
                  isNotCheckedMessage='Old advancements first'
                  my_id={uuidv4()}
                />
              </div>
            )}
          </div>
          <IdAndApplicantsFilter
            searchId={searchId}
            setSearchId={setSearchId}
            applicantDetailSearch={applicantDetailSearch}
            setApplicantDetailSearch={setApplicantDetailSearch}
            setIsFiltered={setIsFiltered}
            title={'Advancement'}
          />
          <Loans
            allLoans={allLoans}
            errors={errors}
            pageTitle={pageTitle}
            totalItems={totalItems}
            isFiltered={isFiltered}
            handleClearAllFilters={handleClearAllFilters}
          />
          <PaginationComponent
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            setItemsPerPage={setItemsPerPage}
            isFiltered={isFiltered}
          />
        </>
      ) : (
        <LoadingComponent />
      )}
    </>
  );
};

export default FetchAdvancementsComponent;
