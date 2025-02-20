// SearchSummaryCard.js
import  { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const SearchSummaryCard = ({
  allItems,
  searchedItems,
  totalAllItemsAmount,
  totalAllItemsAmountWithFees,
  totalSearchedItemsAmount,
  totalSearchedItemsAmountWithFees,
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
                  <td>{allItems.length}</td>
                  <td>{searchedItems.length}</td>
                  <td>
                    {calculatePercentage(searchedItems.length, allItems.length)}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>
                      Agreed Amount <br /> (fees excluded)
                    </strong>
                  </td>
                  <td>{formatAmount(totalAllItemsAmount)}</td>
                  <td>{formatAmount(totalSearchedItemsAmount)}</td>
                  <td>
                    {calculatePercentage(
                      totalSearchedItemsAmount,
                      totalAllItemsAmount
                    )}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>
                      Current Balance <br /> (fees included)
                    </strong>
                  </td>
                  <td>{formatAmount(totalAllItemsAmountWithFees)}</td>
                  <td>{formatAmount(totalSearchedItemsAmountWithFees)}</td>
                  <td>
                    {calculatePercentage(
                      totalSearchedItemsAmountWithFees,
                      totalAllItemsAmountWithFees
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default SearchSummaryCard;
