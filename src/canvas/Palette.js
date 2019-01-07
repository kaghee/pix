import React, { Component } from 'react';

export class Palette extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentColour: [0, 0, 0],
    }
  }

  handleColourChange = (newColour) => {
    this.props.onColourChange(newColour);
  }

  setColour(row, clr) {
    const colour = this.getColour(row, clr);
    this.setState({ currentColour: colour });
    this.handleColourChange(colour);
  }

  getColour(row, clr) {
    const colours = [ [[255,255,255],[0,0,0]],
                      [[128,128,128],[77,77,77]],
                      [[255,0,0],[153,0,0]],
                      [[255,128,0],[153,77,0]],
                      [[255,221,0],[155,133,0]],
                      [[0,255,0],[0,153,0]],
                      [[0,255,255],[0,153,153]],
                      [[0,64,255],[0,38,153]],
                      [[128,0,255],[77,0,153]],
                      [[255,0,191],[153,0,115]],
                      [[185,99,70],[111,59,42]]
    ];

    return colours[row][clr];
  }

  render() {
    const rows = [];

    for (let i = 0; i < 2; i++) {
      const cols = [];
      for (let j = 0; j < 11; j++) {
        cols.push(
          <button
            key={this.getColour(j, i)}
            className="clr btn"
            onClick={() => this.setColour(j, i)}
            disabled={this.props.tool === "eraser"}
            style={{ backgroundColor: `rgb(${this.getColour(j, i)})` }}
          />
        );
      }

      rows.push(
        <div className="row" key={i}>
          {cols}
        </div>
      );
    }

    let currentColourColour = this.props.tool === "eraser" ? "transparent" : `rgb(${this.state.currentColour})`;
    let border = this.props.tool === "eraser" ? "3px solid black" : "none";
    let styles = {
      backgroundColor: currentColourColour,
      border
    }

    return (
      <div className="palette">
      <div className="current-colour" style={styles}></div>
        <div className="colours">
          {rows}
        </div>
      </div>
    );
  }
}
