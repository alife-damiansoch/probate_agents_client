import { fetchData } from './AxiosGenericFunctions';

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

/**
 * Helper function to format category names for display
 * @param {string} category - The category name to format
 * @returns {string} - Formatted category name
 */
export const formatCategoryName = (category) => {
  return category
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Helper function to format field names for display
 * @param {string} fieldName - The field name to format
 * @returns {string} - Formatted field name
 */
export const formatFieldName = (fieldName) => {
  return fieldName
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Fetches and processes estates data for an application
 * @param {Object} application - The application object containing estate_summary URL
 * @returns {Promise<Array>} - Promise that resolves to an array of flattened estates
 */
export const getEstates = async (application) => {
  if (!application.estate_summary) {
    console.log('No estate_summary URL provided');
    return [];
  }

  console.log(
    `Fetching estates for application ${application.id} from ${application.estate_summary}`
  );

  try {
    // Use fetchData helper (adjust if yours expects full auth object)
    const response = await fetchData('token', application.estate_summary, true); // true = absolute url

    console.log('Estates response:', response);

    // Flatten all estate categories into a single array
    const estatesData = response.data;
    const allEstates = [];

    // Extract estates from all categories and add category labels
    Object.entries(estatesData).forEach(([category, categoryEstates]) => {
      if (Array.isArray(categoryEstates) && categoryEstates.length > 0) {
        categoryEstates.forEach((estate) => {
          // Add category information to each estate
          const isLiability = category === 'irish_debt';
          allEstates.push({
            ...estate,
            category: category,
            group_label: formatCategoryName(category),
            is_asset: isLiability ? false : estate.is_asset, // Mark irish_debt as liability
          });
        });
      }
    });

    console.log('Flattened estates:', allEstates);
    return allEstates;
  } catch (error) {
    console.error('Error fetching estates:', error);
    throw error; // Re-throw to let the calling component handle the error
  }
};

export function formatMoney(amount, currency = '') {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;

  if (isNaN(numAmount)) {
    return `${currency}0.00`;
  }

  const formatted = numAmount.toLocaleString('en-IE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return `${currency}${formatted}`;
}
