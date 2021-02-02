import React from 'react';
import PropTypes from 'prop-types';


const SingleInput = props => (
  <div className="form-group">
    <label className="form-label">{props.title}</label> <br />
    <input
      className="form-input"
      name={props.name}
      type={props.inputType}
      value = {props.value}
      onChange = {props.onChange}
    />
  </div>
);

SingleInput.propTypes = {
  inputType: PropTypes.oneOf (['text', 'number']).isRequired,
  value: PropTypes.string.isRequired || PropTypes.oneOf (['text', 'number']).isRequired,
  title: PropTypes.string.isRequired,
};

export default SingleInput;