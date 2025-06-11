const BootstrapSwitch = ({
  isChecked,
  setIsChecked,
  isCheckedMessage,
  isNotCheckedMessage,
  my_id,
  visible = true,
}) => {
  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  if (!visible) {
    return null;
  }

  return (
    <div
      className='d-flex align-items-center gap-3 p-3 rounded-3 border position-relative'
      style={{
        background: isChecked
          ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
          : 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
        border: '1px solid',
        borderColor: isChecked ? '#bbf7d0' : '#e2e8f0',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Custom Toggle Switch */}
      <div className='position-relative'>
        <input
          className='position-absolute opacity-0'
          type='checkbox'
          id={my_id}
          checked={isChecked}
          onChange={handleToggle}
          style={{
            width: '56px',
            height: '28px',
            cursor: 'pointer',
            zIndex: 2,
          }}
        />
        <div
          className='rounded-pill position-relative d-flex align-items-center'
          style={{
            width: '56px',
            height: '28px',
            background: isChecked
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'linear-gradient(135deg, #d1d5db 0%, #9ca3af 100%)',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            boxShadow: isChecked
              ? '0 4px 12px rgba(16, 185, 129, 0.3)'
              : '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
          onClick={handleToggle}
        >
          {/* Toggle Slider */}
          <div
            className='position-absolute bg-white rounded-circle d-flex align-items-center justify-content-center'
            style={{
              width: '22px',
              height: '22px',
              left: isChecked ? '31px' : '3px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transform: 'translateZ(0)',
            }}
          >
            {/* Icon inside toggle */}
            {isChecked ? (
              <svg width='12' height='12' fill='#10b981' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            ) : (
              <svg width='12' height='12' fill='#6b7280' viewBox='0 0 20 20'>
                <path
                  fillRule='evenodd'
                  d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                  clipRule='evenodd'
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Status Content */}
      <div className='flex-grow-1'>
        <div className='d-flex align-items-center gap-2'>
          {/* Status Icon */}
          <div
            className='d-flex align-items-center justify-content-center rounded-2'
            style={{
              width: '24px',
              height: '24px',
              background: isChecked
                ? 'rgba(16, 185, 129, 0.1)'
                : 'rgba(107, 114, 128, 0.1)',
              color: isChecked ? '#059669' : '#6b7280',
            }}
          >
            {isChecked ? (
              <svg
                width='14'
                height='14'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                  clipRule='evenodd'
                />
              </svg>
            ) : (
              <svg
                width='14'
                height='14'
                fill='currentColor'
                viewBox='0 0 20 20'
              >
                <path
                  fillRule='evenodd'
                  d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                  clipRule='evenodd'
                />
              </svg>
            )}
          </div>

          {/* Status Text */}
          <label
            className='mb-0 fw-semibold user-select-none'
            htmlFor={my_id}
            style={{
              color: isChecked ? '#065f46' : '#374151',
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'color 0.3s ease',
            }}
          >
            {isChecked ? isCheckedMessage : isNotCheckedMessage}
          </label>
        </div>

        {/* Status Description */}
        <div
          className='mt-1'
          style={{
            fontSize: '0.75rem',
            color: isChecked ? '#059669' : '#6b7280',
          }}
        >
          {isChecked
            ? 'Feature is currently enabled'
            : 'Feature is currently disabled'}
        </div>
      </div>

      {/* Subtle Background Pattern */}
      <div
        className='position-absolute w-100 h-100 opacity-5 rounded-3'
        style={{
          background: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.05'%3E%3Ccircle cx='3' cy='3' r='1'/%3E%3C/g%3E%3C/svg%3E")`,
          top: 0,
          left: 0,
          pointerEvents: 'none',
        }}
      ></div>
    </div>
  );
};

export default BootstrapSwitch;
