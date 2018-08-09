import calendarIcon from '@fortawesome/fontawesome-free-regular/faCalendarAlt';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import React from 'react';
import DatePicker from 'react-datepicker';
import './DateInput.scss';
import { isNil } from 'ramda';

export default class DateInput extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  render() {
    const { isClearable, selected } = this.props;
    const showCalendarIcon = !isClearable || isNil(selected);

    return (
      <div className="date-input-container">
        <DatePicker
          {...this.props}
          className={`date-input-container__input form-control ${this.props.className || ''}`}
          dateFormat="YYYY-MM-DD"
          readOnly
          ref={this.inputRef}
        />
        {showCalendarIcon && <FontAwesomeIcon
          icon={calendarIcon}
          className="date-input-container__icon"
          onClick={() => this.inputRef.current.input.focus()}
        />}
      </div>
    );
  }
}
