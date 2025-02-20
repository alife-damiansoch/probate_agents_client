

const renderErrors = (errors) => {
  const errorElements = [];

  const processError = (key, error) => {
    if (Array.isArray(error)) {
      error.forEach((message, index) => {
        if (typeof message === 'object' && message !== null) {
          processError(`${key}[${index}]`, message);
        } else {
          errorElements.push(
            <p key={`${key}-${index}`} className='mt-3'>
              {` ${message}`}
            </p>
          );
        }
      });
    } else if (typeof error === 'object' && error !== null) {
      Object.keys(error).forEach((subKey) => {
        processError(`${key}.${subKey}`, error[subKey]);
      });
    } else {
      errorElements.push(
        <p key={key} className=' mt-3'>
          {`${error}`}
        </p>
      );
    }
  };

  if (errors && typeof errors === 'object') {
    Object.keys(errors).forEach((key) => {
      processError(key, errors[key]);
    });
  }

  return errorElements;
};

export default renderErrors;

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0'); // Get the day and add leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get the month (0-based) and add leading zero
  const year = date.getFullYear(); // Get the full year

  return `${day}/${month}/${year}`; // Format as dd/mm/yyyy
};

export const displayUserTeams = (user) => {
  if (!user || !user.teams || user.teams === null) return ''; // Handle cases where user or teams are undefined

  const teamsDisplay = user.teams
    .filter((team) => team.name.endsWith('_team')) // Only include teams ending with '_team'
    .map((team) => team.name.split('_team')[0].toUpperCase()) // Extract part before '_team' and convert to uppercase
    .join(', ');

  return teamsDisplay ? ` (${teamsDisplay})` : ''; // Add parentheses only if there are teams
};
