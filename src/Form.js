import React from 'react';
import TextField from '@material-ui/core/TextField';

export default class Form extends React.Component {
  state = {
    text: "",
  }
  handleChange = (e) => {
    const newText = e.target.value
    this.setState ({
      text: newText,
    });
  };

  //ketika hit enter, panggil handleKeyDown, simpan text
  handleKeyDown = (e) => {
    if (e.key === "Enter"){
      this.props.submit(this.state.text);
      this.setState ({
        text: "",
      });
    }
  };

  render() {
    return (
      <TextField
        onKeyDown = {this.handleKeyDown}
        label="Type what u wanna do ..."
        margin="normal"
        fullWidth
        onChange={this.handleChange}
        value= {this.state.text}
      />
    );
  }
}