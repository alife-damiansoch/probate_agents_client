import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { fetchData } from '../../../../GenericFunctions/AxiosGenericFunctions';
import BackToApplicationsIcon from '../../../../GenericComponents/BackToApplicationsIcon';
import ExtensionsTable from './ExtentionsTable';

const ExtentionsComponent = () => {
  const { advancementId } = useParams();
  const token = Cookies.get('auth_token_agents');
  const [extentions, setExtentions] = useState(null);

  useEffect(() => {
    if (advancementId && token) {
      const fetchExtentions = async () => {
        if (token) {
          const { access } = token;
          const endpoint = `/api/loans/loan_extensions/`;
          try {
            const response = await fetchData(access, endpoint);
            if (response.data) {
              const filteredExtentions = response.data.filter(
                (extention) => extention.loan === parseInt(advancementId)
              );
              // console.log(filteredExtentions);
              setExtentions(filteredExtentions);
            }
          } catch (error) {
            console.error('Error fetching advancement details:', error);
          }
        }
      };

      fetchExtentions();
    }
  }, [advancementId, token]);
  return (
    <>
      <BackToApplicationsIcon backUrl={-1} />
      <div className='card bg-dark-subtle shadow my-4'>
        <div className=' card-header'>
          <div className=' card-subtitle text-center'>
            <h4>Extensions for advancement id: {advancementId}</h4>
          </div>
        </div>
        <div className='card-body'>
          <ExtensionsTable
            extensions={extentions}
            advancementId={advancementId}
          />
        </div>
      </div>
    </>
  );
};

export default ExtentionsComponent;
