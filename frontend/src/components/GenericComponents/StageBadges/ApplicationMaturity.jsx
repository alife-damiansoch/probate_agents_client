const ApplicationMaturity = ({ maturityDate }) => {
  const currentDate = new Date(); // Get current date
  const maturity = new Date(maturityDate); // Parse the maturity date string

  // Calculate the difference in months
  const monthsUntilMaturity =
    (maturity.getFullYear() - currentDate.getFullYear()) * 12 +
    maturity.getMonth() -
    currentDate.getMonth();

  // Determine the badge class
  let badgeClass = 'bg-info'; // Default class
  if (maturity.getFullYear() === currentDate.getFullYear()) {
    badgeClass = 'bg-warning'; // Same year
  }
  if (monthsUntilMaturity <= 3 && maturity > currentDate) {
    badgeClass = 'bg-danger'; // Within the next 3 months
  }

  // Format the date in a readable way (e.g., "February 05, 2026")
  const formattedDate = maturity.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      {maturityDate && (
        <div className={`col-auto badge row ms-auto mt-3 shadow ${badgeClass}`}>
          <p className={`text-end mx-auto my-auto p-1 `}>
            Maturity date - {formattedDate}
          </p>
        </div>
      )}
    </>
  );
};

export default ApplicationMaturity;
