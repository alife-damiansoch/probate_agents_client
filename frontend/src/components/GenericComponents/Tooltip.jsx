import AnimatedWrapper from '../GenericFunctions/AnimationFuctions';

const Tooltip = ({ content, visible }) => {
  const wrapperStyle = {
    position: 'relative',
    width: '0px',
    height: '0px',
    overflow: 'visible',
  };

  const tooltipStyle = {
    position: 'absolute',
    bottom: '0px',
    left: '0px',
    padding: '8px',
    backgroundColor: '#ffffff',
    border: '1px solid #ccc',
    borderRadius: '4px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
    zIndex: 10000,
    width: '300px',
    fontSize: '12px',
    overflowWrap: 'break-word',
  };

  // Add a specific CSS class to handle the spacing between `<p>` tags
  const paragraphStyle = {
    margin: '2px 0', // Adjust this value to control line spacing
    padding: '0', // Remove additional padding
  };

  return (
    <div style={wrapperStyle}>
      <AnimatedWrapper
        variants={{
          hidden: { opacity: 0, scaleY: 0 },
          visible: { opacity: 1, scaleY: 1 },
          exit: { opacity: 0, scaleY: 0 },
        }}
        animate={visible ? 'visible' : 'hidden'}
      >
        <div style={tooltipStyle}>
          <div
            style={paragraphStyle}
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </AnimatedWrapper>
    </div>
  );
};

export default Tooltip;
