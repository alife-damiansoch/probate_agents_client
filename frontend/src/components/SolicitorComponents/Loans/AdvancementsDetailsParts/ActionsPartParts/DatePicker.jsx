// DatePicker.jsx
import { Calendar, Check, ChevronDown, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const DatePicker = ({ value, onChange, placeholder, loanBookCreatedAt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  // Calculate date ranges
  const getDateRanges = () => {
    if (!loanBookCreatedAt) return { years: [], months: [], days: [] };

    const createdDate = new Date(loanBookCreatedAt);
    const maxDate = new Date(createdDate);
    maxDate.setMonth(createdDate.getMonth() + 36);

    const currentDate = new Date();
    const startYear = createdDate.getFullYear();
    const endYear = maxDate.getFullYear();

    const years = [];
    for (let year = startYear; year <= endYear; year++) {
      years.push(year);
    }

    return { years, createdDate, maxDate };
  };

  const { years, createdDate, maxDate } = getDateRanges();

  // Get available months for selected year
  const getAvailableMonths = (year) => {
    if (!year || !createdDate || !maxDate) return [];

    const months = [];
    const startMonth =
      year === createdDate.getFullYear() ? createdDate.getMonth() : 0;
    const endMonth = year === maxDate.getFullYear() ? maxDate.getMonth() : 11;

    for (let month = startMonth; month <= endMonth; month++) {
      months.push({
        value: month,
        name: new Date(year, month).toLocaleDateString('en-US', {
          month: 'long',
        }),
      });
    }

    return months;
  };

  // Get available days for selected year/month
  const getAvailableDays = (year, month) => {
    if (!year || month === '' || !createdDate || !maxDate) return [];

    const days = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let startDay = 1;
    let endDay = daysInMonth;

    if (
      year === createdDate.getFullYear() &&
      month === createdDate.getMonth()
    ) {
      startDay = createdDate.getDate();
    }

    if (year === maxDate.getFullYear() && month === maxDate.getMonth()) {
      endDay = maxDate.getDate();
    }

    for (let day = startDay; day <= endDay; day++) {
      days.push(day);
    }

    return days;
  };

  // Handle date selection
  const handleDateSelect = (year, month, day) => {
    if (year && month !== '' && day) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      onChange(dateString);
      setIsOpen(false);
    }
  };

  // Parse current value
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedYear(date.getFullYear());
      setSelectedMonth(date.getMonth());
      setSelectedDay(date.getDate());
    } else {
      setSelectedYear('');
      setSelectedMonth('');
      setSelectedDay('');
    }
  }, [value]);

  const formatDisplayDate = () => {
    if (value) {
      return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    }
    return placeholder || 'Select date';
  };

  const availableMonths = getAvailableMonths(selectedYear);
  const availableDays = getAvailableDays(selectedYear, selectedMonth);

  const clearSelection = () => {
    setSelectedYear('');
    setSelectedMonth('');
    setSelectedDay('');
    onChange('');
    setIsOpen(false);
  };

  return (
    <>
      <div className='position-relative'>
        {/* Main Input Display */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className='form-control d-flex align-items-center justify-content-between'
          style={{
            padding: '16px 20px',
            borderRadius: '12px',
            border: '2px solid #e5e7eb',
            background: 'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '1rem',
            minHeight: '56px',
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#667eea';
            e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#e5e7eb';
            e.target.style.boxShadow = 'none';
          }}
        >
          <div className='d-flex align-items-center gap-3'>
            <Calendar size={20} className='text-muted' />
            <span className={value ? 'text-dark fw-medium' : 'text-muted'}>
              {formatDisplayDate()}
            </span>
          </div>
          <ChevronDown
            size={20}
            className='text-muted'
            style={{
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </div>

        {/* Show max date info */}
        {maxDate && (
          <div className='mt-2 small text-muted'>
            <span>
              Available until: <strong>{maxDate.toLocaleDateString()}</strong>{' '}
              (36 months from loan creation)
            </span>
          </div>
        )}
      </div>

      {/* Fullscreen Modal Overlay */}
      {isOpen && (
        <div
          className='position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(12px)',
            zIndex: 99999, // Much higher z-index to be above everything
            animation: 'fadeIn 0.3s ease',
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
        >
          <div
            className='bg-white rounded-4 shadow-lg p-0 m-3'
            style={{
              maxWidth: '420px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className='p-4 border-bottom'
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '1rem 1rem 0 0',
              }}
            >
              <div className='d-flex align-items-center justify-content-between'>
                <div className='d-flex align-items-center gap-3'>
                  <div
                    className='bg-white bg-opacity-20 rounded-3 p-2'
                    style={{ backdropFilter: 'blur(10px)' }}
                  >
                    <Calendar size={20} className='text-white' />
                  </div>
                  <div>
                    <h5 className='text-white fw-bold mb-0'>Select Date</h5>
                    <p className='text-white opacity-75 mb-0 small'>
                      Choose your statement date
                    </p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className='btn btn-sm bg-white bg-opacity-20 border-0 text-white rounded-3'
                  style={{
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className='p-4'>
              {/* Year Selection */}
              <div className='mb-4'>
                <label className='form-label fw-semibold text-dark mb-2'>
                  Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(parseInt(e.target.value));
                    setSelectedMonth('');
                    setSelectedDay('');
                  }}
                  className='form-select'
                  style={{
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    background:
                      'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                  }}
                >
                  <option value=''>Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              {/* Month Selection */}
              <div className='mb-4'>
                <label className='form-label fw-semibold text-dark mb-2'>
                  Month
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => {
                    setSelectedMonth(parseInt(e.target.value));
                    setSelectedDay('');
                  }}
                  disabled={!selectedYear}
                  className='form-select'
                  style={{
                    borderRadius: '10px',
                    border: '2px solid #e5e7eb',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    background:
                      'linear-gradient(135deg, #ffffff 0%, #f9fafb 100%)',
                    opacity: selectedYear ? 1 : 0.6,
                  }}
                >
                  <option value=''>Select Month</option>
                  {availableMonths.map((month) => (
                    <option key={month.value} value={month.value}>
                      {month.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Day Selection */}
              <div className='mb-4'>
                <label className='form-label fw-semibold text-dark mb-2'>
                  Day
                </label>
                <div
                  className='border rounded-3 p-3'
                  style={{
                    background:
                      'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                    maxHeight: '180px',
                    overflowY: 'auto',
                  }}
                >
                  {availableDays.length > 0 ? (
                    <div className='row g-2'>
                      {availableDays.map((day) => (
                        <div key={day} className='col-3'>
                          <button
                            onClick={() => setSelectedDay(day)}
                            className={`btn w-100 ${
                              selectedDay === day
                                ? 'btn-primary'
                                : 'btn-outline-secondary'
                            }`}
                            style={{
                              borderRadius: '8px',
                              padding: '8px',
                              fontSize: '0.9rem',
                              background:
                                selectedDay === day
                                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                  : 'white',
                              border:
                                selectedDay === day
                                  ? 'none'
                                  : '1px solid #dee2e6',
                            }}
                          >
                            {day}
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className='text-muted text-center mb-0'>
                      {!selectedYear
                        ? 'Select a year first'
                        : 'Select a month first'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className='p-4 border-top' style={{ background: '#f8fafc' }}>
              <div className='d-flex gap-3'>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearSelection();
                  }}
                  className='btn btn-outline-secondary flex-fill'
                  style={{
                    borderRadius: '10px',
                    padding: '12px',
                    fontWeight: '500',
                  }}
                >
                  <X size={16} className='me-2' />
                  Clear
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDateSelect(selectedYear, selectedMonth, selectedDay);
                  }}
                  disabled={
                    !selectedYear || selectedMonth === '' || !selectedDay
                  }
                  className='btn flex-fill'
                  style={{
                    background:
                      selectedYear && selectedMonth !== '' && selectedDay
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : '#e9ecef',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontWeight: '600',
                    cursor:
                      selectedYear && selectedMonth !== '' && selectedDay
                        ? 'pointer'
                        : 'not-allowed',
                  }}
                >
                  <Check size={16} className='me-2' />
                  Confirm Date
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
};

export default DatePicker;
