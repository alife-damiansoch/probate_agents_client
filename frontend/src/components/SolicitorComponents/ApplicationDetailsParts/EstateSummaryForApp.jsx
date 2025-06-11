const toNumber = (val) => (isNaN(parseFloat(val)) ? 0 : parseFloat(val));

export function EstateSummaryForApp({
  estates = [],
  requestedAmount,
  currency_sign,
}) {
  const assets = estates.filter((e) => e.lendable !== null);
  const deductions = estates.filter((e) => e.lendable === null);

  const totalAssets = assets.reduce((sum, e) => sum + toNumber(e.value), 0);
  const totalLendable = assets.reduce(
    (sum, e) => (e.lendable ? sum + toNumber(e.value) : sum),
    0
  );
  const totalDeductions = deductions.reduce(
    (sum, e) => sum + toNumber(e.value),
    0
  );

  const netIrishEstate = totalAssets - totalDeductions;
  const lendableIrishEstate = totalLendable - totalDeductions;
  const maxAdvance = lendableIrishEstate * 0.5;
  const requested = toNumber(requestedAmount);

  return (
    <div
      className={`mt-4 p-3 bg-light rounded border ${
        requested > maxAdvance ? 'border-danger' : 'border-success'
      }`}
    >
      <div className='mb-2 pb-2 border-bottom'>
        <div>
          <span className='fw-bold'>Net Irish Estate: </span>
          <span>
            {currency_sign}
            {netIrishEstate.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div>
          <span className='fw-bold'>
            Lendable Irish Estate<sup>*</sup>:{' '}
          </span>
          <span>
            {currency_sign}
            {lendableIrishEstate.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
        <div>
          <span className='fw-bold'>Maximum Advance (50%): </span>
          <span>
            {currency_sign}
            {maxAdvance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
      <div>
        {(() => {
          if (lendableIrishEstate <= 0) {
            return (
              <div className='text-danger small'>
                Please enter estate details to calculate advance eligibility.
              </div>
            );
          }
          if (requested <= 0) {
            return (
              <div className='text-danger small'>
                Please enter the requested advance amount above.
              </div>
            );
          }
          if (requested > maxAdvance) {
            return (
              <div className='text-danger small'>
                <strong>
                  Requested amount exceeds the maximum allowed advance.
                </strong>
                <br />
                The maximum advance currently offered is{' '}
                <strong>50% of the Lendable Irish Estate</strong>.<br />
                Please adjust the requested amount or estate details.
              </div>
            );
          }
          return (
            <div className='text-success small'>
              <strong>
                Requested amount is within the maximum allowed advance.
              </strong>
              <br />
              You can proceed with your application.
            </div>
          );
        })()}
        <small className='form-text mt-2 d-block'>
          <sup>*</sup> Only certain estate items are considered lendable. This
          may change; ask your agent for more info.
        </small>
      </div>
    </div>
  );
}
