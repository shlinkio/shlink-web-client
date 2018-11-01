import React from 'react';
import { isNil } from 'ramda';
import DatePicker from 'react-datepicker';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import calendarIcon from '@fortawesome/fontawesome-free-regular/faCalendarAlt';
import './DateInput.scss';

export default class DateInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = props.ref || React.createRef();
  }

  render() {
    const { className, isClearable, selected } = this.props;
    const showCalendarIcon = !isClearable || isNil(selected);

    return (
      <div className="date-input-container">
        <DatePicker
          {...this.props}
          className={`date-input-container__input form-control ${className || ''}`}
          dateFormat="YYYY-MM-DD"
          readOnly
          ref={this.inputRef}
        />
        {showCalendarIcon && (
          <FontAwesomeIcon
            icon={calendarIcon}
            className="date-input-container__icon"
            onClick={() => this.inputRef.current.input.focus()}
          />
        )}
      </div>
    );
  }
}
