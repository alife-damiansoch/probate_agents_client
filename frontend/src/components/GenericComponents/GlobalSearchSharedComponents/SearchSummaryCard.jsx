// SearchSummaryCard.js
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const SearchSummaryCard = ({
  allItems,
  ieItems,
  ukItems,
  searchedItems,
  searchedItemsIe,
  searchedItemsUk,
  totalAllItemsAmount,
  totatIeItemsAmount,
  totalUkItemsAmount,
  totalAllItemsAmountWithFees,
  totalAllItemsAmountWithFeesIe,
  totalAllItemsAmountWithFeesUk,
  totalSearchedItemsAmount,
  totalSearchedItemsAmountIe,
  totalSearchedItemsAmountUk,
  totalSearchedItemsAmountWithFees,
  totalSearchedItemsAmountWithFeesIe,
  totalSearchedItemsAmountWithFeesUk,
  formatAmount,
  calculatePercentage,
}) => {
  const [userCountryTeamsAssigned, setUserCountryTeamsAssigned] = useState([]);

  const user = useSelector((state) => state.user.user);

  // useEffect to check what team the user is assigned to
  useEffect(() => {
    if (user) {
      // Filter and extract only relevant team names
      const teamsAssigned =
        user.teams
          ?.filter((team) => team.name.endsWith('_team')) // Check if the name ends with "_team"
          .map((team) => team.name.split('_')[0]) || []; // Extract the part before "_"
      setUserCountryTeamsAssigned(teamsAssigned);
    }
  }, [user]);
  // console.log(user);
  return (
    <>
      {allItems && (
        <div className='card my-4'>
          <div className='card-body'>
            <h5 className='card-title'>Search Summary</h5>
            <table className='table table-sm table-hover table-bordered'>
              <thead>
                <tr>
                  <th></th>
                  <th>
                    All Items from:{' ('}
                    {userCountryTeamsAssigned.length > 0
                      ? userCountryTeamsAssigned.map((t) => t + ', ')
                      : 'No country team assigned'}
                    {' )'}
                  </th>
                  <th>Searched Items</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <strong>Total Count</strong>
                  </td>
                  <td>
                    {<span className='text-info'>All: {allItems.length}</span>}{' '}
                    {ukItems?.length > 0 && (
                      <span className='text-danger'>
                        <br /> UK: {ukItems.length}
                      </span>
                    )}
                    {ieItems?.length > 0 && (
                      <span className='text-success'>
                        <br /> IE: {ieItems.length}
                      </span>
                    )}
                  </td>
                  <td>
                    {
                      <span className='text-info'>
                        All: {searchedItems.length}
                      </span>
                    }{' '}
                    {searchedItemsUk?.length > 0 && (
                      <span className='text-danger'>
                        <br /> UK: {searchedItemsUk.length}
                      </span>
                    )}
                    {searchedItemsIe?.length > 0 && (
                      <span className='text-success'>
                        <br /> IE: {searchedItemsIe.length}
                      </span>
                    )}
                  </td>
                  <td className='text-info'>
                    {calculatePercentage(searchedItems.length, allItems.length)}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>
                      Agreed Amount <br /> (fees excluded)
                    </strong>
                  </td>
                  <td>
                    {/* {
                      <span className='text-info'>
                        All: {formatAmount(totalAllItemsAmount)}
                        <br /> 
                      </span>
                    } */}
                    {ukItems?.length > 0 && (
                      <span className='text-danger'>
                        UK: {formatAmount(totalUkItemsAmount, 'GBP')}
                      </span>
                    )}
                    {ieItems?.length > 0 && (
                      <span className='text-success'>
                        <br /> IE: {formatAmount(totatIeItemsAmount, 'EUR')}
                      </span>
                    )}
                  </td>
                  <td>
                    {/* {
                      <span className='text-info'>
                        All: {formatAmount(totalSearchedItemsAmount)}
                        <br />
                      </span>
                    } */}
                    {totalSearchedItemsAmountUk > 0 && (
                      <span className='text-danger'>
                        UK: {formatAmount(totalSearchedItemsAmountUk, 'GBP')}
                      </span>
                    )}
                    {totalSearchedItemsAmountIe > 0 && (
                      <span className='text-success'>
                        <br /> IE:{' '}
                        {formatAmount(totalSearchedItemsAmountIe, 'EUR')}
                      </span>
                    )}
                  </td>
                  <td className='text-info'>
                    {calculatePercentage(
                      totalSearchedItemsAmount,
                      totalAllItemsAmount
                    )}
                  </td>
                </tr>
                {totalAllItemsAmountWithFees !== 0 &&
                  totalSearchedItemsAmountWithFees !== 0 && (
                    <tr>
                      <td>
                        <strong>
                          Current Balance <br /> (fees included)
                        </strong>
                      </td>
                      <td>
                        {/* {
                          <span className='text-info'>
                            All: {formatAmount(totalAllItemsAmountWithFees)}
                            <br />
                          </span>
                        } */}
                        {totalSearchedItemsAmountUk > 0 && (
                          <span className='text-danger'>
                            UK:{' '}
                            {formatAmount(totalAllItemsAmountWithFeesUk, 'GBP')}
                          </span>
                        )}
                        {totalSearchedItemsAmountIe > 0 && (
                          <span className='text-success'>
                            <br /> IE:{' '}
                            {formatAmount(totalAllItemsAmountWithFeesIe, 'EUR')}
                          </span>
                        )}
                      </td>
                      <td>
                        {/* {
                          <span className='text-info'>
                            All:{' '}
                            {formatAmount(totalSearchedItemsAmountWithFees)}
                            <br />
                          </span>
                        } */}
                        {totalSearchedItemsAmountUk > 0 && (
                          <span className='text-danger'>
                            UK:{' '}
                            {formatAmount(
                              totalSearchedItemsAmountWithFeesUk,
                              'GBP'
                            )}
                          </span>
                        )}
                        {totalSearchedItemsAmountIe > 0 && (
                          <span className='text-success'>
                            <br /> IE:{' '}
                            {formatAmount(
                              totalSearchedItemsAmountWithFeesIe,
                              'EUR'
                            )}
                          </span>
                        )}
                      </td>
                      <td>
                        {calculatePercentage(
                          totalSearchedItemsAmountWithFees,
                          totalAllItemsAmountWithFees
                        )}
                      </td>
                    </tr>
                  )}
              </tbody>
            </table>
            <small class='text-muted d-block mt-2'>
              <strong>Note:</strong> Percentage figures are approximate. Amounts
              are calculated using values in both Euro and British Pound without
              currency conversion, which may affect accuracy.
            </small>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchSummaryCard;
