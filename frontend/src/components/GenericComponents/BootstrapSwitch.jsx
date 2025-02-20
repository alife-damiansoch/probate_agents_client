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

  return (
    <div
      className='form-check form-switch'
      style={visible ? {} : { display: 'none' }}
    >
      <input
        className='form-check-input'
        type='checkbox'
        id={my_id}
        checked={isChecked}
        onChange={handleToggle}
      />
      <label className='form-check-label' htmlFor={my_id}>
        {isChecked ? isCheckedMessage : isNotCheckedMessage}
      </label>
    </div>
  );
};

export default BootstrapSwitch;
