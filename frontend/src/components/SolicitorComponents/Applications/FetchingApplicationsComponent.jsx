import  { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { fetchData } from '../../GenericFunctions/AxiosGenericFunctions';
import Applications from './Applications';
import LoadingComponent from '../../GenericComponents/LoadingComponent';
import PaginationComponent from '../../GenericComponents/PaginationComponent';
import BootstrapSwitch from '../../GenericComponents/BootstrapSwitch';
import { v4 as uuidv4 } from 'uuid';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';
import IdAndApplicantsFilter from './FilterringApplication/IdAndApplicantsFilter';

const FetchingApplicationsComponent = () => {
  const token = Cookies.get('auth_token_agents');
  const [applicationsAll, setApplicationsAll] = useState(null);

  const [errors, setErrors] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [pageTitle, setPageTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  // pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(100);

  const [orderNewToOld, setOrderNewToOld] = useState(true);
  const [showAssignedApplicationsOnly, setShowAssingedApplicationsOnly] =
    useState(true);

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

  // Fetching all applications when the component mounts or when `refresh` changes
  useEffect(() => {
    setIsLoading(true);
    setCurrentPage(currentPage);

    const fetchApplications = async () => {
      setErrors('');
      if (token) {
        let endpoint = `/api/applications/agent_applications/?page_size=${itemsPerPage}&page=${currentPage}`;

        if (searchId !== null || applicantDetailSearch !== '') {
          if (searchId !== null) {
            setPageTitle(
              `Application Search Results by:</br> <span style="color: purple;">ID: ${searchId}</span>`
            );
            endpoint += `&search_id=${searchId}`;
          }
          if (applicantDetailSearch !== '') {
            setPageTitle(
              `Application Search Results by:</br> <span style="color: purple;">Applicant Details : "${applicantDetailSearch}"</span>`
            );
            endpoint += `&search_term=${applicantDetailSearch}`;
          }
        } else {
          // Handling additional filters for assigned applications and statuses
          if (showAssignedApplicationsOnly) {
            endpoint += `&assigned=${true}`;
            setPageTitle('Assigned Applications');
          } else {
            setPageTitle('All Applications');
          }

          if (!orderNewToOld) {
            endpoint += `&old_to_new=${true}`;
          }

          // Handling different statuses based on the URL
          if (lastPartOfUrl === 'applications_active') {
            endpoint += '&status=active';
            setPageTitle('Currently in progress ');
          } else if (lastPartOfUrl === 'applications_rejected') {
            endpoint += '&status=rejected';
            setPageTitle('Rejected Applications');
          } else if (lastPartOfUrl === 'applications_approved_notPaidOut') {
            endpoint += '&status=approved';
            setPageTitle('Fully Approved (Not Paid Out) ');
          } else if (lastPartOfUrl === 'applications_PaidOut_notSettled') {
            endpoint += '&status=paid_out';
            setPageTitle('Approved & Paid Out (Not Settled)');
          } else if (lastPartOfUrl === 'applications_settled') {
            endpoint += '&status=settled';
            setPageTitle('Settled (Closed)');
          }
        }

        const response = await fetchData(token, endpoint);

        // Handling the response
        if (response && response.status === 200) {
          setApplicationsAll(response.data.results); // Setting all applications

          setTotalItems(response.data.count);
          setIsLoading(false);
        } else {
          // Transforming errors into an array of objects
          setErrors([
            {
              message:
                response?.message === 'Network Error'
                  ? 'Unable to connect to server. Please try again later.'
                  : response?.data || 'An unknown error occurred',
            },
          ]);
          setIsLoading(false);
        }
      }
    };

    fetchApplications();
  }, [
    token,
    refresh,
    lastPartOfUrl,
    currentPage,
    itemsPerPage,
    showAssignedApplicationsOnly,
    orderNewToOld,
    searchId,
    applicantDetailSearch,
  ]); // Dependencies: token, refresh (re-fetch when these change)

  const handleClearAllFilters = () => {
    setSearchId(null);
    setApplicantDetailSearch('');
    setIsFiltered(false);
    setPageTitle('All applications');
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
      {applicationsAll ? (
        <>
          <div className='row my-5 '>
            <div className='col-12 col-md-6 text-center'>
              <div className=' col-auto bg-info-subtle rounded-pill p-3 mx-auto shadow'>
                <BootstrapSwitch
                  isChecked={showAssignedApplicationsOnly}
                  setIsChecked={setShowAssingedApplicationsOnly}
                  isCheckedMessage='Assigned only'
                  isNotCheckedMessage='Assinged and not assigned'
                  my_id={uuidv4()}
                />
              </div>
            </div>
            {lastPartOfUrl !== 'applications_PaidOut_notSettled' && (
              <div className='col-12 col-md-6 text-center mt-2 mt-md-0'>
                <div className=' col-auto bg-info-subtle rounded-pill p-3 mx-auto shadow'>
                  <BootstrapSwitch
                    isChecked={orderNewToOld}
                    setIsChecked={setOrderNewToOld}
                    isCheckedMessage='New  first'
                    isNotCheckedMessage='Old  first'
                    my_id={uuidv4()}
                  />
                </div>
              </div>
            )}
          </div>
          {errors && (
            <div className='alert alert-danger'>
              <div className={`alert text-center text-danger`} role='alert'>
                {renderErrors(errors)}
              </div>
            </div>
          )}
          <IdAndApplicantsFilter
            searchId={searchId}
            setSearchId={setSearchId}
            applicantDetailSearch={applicantDetailSearch}
            setApplicantDetailSearch={setApplicantDetailSearch}
            setIsFiltered={setIsFiltered}
            title='Application'
          />
          <Applications
            applicationsAll={applicationsAll}
            errors={errors}
            setRefresh={setRefresh}
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
          />
        </>
      ) : (
        <LoadingComponent />
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

export default FetchingApplicationsComponent;
