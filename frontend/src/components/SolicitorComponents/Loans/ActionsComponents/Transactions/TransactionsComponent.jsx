import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { fetchData } from '../../../../GenericFunctions/AxiosGenericFunctions';
import TransactionsTable from './TransactionsTable';
import BackToApplicationsIcon from '../../../../GenericComponents/BackToApplicationsIcon';

const TransactionsComponent = () => {
  const { advancementId } = useParams();
  const token = Cookies.get('auth_token_agents');
  const [transactions, setTransactions] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (token) {
        const { access } = token;
        const endpoint = `/api/loans/transactions/`;
        try {
          const response = await fetchData(access, endpoint);
          if (response.data) {
            const filteredTransactions = response.data.filter(
              (transaction) => transaction.loan === parseInt(advancementId)
            );
            // console.log(filteredTransactions);
            setTransactions(filteredTransactions);
          }
        } catch (error) {
          console.error('Error fetching advancement details:', error);
        }
      }
    };

    fetchTransactions();
  }, [token, advancementId]);

  return (
    <>
      <BackToApplicationsIcon backUrl={-1} />
      <div className=' card bg-dark-subtle shadow my-4'>
        <div className=' card-header'>
          <div className=' card-title text-center'>
            <h4>Transactions for advancement id: {advancementId}</h4>
          </div>
        </div>
        <div className='card-body'>
          <TransactionsTable
            transactions={transactions}
            advancementId={advancementId}
          />
        </div>
      </div>
    </>
  );
};

export default TransactionsComponent;
