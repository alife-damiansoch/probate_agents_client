import { Calendar, Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const DatePicker = ({ value, onChange, placeholder, loanBookCreatedAt }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

  // Parse min and max dates properly with FIXED 365-day year
  const minDate = loanBookCreatedAt
    ? (() => {
        const parts = loanBookCreatedAt.split('T')[0].split('-');
        return new Date(
          parseInt(parts[0]),
          parseInt(parts[1]) - 1,
          parseInt(parts[2])
        );
      })()
    : null;

  const maxDate = minDate
    ? (() => {
        const maxDate = new Date(minDate);
        // FIXED: Use exactly 3 * 365 days (not 365 * 3 which could include leap years)
        maxDate.setDate(maxDate.getDate() + 3 * 365 - 1); // exactly 1095 days
        return maxDate;
      })()
    : null;

  // Calculate yearly fixed rate transition date (exactly 365 days from creation)
  const yearlyRateTransitionDate = minDate
    ? (() => {
        const transitionDate = new Date(minDate);
        // FIXED: Use exactly 365 days, not 1 year (which could be 366 in leap year)
        transitionDate.setDate(transitionDate.getDate() + 365 - 1);
        return transitionDate;
      })()
    : null;

  useEffect(() => {
    if (value) {
      // Parse the date string directly to avoid timezone issues
      const parts = value.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0]);
        const month = parseInt(parts[1]) - 1; // Month is 0-indexed
        const day = parseInt(parts[2]);
        const date = new Date(year, month, day);
        setSelectedDate(date);
        setCurrentMonth(date.getMonth());
        setCurrentYear(date.getFullYear());
      }
    }
  }, [value]);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const isDateInCurrentMonth = (date) => {
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  };

  const isDateDisabled = (date) => {
    if (!minDate || !maxDate) return false;
    return date < minDate || date > maxDate;
  };

  const isDateSelected = (date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isYearlyRateTransition = (date) => {
    if (!yearlyRateTransitionDate) return false;
    return date.toDateString() === yearlyRateTransitionDate.toDateString();
  };

  const handleDateSelect = (date) => {
    if (isDateDisabled(date)) return;
    setSelectedDate(date);
    // Format date properly to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    onChange(dateString);
    setIsOpen(false);
  };

  const handleQuickSelect = (date) => {
    setSelectedDate(date);
    setCurrentMonth(date.getMonth());
    setCurrentYear(date.getFullYear());
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    onChange(dateString);
    setIsOpen(false);
  };

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const formatDisplayDate = () => {
    if (value) {
      return new Date(value).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
    return placeholder || 'Select date';
  };

  const clearSelection = () => {
    setSelectedDate(null);
    onChange('');
    setIsOpen(false);
  };

  const days = getDaysInMonth(currentYear, currentMonth);

  return (
    <>
      <div className='position-relative'>
        {/* Trigger Input */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className='d-flex align-items-center justify-content-between position-relative overflow-hidden'
          style={{
            padding: '16px 20px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            fontSize: '15px',
            minHeight: '56px',
            boxShadow:
              '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow =
              '0 8px 30px rgba(0, 0, 0, 0.12), 0 4px 8px rgba(0, 0, 0, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow =
              '0 4px 20px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <div className='d-flex align-items-center gap-3'>
            <div
              className='d-flex align-items-center justify-content-center'
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)',
              }}
            >
              <Calendar size={16} className='text-white' />
            </div>
            <span className={`${value ? 'text-dark fw-medium' : 'text-muted'}`}>
              {formatDisplayDate()}
            </span>
          </div>

          <div
            className='d-flex align-items-center justify-content-center'
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '6px',
              background: 'rgba(0, 0, 0, 0.05)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'all 0.2s ease',
            }}
          >
            <ChevronLeft
              size={14}
              className='text-muted'
              style={{ transform: 'rotate(-90deg)' }}
            />
          </div>
        </div>

        {/* Date Range Info & Quick Select */}
        {minDate && maxDate && yearlyRateTransitionDate && (
          <div className='mt-3'>
            <div
              className='px-4 py-3 rounded-xl mb-2'
              style={{
                background:
                  'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)',
                border: '1px solid rgba(99, 102, 241, 0.15)',
              }}
            >
              <div className='small text-muted d-flex align-items-center justify-content-between'>
                <span>
                  Valid range: <strong>{minDate.toLocaleDateString()}</strong>
                </span>
                <span>
                  to <strong>{maxDate.toLocaleDateString()}</strong>
                </span>
              </div>
              <div className='small text-muted mt-1'>
                <span>
                  Maximum term: <strong>3 × 365 days (1,095 days total)</strong>
                </span>
              </div>
            </div>

            {/* Yearly Rate Transition Quick Select */}
            <div
              onClick={() => handleQuickSelect(yearlyRateTransitionDate)}
              className='px-4 py-3 rounded-xl position-relative overflow-hidden'
              style={{
                background:
                  'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)',
                border: '2px solid rgba(239, 68, 68, 0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  'translateY(-1px) scale(1.02)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                e.currentTarget.style.boxShadow =
                  '0 8px 25px rgba(239, 68, 68, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Animated background effect */}
              <div
                className='position-absolute top-0 start-0 w-100 h-100'
                style={{
                  background:
                    'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%)',
                  animation: 'shimmer 3s infinite',
                  transform: 'translateX(-100%)',
                }}
              />

              <div className='d-flex align-items-center justify-content-between position-relative'>
                <div className='d-flex align-items-center gap-3'>
                  <div
                    className='d-flex align-items-center justify-content-center'
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background:
                        'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)',
                    }}
                  >
                    <Calendar size={16} className='text-white' />
                  </div>
                  <div>
                    <div
                      className='fw-bold text-dark'
                      style={{ fontSize: '14px' }}
                    >
                      Rate Transition Date
                    </div>
                    <div className='small text-danger fw-medium'>
                      {yearlyRateTransitionDate.toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}{' '}
                      <span className='text-muted'>(+365 days)</span>
                    </div>
                  </div>
                </div>

                <div className='d-flex align-items-center gap-2'>
                  <span
                    className='badge px-2 py-1 small fw-medium'
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.15) 100%)',
                      color: '#dc2626',
                      border: '1px solid rgba(239, 68, 68, 0.2)',
                      borderRadius: '6px',
                    }}
                  >
                    Daily Interest Starts
                  </span>
                  <div
                    className='d-flex align-items-center justify-content-center'
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '6px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: '#dc2626',
                    }}
                  >
                    <ChevronRight size={12} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className='position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center'
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(20px)',
            zIndex: 99999,
            animation: 'fadeIn 0.3s ease',
          }}
          onClick={() => setIsOpen(false)}
        >
          <div
            className='bg-white shadow-lg m-3'
            style={{
              borderRadius: '24px',
              maxWidth: '380px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
              boxShadow:
                '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.8)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className='p-5 text-center'>
              <div
                className='d-inline-flex align-items-center justify-content-center mb-3'
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  background:
                    'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
                }}
              >
                <Calendar size={28} className='text-white' />
              </div>
              <h4 className='fw-bold text-dark mb-1'>Select Date</h4>
              <p className='text-muted mb-0 small'>
                Choose your statement date
              </p>
            </div>

            {/* Calendar Navigation */}
            <div className='px-5 pb-3'>
              <div className='d-flex align-items-center justify-content-between mb-4'>
                <button
                  onClick={() => navigateMonth('prev')}
                  className='btn btn-sm d-flex align-items-center justify-content-center p-0'
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(99, 102, 241, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

                <div className='text-center'>
                  <h5 className='fw-bold text-dark mb-0'>
                    {monthNames[currentMonth]} {currentYear}
                  </h5>
                </div>

                <button
                  onClick={() => navigateMonth('next')}
                  className='btn btn-sm d-flex align-items-center justify-content-center p-0'
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '12px',
                    border: 'none',
                    background: 'rgba(99, 102, 241, 0.1)',
                    color: '#6366f1',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(99, 102, 241, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(99, 102, 241, 0.1)';
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Day Headers */}
              <div className='row g-1 mb-2'>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <div key={day} className='col text-center'>
                    <div className='small text-muted fw-medium py-2'>{day}</div>
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className='row g-1'>
                {days.map((date, index) => {
                  const isCurrentMonth = isDateInCurrentMonth(date);
                  const isDisabled = isDateDisabled(date);
                  const isSelected = isDateSelected(date);
                  const isTodayDate = isToday(date);
                  const isTransitionDate = isYearlyRateTransition(date);
                  const isHovered =
                    hoveredDate &&
                    date.toDateString() === hoveredDate.toDateString();

                  return (
                    <div key={index} className='col'>
                      <button
                        onClick={() => handleDateSelect(date)}
                        onMouseEnter={() => setHoveredDate(date)}
                        onMouseLeave={() => setHoveredDate(null)}
                        disabled={isDisabled}
                        className='btn w-100 d-flex align-items-center justify-content-center p-0'
                        style={{
                          height: '40px',
                          borderRadius: '12px',
                          border:
                            isTransitionDate && !isSelected
                              ? '2px solid #ef4444'
                              : 'none',
                          fontSize: '14px',
                          fontWeight:
                            isSelected || isTransitionDate ? '600' : '500',
                          color: isDisabled
                            ? '#d1d5db'
                            : isSelected
                            ? 'white'
                            : isTransitionDate
                            ? '#ef4444'
                            : isCurrentMonth
                            ? '#374151'
                            : '#9ca3af',
                          background: isSelected
                            ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                            : isTransitionDate && !isSelected
                            ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(220, 38, 38, 0.1) 100%)'
                            : isHovered && !isDisabled
                            ? 'rgba(99, 102, 241, 0.1)'
                            : isTodayDate && isCurrentMonth
                            ? 'rgba(99, 102, 241, 0.05)'
                            : 'transparent',
                          cursor: isDisabled ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s ease',
                          transform:
                            isSelected || isTransitionDate
                              ? 'scale(1.05)'
                              : 'scale(1)',
                          boxShadow: isSelected
                            ? '0 4px 12px rgba(99, 102, 241, 0.4)'
                            : isTransitionDate && !isSelected
                            ? '0 2px 8px rgba(239, 68, 68, 0.2)'
                            : 'none',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Transition date pulse effect */}
                        {isTransitionDate && !isSelected && (
                          <div
                            className='position-absolute top-0 start-0 w-100 h-100'
                            style={{
                              background:
                                'linear-gradient(45deg, transparent 30%, rgba(239, 68, 68, 0.1) 50%, transparent 70%)',
                              animation: 'pulse 2s infinite',
                            }}
                          />
                        )}
                        <span className='position-relative'>
                          {date.getDate()}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className='p-5 pt-3'>
              <div className='d-flex gap-3'>
                <button
                  onClick={clearSelection}
                  className='btn flex-fill d-flex align-items-center justify-content-center gap-2'
                  style={{
                    borderRadius: '16px',
                    padding: '14px',
                    fontWeight: '600',
                    border: '1px solid #e5e7eb',
                    background: 'white',
                    color: '#6b7280',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.borderColor = '#d1d5db';
                    e.target.style.background = '#f9fafb';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.background = 'white';
                  }}
                >
                  <X size={16} />
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  disabled={!selectedDate}
                  className='btn flex-fill d-flex align-items-center justify-content-center gap-2'
                  style={{
                    background: selectedDate
                      ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                      : '#f3f4f6',
                    color: selectedDate ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '16px',
                    padding: '14px',
                    fontWeight: '600',
                    cursor: selectedDate ? 'pointer' : 'not-allowed',
                    transition: 'all 0.2s ease',
                    boxShadow: selectedDate
                      ? '0 4px 12px rgba(99, 102, 241, 0.3)'
                      : 'none',
                  }}
                >
                  <Check size={16} />
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </>
  );
};

export default DatePicker;
