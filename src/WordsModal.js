import React from 'react';

const WordsModal = (props) => {
  const showHideClassName = props.showing ? 'showing' : 'hidden';

  return (
    <div className={`words-modal ${showHideClassName}`}>
      <h2>Choose a word</h2>
      <div className="words-container">
        {props.words.map(word => (
          <span className="word" key={word}>
            {word}
          </span>
        ))}
      </div>
    </div>
  );
};

export default WordsModal;
