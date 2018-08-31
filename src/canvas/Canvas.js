import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Resetter } from './Resetter';
import { Filler } from './Filler';
import { Eraser } from './Eraser';
import { Brush } from './Brush';

let ctx;

export class Canvas extends Component {
  constructor() {
    super()
    this.state = {
      isDrawing: false,
      lastX: 0,
      lastY: 0,
      offsetTop: 0,
      offsetLeft: 0,
      tool: "brush"
    }
  }

  componentDidMount() {
    const canvas = ReactDOM.findDOMNode(this.refs.canvas);

    ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 600;
    ctx.strokeStyle = `rgb(${this.props.colour})`;

    let width = this.props.preset;

    ctx.lineWidth = width < 2 ? width * 4 : width * 8;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    this.setState({ offsetTop: canvas.offsetTop, offsetLeft: canvas.offsetLeft });
  }

  componentDidUpdate(prevProps) {
    if (this.props.colour !== prevProps.colour) {
      ctx.strokeStyle = `rgb(${this.props.colour})`;
    }

    if (this.props.preset !== prevProps.preset) {
      let width = this.props.preset;

      ctx.lineWidth = width < 2 ? width * 4 : width * 8;
    }
  }

  handleMouseDown = (e) => {
    if (this.state.tool === "filler") {
      this.fill(e);
    } else {
      this.setState({
        isDrawing: true,
        lastX: e.clientX,
        lastY: e.clientY
      });      
    }
  }

  handleMouseMove = (e) => {
    if (!this.state.isDrawing) return;

    ctx.beginPath();
    ctx.moveTo(this.state.lastX - e.currentTarget.offsetLeft, this.state.lastY - e.currentTarget.offsetTop);
    ctx.lineTo(e.clientX - e.currentTarget.offsetLeft , e.clientY - e.currentTarget.offsetTop);
    ctx.stroke();
    this.setState({
      lastX: e.clientX,
      lastY: e.clientY
    });
  }

  handleMouseUp = () => {
    this.setState({ isDrawing: false });
  }

  handleMouseOut = () => {
    this.setState({ isDrawing: false });
  }

  reset = () => {
    ctx.clearRect(0, 0, 900, 600);
  }

  activateFill = () => {
    this.setState({
      tool: "filler"
    });
    this.props.onToolChange("filler");
  }

  activateEraser = () => {
    this.setState({
      tool: "eraser"
    });
    ctx.strokeStyle = "rgb(255, 255, 255)";
    this.props.onToolChange("eraser");
  }

  activateBrush = () => {
    this.setState({
      tool: "brush"
    });
    ctx.strokeStyle = `rgb(${this.props.colour})`;
    this.props.onToolChange("brush");
  }

  fill = (e) => {
    let currColour = {
      r: this.props.colour[0],
      g: this.props.colour[1],
      b: this.props.colour[2]
    };

    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.strokeRect(-1, -1, 902, 602);

    let width = this.props.preset;
    ctx.lineWidth = width < 2 ? width * 4 : width * 8;

    let imageData = ctx.getImageData(0, 0, 900, 600);

    let startX = e.clientX - e.currentTarget.offsetLeft;
    let startY = e.clientY - e.currentTarget.offsetTop;

    let startPos = (startY * 900 + startX) * 4;

    let startR = imageData.data[startPos];
    let startG = imageData.data[startPos + 1];
    let startB = imageData.data[startPos + 2];

    function shouldBeColoured(pixelPos, startR, startG, startB) {

      let r = imageData.data[pixelPos];
      let g = imageData.data[pixelPos + 1];
      let b = imageData.data[pixelPos + 2];

      // If the current pixel matches the clicked color
      if (r !== startR && g !== startG && b !== startB) {
        return false;
      }

      // If current pixel matches the new color
      if (r === currColour.r && g === currColour.g && b === currColour.b) {
        return false;
      }

      return true;
    }

    function colourPixel(pixelPos) {
      imageData.data[pixelPos] = currColour.r;
      imageData.data[pixelPos + 1] = currColour.g;
      imageData.data[pixelPos + 2] = currColour.b;
      imageData.data[pixelPos + 3] = 255;
    }

    function traverse(x, y) {
      let pixelPos = (y * 900 + x) * 4;

      let pixelQueue = [];

      colourPixel(pixelPos);

      pixelQueue.push(pixelPos);

      while (pixelQueue.length) {
        let newPos = pixelQueue.shift();

        if (shouldBeColoured(newPos - 4, startR, startG, startB)) {
          colourPixel(newPos - 4);
          pixelQueue.push(newPos - 4);
        }
        if (shouldBeColoured(newPos + 4, startR, startG, startB)) {
          colourPixel(newPos + 4);
          pixelQueue.push(newPos + 4);
        }
        if (shouldBeColoured(newPos - 900 * 4, startR, startG, startB)) {
          colourPixel(newPos - 900 * 4);
          pixelQueue.push(newPos - 900 * 4);
        }
        if (shouldBeColoured(newPos + 900 * 4, startR, startG, startB)) {
          colourPixel(newPos + 900 * 4);
          pixelQueue.push(newPos + 900 * 4);
        }
      }
      return;
    }

    traverse(startX, startY);

    ctx.putImageData(imageData, 0, 0);

  }

  render() {
    let colour = this.state.tool === "eraser" ? "transparent" : `rgb(${this.props.colour})`;
    let eraserClassNames = this.state.tool === "eraser" ? "eraser tool selected" : "eraser tool";
    let brushClassNames = this.state.tool === "brush" ? "brush tool selected" : "brush tool";
    let fillerClassNames = this.state.tool === "filler" ? "filler tool selected" : "filler tool";

    return (
      <div className="canvas-and-tools-container">
        <canvas
          ref="canvas"
          onMouseDown={(e) => this.handleMouseDown(e)}
          onMouseMove={(e) => this.handleMouseMove(e)}
          onMouseUp={this.handleMouseUp}
          onMouseOut={this.handleMouseOut}
        />
        <div className="tools-container">
          <div className="tools">
            <Resetter onClick={this.reset} />
            <Filler onClick={this.activateFill} colour={colour} className={fillerClassNames} />
            <Eraser onClick={this.activateEraser} className={eraserClassNames} />
            <Brush onClick={this.activateBrush} className={brushClassNames} />
          </div>
        </div>
      </div>
    );
  }
}
