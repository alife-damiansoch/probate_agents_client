import { useEffect, useRef } from 'react';

function AutoResizingTextarea({ value, onChange, readOnly, className }) {
  const textareaRef = useRef(null);

  // Resizing logic
  const resizeTextarea = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "38px"; // Reset first (base height)
      textarea.style.height = textarea.scrollHeight + "px";
    }
  };

  // Resize when value changes
  useEffect(() => {
    resizeTextarea();
  }, [value]);

  return (
    <textarea
      ref={textareaRef}
      className={className}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      rows={1}
      style={{
        resize: "none",
        overflow: "hidden",
        minHeight: "38px",
        height: "auto",
      }}
      onInput={resizeTextarea}
    />
  );
}

export default AutoResizingTextarea;
