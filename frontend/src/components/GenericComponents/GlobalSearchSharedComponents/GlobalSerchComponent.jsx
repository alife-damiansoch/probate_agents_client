import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaSearch } from 'react-icons/fa';
import { GiEmptyMetalBucket } from 'react-icons/gi';
import qs from 'qs';
import { fetchData } from '../../GenericFunctions/AxiosGenericFunctions';
import renderErrors from '../../GenericFunctions/HelperGenericFunctions';

const GlobalSearchComponent = ({
  config,
  onSearchResults,
  setExpandedRows,
  setSearchResults,
}) => {
  const [searchParams, setSearchParams] = useState({});
  const [loading, setLoading] = useState(false);
  const [dateRanges, setDateRanges] = useState({});
  const [requiredFields, setRequiredFields] = useState({});
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (!config || !config.searchFields) {
      console.error('Config or searchFields are undefined');
    }
  }, [config]);

  // Handle input changes for different types of fields
  const handleInputChange = (field, value) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update required fields state for range fields
    if (field.startsWith('from_') || field.startsWith('to_')) {
      const baseField = field.replace(/^(from_|to_)/, '');
      setRequiredFields((prev) => ({
        ...prev,
        [`from_${baseField}`]: value && !searchParams[`to_${baseField}`],
        [`to_${baseField}`]: value && !searchParams[`from_${baseField}`],
      }));
    }
  };

  // Handle date range changes for different fields
  const handleDateRangeChange = (field, dates) => {
    const [startDate, endDate] = dates;
    setDateRanges((prev) => ({
      ...prev,
      [field]: dates,
    }));
    if (startDate) {
      handleInputChange(`from_${field}`, startDate.toISOString().split('T')[0]);
    } else {
      handleInputChange(`from_${field}`, '');
    }
    if (endDate) {
      handleInputChange(`to_${field}`, endDate.toISOString().split('T')[0]);
    } else {
      handleInputChange(`to_${field}`, '');
    }
  };

  // Function to render appropriate input field based on type
  const renderInputField = (field, type, label, options) => {
    switch (type) {
      case 'number':
        return (
          <div className='form-group'>
            <label>{label}</label>
            <input
              type='number'
              className={`form-control form-control-sm ${
                requiredFields[field] ? 'is-invalid' : ''
              }`}
              value={searchParams[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
          </div>
        );
      case 'range':
        return (
          <div className='form-group'>
            <label>{label}</label>
            <div className='d-flex'>
              <input
                id={`from_${field}`}
                type='number'
                className={`form-control form-control-sm me-2 ${
                  requiredFields[`from_${field}`] ? 'is-invalid' : ''
                }`}
                placeholder='From'
                value={searchParams[`from_${field}`] || ''}
                onChange={(e) => {
                  handleInputChange(`from_${field}`, e.target.value);
                  if (e.target.value) {
                    setRequiredFields((prev) => ({
                      ...prev,
                      [`to_${field}`]: !searchParams[`to_${field}`],
                    }));
                  } else {
                    setRequiredFields((prev) => ({
                      ...prev,
                      [`to_${field}`]: false,
                    }));
                  }
                }}
              />
              <input
                id={`to_${field}`}
                type='number'
                className={`form-control form-control-sm ${
                  requiredFields[`to_${field}`] ? 'is-invalid' : ''
                }`}
                placeholder='To'
                value={searchParams[`to_${field}`] || ''}
                onChange={(e) => {
                  handleInputChange(`to_${field}`, e.target.value);
                  if (e.target.value) {
                    setRequiredFields((prev) => ({
                      ...prev,
                      [`from_${field}`]: !searchParams[`from_${field}`],
                    }));
                  } else {
                    setRequiredFields((prev) => ({
                      ...prev,
                      [`from_${field}`]: false,
                    }));
                  }
                }}
              />
            </div>
          </div>
        );
      case 'boolean':
        return (
          <div className='form-group'>
            <label>{label}</label>
            <div className='d-flex align-items-center'>
              <label className='me-2'>
                <input
                  type='radio'
                  name={field}
                  value='true'
                  checked={searchParams[field] === 'true'}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
                Yes
              </label>
              <label className='me-2'>
                <input
                  type='radio'
                  name={field}
                  value='false'
                  checked={searchParams[field] === 'false'}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
                No
              </label>
            </div>
          </div>
        );
      case 'nullable_boolean':
        return (
          <div className='form-group'>
            <label>{label}</label>
            <div className='d-flex align-items-center'>
              <label className='me-2'>
                <input
                  type='radio'
                  name={field}
                  value='true'
                  checked={searchParams[field] === 'true'}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
                Yes
              </label>
              <label className='me-2'>
                <input
                  type='radio'
                  name={field}
                  value='false'
                  checked={searchParams[field] === 'false'}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
                No
              </label>
              <label>
                <input
                  type='radio'
                  name={field}
                  value='null'
                  checked={searchParams[field] === 'null'}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                />
                Not Recorded
              </label>
            </div>
          </div>
        );
      case 'date_range': // Single input for date range
        return (
          <div className='form-group'>
            <label>{label}</label>
            <DatePicker
              selectsRange
              startDate={dateRanges[field]?.[0] || null}
              endDate={dateRanges[field]?.[1] || null}
              onChange={(dates) => handleDateRangeChange(field, dates)}
              isClearable
              className='form-control form-control-sm'
              dateFormat='yyyy-MM-dd'
              placeholderText='Select date range'
            />
          </div>
        );
      case 'select':
        return (
          <div className='form-group'>
            <label>{label}</label>
            <select
              className='form-control form-control-sm'
              value={searchParams[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
            >
              <option value=''>Select {label}</option>
              {(Array.isArray(options) ? options : []).map((option) => {
                let displayValue;
                switch (label) {
                  case 'Solicitor':
                    displayValue = `${option.title} ${option.first_name} ${option.last_name}`;
                    break;
                  case 'Assigned To':
                    displayValue = option.email;
                    break;
                  case 'User':
                    displayValue = option.name + ' --- ' + option.email;
                    break;
                  default:
                    displayValue = option.name;
                }
                return (
                  <option key={option.id} value={option.id}>
                    {displayValue}
                  </option>
                );
              })}
            </select>
          </div>
        );
      default:
        return (
          <div className='form-group'>
            <label>{label}</label>
            <input
              type='text'
              className='form-control form-control-sm'
              value={searchParams[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
            />
          </div>
        );
    }
  };

  // Function to handle the search
  const handleSearch = async () => {
    setLoading(true);
    setExpandedRows({});
    try {
      // Use qs.stringify to convert the searchParams object into a query string
      const queryString = qs.stringify(searchParams, { skipNulls: true });
      // console.log(`${config.endpoint}?${queryString}`);

      // Pass the query parameters correctly
      const response = await fetchData(
        'token',
        `${config.endpoint}?${queryString}`
      );

      if (response.status === 200) {
        onSearchResults(response.data);
      } else {
        setErrors(response.data);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
    setLoading(false);
  };
  // console.log(
  //   'Available search fields:',
  //   Object.keys(config.searchFields),
  //   Object.values(config.searchFields)
  // );

  return (
    <div className='border p-4 rounded'>
      <h4 className='mb-3'>Search</h4>

      {/* Grouping inputs by categories */}

      <div className='mb-3'>
        <h5 className='text-primary'>Id</h5>
        <div className='row'>
          {config &&
            config.searchFields &&
            Object.entries(config.searchFields)
              .filter(([_, { type }]) => type === 'number')
              .map(([field, { type, label, options }]) => (
                <div className='col-md-4 mb-3' key={field}>
                  {renderInputField(field, type, label, options)}
                </div>
              ))}
        </div>
      </div>

      <div className='mb-3'>
        <h5 className='text-primary'>Ranges</h5>
        <div className='row'>
          {config &&
            config.searchFields &&
            Object.entries(config.searchFields)
              .filter(([_, { type }]) => type === 'range')
              .map(([field, { type, label, options }]) => (
                <div className='col-md-4 mb-3' key={field}>
                  {renderInputField(field, type, label, options)}
                </div>
              ))}
        </div>
      </div>

      <div className='mb-3'>
        <h5 className='text-primary'>Identifiers</h5>
        <div className='row'>
          {config &&
            config.searchFields &&
            Object.entries(config.searchFields)
              .filter(([_, { type }]) => type === 'select')
              .map(([field, { type, label, options }]) => (
                <div className='col-md-4 mb-3' key={field}>
                  {renderInputField(field, type, label, options)}
                </div>
              ))}
        </div>
      </div>

      <div className='mb-3'>
        <h5 className='text-primary'>Dates</h5>
        <div className='row'>
          {config &&
            config.searchFields &&
            Object.entries(config.searchFields)
              .filter(([_, { type }]) => type === 'date_range')
              .map(([field, { type, label, options }]) => (
                <div className='col-md-4 mb-3' key={field}>
                  {renderInputField(field, type, label, options)}
                </div>
              ))}
        </div>
      </div>

      {/* <div className='mb-3'>
        <h5 className='text-primary'>Amounts and Terms</h5>
        <div className='row'>
          {config &&
            config.searchFields &&
            Object.entries(config.searchFields)
              .filter(([_, { type }]) => type === 'range' || type === 'number')
              .map(([field, { type, label, options }]) => (
                <div className='col-md-4 mb-3' key={field}>
                  {renderInputField(field, type, label, options)}
                </div>
              ))}
        </div>
      </div> */}

      <div className='mb-3'>
        <h5 className='text-primary'>Boolean Values</h5>
        <div className='row'>
          {config &&
            config.searchFields &&
            Object.entries(config.searchFields)
              .filter(
                ([_, { type }]) =>
                  type === 'boolean' || type === 'nullable_boolean'
              )
              .map(([field, { type, label, options }]) => (
                <div className='col-md-4 mb-3' key={field}>
                  {renderInputField(field, type, label, options)}
                </div>
              ))}
        </div>
      </div>

      <div className='row text-end'>
        <div className='col-md-auto ms-auto'>
          <button
            className='btn btn-info btn-sm d-flex align-items-center'
            onClick={() => {
              setSearchParams({});
              setDateRanges({});
              setRequiredFields({});
              setExpandedRows({});
              setSearchResults([]);
            }}
            disabled={loading}
          >
            <GiEmptyMetalBucket className='me-2' size={25} />
            {loading ? 'Searching...' : 'Clear'}
          </button>
        </div>
        <div className='col-md-auto'>
          <button
            className='btn btn-success btn-sm d-flex align-items-center'
            onClick={handleSearch}
            disabled={loading}
          >
            <FaSearch className='me-2' size={20} />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </div>
      {errors && (
        <div className=' alert alert-danger text-center mt-3'>
          {renderErrors(errors)}
        </div>
      )}
    </div>
  );
};

export default GlobalSearchComponent;
