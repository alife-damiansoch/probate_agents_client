import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from 'react-router-dom';
import './App.css';
import './bootstrap.min.css';
import Communication from './components/Communication/Communication';
import FooterComponent from './components/GenericComponents/FooterComponent';
import renderErrors from './components/GenericFunctions/HelperGenericFunctions';
import AutoLogoutComponent from './components/Login/AutoLogoutComponent';
import LoginComponent from './components/Login/LoginComponent';
import RegisterComponent from './components/Login/RegisterComponent';
import NavBar from './components/NavBar/NavBar';
import AddApplication from './components/SolicitorComponents/Applications/AddApplication';
import ApplicationGlobalSearch from './components/SolicitorComponents/Applications/AplicationGlobalSearch/ApplicationGlobalSearch';
import ApplicationDetails from './components/SolicitorComponents/Applications/ApplicationDetails';
import AdvancementDetailsConfirm from './components/SolicitorComponents/Applications/ApplicationDocumentsComponents/Advancement/AdvancementDetailsConfirm';
import ApproveApplication from './components/SolicitorComponents/Applications/ApproveApplication/ApproveApplication';
import FetchingApplicationsComponent from './components/SolicitorComponents/Applications/FetchingApplicationsComponent';
import Solicitors from './components/SolicitorComponents/Applications/SolicitorComponent/Solicitors';
import UploadNewDocument from './components/SolicitorComponents/Applications/UploadingFileComponents/UploadNewDocument';
import ExtentionsComponent from './components/SolicitorComponents/Loans/ActionsComponents/Extentions/ExtentionsComponent';
import SettleAdvancementComponent from './components/SolicitorComponents/Loans/ActionsComponents/SettleAdvancementComponent';
import TransactionsComponent from './components/SolicitorComponents/Loans/ActionsComponents/Transactions/TransactionsComponent';
import AdvancementDetail from './components/SolicitorComponents/Loans/AdvancementDetail';
import AdvancementGlobalSearch from './components/SolicitorComponents/Loans/AdvancementGlobalSearch/AdvancementGlobalSearch';
import FetchAdvancementsComponent from './components/SolicitorComponents/Loans/FetchAdvancementsComponent';
import FileManager from './components/SolicitorComponents/Management/DocumentsForDownloadComponent/FileManager';
import Management from './components/SolicitorComponents/Management/Management';
import AllNotificationComponent from './components/SolicitorComponents/Notifications/AllNotificationComponent';
import UpdatePasswordComponent from './components/SolicitorComponents/UpdatePasswordComponent';
import UserProfile from './components/SolicitorComponents/UserProfileComponent';
import { loginSuccess, logout } from './store/authSlice';
import { clearUser, fetchUser } from './store/userSlice';
import apiEventEmitter from './utils/eventEmitter';

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  Cookies.set('country', 'ALL');
  const [autoLoggedOutMessage, setAutoLoggedOutMessage] = useState(null);

  useEffect(() => {
    // Listen for logoutRequired event
    const handleLogout = () => {
      console.log('🚨 Auto logging out user due to API key issue');
      dispatch(logout());
      dispatch(clearUser());
      setAutoLoggedOutMessage([
        '🚨 Session Expired',
        `Your session has expired or is no longer valid.`,
        ` For security reasons, you have been automatically logged out.`,
        ` Please log in again to continue.`,
      ]);
      console.log('ALL RUN');
    };

    apiEventEmitter.on('logoutRequired', handleLogout);

    return () => {
      // Cleanup event listener
      apiEventEmitter.off('logoutRequired', handleLogout);
    };
  }, [dispatch]);

  useEffect(() => {
    console.log('AutoLoggedOutMessage', autoLoggedOutMessage);
  }, [autoLoggedOutMessage]);

  useEffect(() => {
    if (isLoggedIn) {
      setAutoLoggedOutMessage(null);
    }
  }, [isLoggedIn]);

  let tokenObj = Cookies.get('auth_token_agents');
  if (tokenObj) {
    try {
      tokenObj = JSON.parse(tokenObj);
    } catch (error) {
      console.error('Error parsing tokenObj:', error);
      tokenObj = null; // ensure tokenObj is null if parsing fails
    }
  }

  useEffect(() => {
    if (tokenObj) {
      dispatch(loginSuccess({ tokenObj }));
      dispatch(fetchUser());
    }
  }, [dispatch, tokenObj]);

  return (
    <Router>
      <div className='container'>
        <NavBar />
        {isLoggedIn && <AutoLogoutComponent />}{' '}
        <Routes>
          {/* Application Paths */}
          <Route
            path='/'
            element={
              !isLoggedIn ? (
                <div className='container'>
                  <LoginComponent />
                </div>
              ) : (
                <Navigate to='/applications_active' />
              )
            }
          />
          <Route path='/register' element={<RegisterComponent />} />
          <Route
            path='/user_profile'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<UserProfile />}
              />
            }
          />
          <Route
            path='/update_password'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<UpdatePasswordComponent />}
              />
            }
          />
          <Route
            path='/addApplication'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<AddApplication />}
              />
            }
          />
          <Route
            path='/applications_active'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<FetchingApplicationsComponent />}
              />
            }
          />
          <Route
            path='/applications_approved_notPaidOut'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<FetchingApplicationsComponent />}
              />
            }
          />
          <Route
            path='/applications_PaidOut_notSettled'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<FetchingApplicationsComponent />}
              />
            }
          />
          <Route
            path='/applications_settled'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<FetchingApplicationsComponent />}
              />
            }
          />
          <Route
            path='/applications_rejected'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<FetchingApplicationsComponent />}
              />
            }
          />

          <Route
            path='/applications'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<FetchingApplicationsComponent />}
              />
            }
          />
          <Route
            path='/applications/:id'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<ApplicationDetails />}
              />
            }
          />
          <Route
            path='/applications_global_search'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<ApplicationGlobalSearch />}
              />
            }
          />
          <Route
            path='/createAdvancement/:id'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<AdvancementDetailsConfirm />}
              />
            }
          />
          <Route
            path='/login'
            element={
              !isLoggedIn ? (
                <>
                  {autoLoggedOutMessage && (
                    <div className=' alert alert-danger text-center'>
                      {renderErrors(autoLoggedOutMessage)}
                    </div>
                  )}
                  <LoginComponent />
                </>
              ) : (
                <CustomRedirect />
              )
            }
          />
          <Route
            path='/upload_new_document/:applicationId'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<UploadNewDocument />}
              />
            }
          />
          <Route
            path='/approveApplication/:applicationId'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<ApproveApplication />}
              />
            }
          />
          <Route
            path='/solicitors/:application_id'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<Solicitors />}
              />
            }
          />
          {/* Advancement Paths */}
          <Route
            path='/advancements_active'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<FetchAdvancementsComponent />}
              />
            }
          />
          <Route
            path='/advancements_paid_out'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<FetchAdvancementsComponent />}
              />
            }
          />
          <Route
            path='/not_committee_approved'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<FetchAdvancementsComponent />}
              />
            }
          />
          <Route
            path='/advancements_settled'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<FetchAdvancementsComponent />}
              />
            }
          />
          <Route
            path='/advancements_notPaidOut'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<FetchAdvancementsComponent />}
              />
            }
          />
          <Route
            path='/advancements_awaiting_approval'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<FetchAdvancementsComponent />}
              />
            }
          />
          <Route
            path='/advancements'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<FetchAdvancementsComponent />}
              />
            }
          />
          <Route
            path='/advancements/:id'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<AdvancementDetail />}
              />
            }
          />
          <Route
            path='/advancements_global_search'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<AdvancementGlobalSearch />}
              />
            }
          />
          <Route
            path='/extentions/:advancementId'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<ExtentionsComponent />}
              />
            }
          />
          <Route
            path='/transactions/:advancementId'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<TransactionsComponent />}
              />
            }
          />
          <Route
            path='/settle_advancement/:advancementId'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<SettleAdvancementComponent />}
              />
            }
          />
          {/* User Management Paths */}
          <Route
            path='/userManagement'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<Management />}
              />
            }
          />
          {/* Notifications Paths */}
          <Route
            path='/notifications'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<AllNotificationComponent />}
              />
            }
          />
          {/* File Management Paths */}
          <Route
            path='/documentsForDownload'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<FileManager />}
              />
            }
          />
          <Route
            path='/communication/:applicationId'
            element={
              <ProtectedRoute
                isLoggedIn={isLoggedIn}
                component={<Communication />}
              />
            }
          />
        </Routes>
        <FooterComponent />
      </div>
    </Router>
  );
}

// Custom ProtectedRoute component to handle authentication and redirects
const ProtectedRoute = ({ component, isLoggedIn }) => {
  const location = useLocation();
  return isLoggedIn ? (
    component
  ) : (
    <Navigate to='/login' state={{ from: location }} replace />
  );
};

// Custom Redirect Component to redirect users to their intended route
const CustomRedirect = () => {
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/applications_active';
  return <Navigate to={redirectTo} replace />;
};

export default App;
