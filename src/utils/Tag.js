import React from 'react';
import { connect } from 'react-redux';
import ColorGenerator from '../utils/ColorGenerator';
import './Tag.scss';

export class Tag extends React.Component {
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

export default connect(state => ({ ColorGenerator }))(Tag);
