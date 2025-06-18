// src/components/ApplicationDetailStages/ApplicationDetailStagesParts/AgentInstructionAlert.js

const AgentInstructionAlert = ({ incompleteSteps }) => {
  if (incompleteSteps.length === 0) return null;

  return (
    <div
      className='alert py-2 px-3 mb-3'
      style={{
        backgroundColor: '#fefbf3',
        border: '1px solid #fed7aa',
        borderRadius: '8px',
      }}
    >
      <div className='d-flex align-items-center'>
        <span style={{ fontSize: '1rem', marginRight: '8px' }}>📞</span>
        <div>
          <strong style={{ color: '#d97706', fontSize: '0.85rem' }}>
            Instruct User:
          </strong>
          <span
            style={{
              color: '#374151',
              fontSize: '0.85rem',
              marginLeft: '4px',
            }}
          >
            {incompleteSteps.map((step) => step.title).join(', ')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AgentInstructionAlert;
