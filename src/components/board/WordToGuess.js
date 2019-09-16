import React from 'react';

function WordToGuess(props) {
  const wordToDisplay = props.userRole === 'drawer' ? props.drawersWord : props.word;

  return (
    <div className="current-word">
      {props.roundInProgress ? wordToDisplay : ''}
    </div>
  );
}

export default WordToGuess;
