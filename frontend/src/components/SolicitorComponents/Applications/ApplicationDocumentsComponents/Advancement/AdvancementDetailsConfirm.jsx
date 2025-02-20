import  { useEffect, useState } from 'react';
import ApplicationSummaryCard from '../../ApproveApplication/ApplicationSummaryCard';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import {
  fetchData,
  postPdfRequest,
} from '../../../../GenericFunctions/AxiosGenericFunctions';
import BackToApplicationsIcon from '../../../../GenericComponents/BackToApplicationsIcon';

const AdvancementDetailsConfirm = () => {
  const token = Cookies.get('auth_token_agents');
  const [application, setApplication] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fee, setFee] = useState(0);

  const { id } = useParams();

  // fetching application data
  useEffect(() => {
    const fetchApplication = async () => {
      if (token) {
        const { access } = token;
        const endpoint = `/api/applications/agent_applications/${id}/`;
        try {
          const response = await fetchData(access, endpoint);
          setApplication(response.data);
        } catch (error) {
          console.error('Error fetching application details:', error);
        }
      }
    };

    fetchApplication();
  }, [token, id]);

  // setting up the default fee
  useEffect(() => {
    if (application) {
      let yearMultiplier = Math.ceil(application.term / 12);
      const calculatedFee =
        Math.round(application.amount * 0.15 * yearMultiplier * 100) / 100;
      setFee(calculatedFee);
    }
  }, [application]);

  const generatePdfHandler = async (e) => {
    e.preventDefault();

    setLoading(true); // Set loading to true when request starts

    const requestData = {
      application_id: application.id,
      fee_agreed_for_undertaking: fee,
    };

    try {
      const response = await postPdfRequest(
        token,
        '/api/generate-pdf/',
        requestData
      );

      if (response && response.status === 200) {
        // Handle PDF download
        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: 'application/pdf' })
        );
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `undertaking_${application.id}.pdf`); // Set the file name
        document.body.appendChild(link);
        link.click(); // Trigger the download
        link.remove(); // Clean up the link after download
      } else {
        alert('Failed to generate PDF. Please check your input and try again.');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('An error occurred while generating the PDF. Please try again.');
    } finally {
      setLoading(false); // Set loading to false when request completes
    }
  };

  return (
    <>
      <BackToApplicationsIcon backUrl={-1} />
      <div className='card bg-dark-subtle shadow'>
        <div className='card-header  my-2'>
          <h4 className=' card-subtitle text-info-emphasis'>
            Check details for advancement
          </h4>
        </div>
        <div className='card-body'>
          <div className='row'>
            <div className='col-12 col-md-8'>
              <div className='card shadow '>
                <div className='card-body '>
                  <form
                    id='undertakingForm'
                    onSubmit={(e) => {
                      generatePdfHandler(e);
                    }}
                  >
                    <div className='form-group'>
                      <label htmlFor='fees'>Advancement fee:</label>
                      <input
                        type='number'
                        className='form-control form-control-sm'
                        id='fees'
                        name='fees'
                        placeholder='Enter Fees'
                        value={fee}
                        required
                        onChange={(e) => setFee(e.target.value)}
                      />
                    </div>

                    <div className=' alert alert-info shadow my-2 text-center'>
                      <p>Fee is calculated: 15% of the advance per annum</p>
                    </div>

                    <button
                      type='submit'
                      className='btn btn-primary btn-block my-2'
                      disabled={loading}
                    >
                      {loading ? 'Please wait...' : 'Generate PDF'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
            <div className='col-12 col-md-4 text-center mx-auto'>
              <ApplicationSummaryCard
                application={application}
                issues={issues}
                setIssues={setIssues}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdvancementDetailsConfirm;
