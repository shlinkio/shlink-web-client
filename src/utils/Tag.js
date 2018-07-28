import React from 'react';
import ColorGenerator from '../utils/ColorGenerator';
import './Tag.scss';

export default class Tag extends React.Component {
  constructor(props) {
    super(props);
    this.colorGenerator = props.ColorGenerator;
  }

  render() {
    return (
      <span className="badge tag" style={{ backgroundColor: this.colorGenerator.getColorForKey(this.props.text) }}>
        {this.props.text}
      </span>
    );
  }
}

Tag.defaultProps = {
  ColorGenerator
};
