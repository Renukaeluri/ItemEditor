import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = props => (
  <div>
    <label className="form-label">{props.title}</label>
    <div className="checkbox-group">
          <label className="form-label capitalize">
            <input
              className="form-checkbox"
              onChange={props.controlFunc}
              value={props.selectedOption}
              checked={props.selectedOption}
              type={props.type}
            />
          </label>
    </div>
  </div>
);


Checkbox.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.oneOf (['checkbox', 'radio']).isRequired,
  selectedOptions: PropTypes.bool,
  controlFunc: PropTypes.func.isRequired,
};

export default Checkbox;
