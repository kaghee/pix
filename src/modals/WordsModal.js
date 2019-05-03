// import React from 'react';
//
// const WordsModal = (props) => {
//   const showHideClassName = props.showing ? 'showing' : 'hidden';
//
//   return (
//     <div className={`words-modal ${showHideClassName}`}>
//       <h2>Choose a word</h2>
//       <div className="words-container">
//         {props.words.map(word => (
//           <span
//             className="word"
//             key={word}
//             role="button"
//             onClick={() => props.onSelectWord(word)}
//             onKeyPress={() => props.onSelectWord(word)}
//             tabIndex={0}
//           >
//             {word}
//           </span>
//         ))}
//       </div>
//     </div>
//   );
// };
//
// export default WordsModal;

import React from 'react';

const WordsModal = (props) => {
  const showHideClassName = props.showing ? 'showing' : 'hidden';
  let modalContent = {};

  if (props.userRole === 'drawer') {
    modalContent = (
      <div className={`words-modal ${showHideClassName}`}>
        <h2>Choose a word</h2>
        <div className="words-container">
          {props.words.map(word => (
            <span
              className="word"
              key={word}
              role="button"
              onClick={() => props.onSelectWord(word)}
              onKeyPress={() => props.onSelectWord(word)}
              tabIndex={0}
            >
              {word}
            </span>
          ))}
        </div>
      </div>
    );
  } else {
    modalContent = (
      <div className={`words-modal ${showHideClassName}`}>
        <h2>{`${props.userChoosing} is choosing a word...`}</h2>
      </div>
    );
  }

  return modalContent;
};

export default WordsModal;
