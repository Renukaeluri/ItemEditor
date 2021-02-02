import React from 'react';
import PropTypes from 'prop-types';


const Select = props => (
  <div className="form-group">
    <label className="form-label">{props.title}</label> <br />
    <select
      name={props.name}
      value={props.selectedOption}
      onChange={props.controlFunc}
      className="form-select"
    >
      {props.options.map (opt => {
        return <option key={opt.optionValue} value={opt.optionName}>{opt.optionName}</option>;
      })}
    </select>
  </div>
);

Select.propTypes = {
  options: PropTypes.array.isRequired,
  selectedOption: PropTypes.string,
  controlFunc: PropTypes.func.isRequired,
};

export default Select;
