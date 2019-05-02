import React from 'react';

const WordsModal = (props) => {
  const showHideClassName = props.showing ? 'showing' : 'hidden';

  return (
    <div className={`words-modal ${showHideClassName}`}>
      <h1>Choose a word</h1>
      <div className="words-container">
        {props.words.map(word => (
          <span>
            {word}
          </span>
        ))}
      </div>

      <button type="button" onClick={props.handleClose}>close</button>
    </div>
  );
};

export default WordsModal;
