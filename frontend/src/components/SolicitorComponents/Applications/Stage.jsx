import  { useEffect } from 'react';
import { MdDoneAll, MdOutlineRemoveDone } from 'react-icons/md';
import { SiStagetimer } from 'react-icons/si';
import { TbFaceIdError } from 'react-icons/tb';

const Stage = ({
  stage,
  completed,
  rejected,
  advancement,
  setRejectedInAnyStage,
  setApprovedInAnyStage,
}) => {
  // Use a single useEffect to handle all state updates
  useEffect(() => {
    if (rejected === true) {
      setRejectedInAnyStage(true);
    } else {
      if (rejected === false && completed !== undefined && advancement) {
        if (
          completed === true &&
          advancement !== null &&
          advancement.needs_committee_approval === true &&
          advancement.is_committee_approved === false
        ) {
          setRejectedInAnyStage(true);
        }

        if (
          completed === true &&
          advancement !== null &&
          advancement.needs_committee_approval === false
        ) {
          setApprovedInAnyStage(true);
        }

        if (
          completed === true &&
          advancement !== null &&
          advancement.needs_committee_approval === true &&
          advancement.is_committee_approved === true
        ) {
          setApprovedInAnyStage(true);
        }

        // Determine if the stage should be hidden
      }
    }
  }, [
    completed,
    rejected,
    advancement,
    setRejectedInAnyStage,
    setApprovedInAnyStage,
  ]);

  if (stage === 'Approved') {
    if (!completed && !rejected) {
      return (
        <div className='d-flex flex-column align-items-center mb-1 stage-component'>
          <SiStagetimer
            className='stage-icon icon-shadow'
            color='orange'
            size={20}
          />
          <span className='text-center text-warning'>
            Awaiting decission ...
          </span>
        </div>
      );
    }

    if (!completed && rejected) {
      return (
        <div className='d-flex flex-column align-items-center mb-1 stage-component'>
          <TbFaceIdError
            className='stage-icon icon-shadow'
            color='red'
            size={20}
          />
          <span className='text-danger'>Rejected</span>
        </div>
      );
    }

    if (completed && advancement?.needs_committee_approval === false) {
      return (
        <div className='d-flex flex-column align-items-center mb-1 stage-component'>
          <MdDoneAll
            className='stage-icon icon-shadow'
            color='green'
            size={20}
          />
          <span className='text-success'>Approved</span>
        </div>
      );
    }

    if (
      completed &&
      advancement?.needs_committee_approval &&
      advancement?.is_committee_approved
    ) {
      return (
        <div className='d-flex flex-column align-items-center mb-1 stage-component'>
          <MdDoneAll
            className='stage-icon icon-shadow'
            color='green'
            size={20}
          />
          <span className='text-success'>Approved by committee</span>
        </div>
      );
    }

    if (
      completed &&
      advancement?.needs_committee_approval &&
      advancement?.is_committee_approved === false
    ) {
      return (
        <div className='d-flex flex-column align-items-center mb-1 stage-component'>
          <TbFaceIdError
            className='stage-icon icon-shadow'
            color='red'
            size={20}
          />
          <span className='text-danger'>Rejected by committee</span>
        </div>
      );
    }

    if (
      completed &&
      advancement?.needs_committee_approval &&
      advancement?.is_committee_approved === null
    ) {
      return (
        <div className='d-flex flex-column align-items-center mb-1 stage-component'>
          <SiStagetimer
            className='stage-icon icon-shadow'
            color='orange'
            size={20}
          />
          <span className='text-warning'>Awaiting commitee decision...</span>
        </div>
      );
    }
  }
  // Default rendering for other stages
  return (
    <>
      <div className='d-flex flex-column align-items-center mb-1 stage-component'>
        {completed ? (
          <MdDoneAll
            className='stage-icon icon-shadow'
            color='green'
            size={20}
          />
        ) : (
          <MdOutlineRemoveDone
            className='stage-icon icon-shadow'
            color='red'
            size={20}
          />
        )}
        <span
          className={`text-center ${
            completed ? 'text-success' : 'text-danger'
          }`}
        >
          {stage}
        </span>
      </div>
    </>
  );
};

export default Stage;
