import React from 'react';

const RoundOverModal = (props) => {
  const showHideClassName = props.showing ? 'showing' : 'hidden';

  return (
    <div className={`round-over-modal ${showHideClassName}`}>
      <h2>{`The word was: ${props.word}`}</h2>
    </div>
  );
};

export default RoundOverModal;
