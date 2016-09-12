import React, { PropTypes } from 'react';

import './NamedCorpse.css';

const NamedCorpse = (props) => (
  <div className="SmallText">
    <h2 className="NamedCorpse-corpseName">{`"${props.corpseName}"`}</h2>
    <h3 className="NamedCorpse-name">{props.name}</h3>
    <p>
      {props.text}
    </p>
  </div>
);

NamedCorpse.propTypes = {
  corpseName: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default NamedCorpse;
