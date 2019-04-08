import React, { Component } from 'react';
import Resetter from './Resetter';
import Filler from './Filler';
import Eraser from './Eraser';
import Brush from './Brush';

let ctx;

export default class Canvas extends Component {
  constructor() {
    super();
    this.display = React.createRef();
    this.state = {
      isDrawing: false,
      lastX: 0,
      lastY: 0,
      tool: 'brush',
    };
  }

  componentDidMount() {
    ctx = this.display.current.getContext('2d');
    ctx.canvas.width = 900;
    ctx.canvas.height = 600;
    ctx.strokeStyle = `rgb(${this.props.colour})`;

    const width = this.props.preset;

    ctx.lineWidth = width < 2 ? width * 4 : width * 8;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
  }

  componentDidUpdate(prevProps) {
    if (this.props.colour !== prevProps.colour) {
      ctx.strokeStyle = `rgb(${this.props.colour})`;
    }

    if (this.props.preset !== prevProps.preset) {
      const width = this.props.preset;

      ctx.lineWidth = width < 2 ? width * 4 : width * 8;
    }
  }

  handleMouseDown = (e) => {
    if (this.state.tool === 'filler') {
      this.fill(e);
    } else {
      this.setState({
        isDrawing: true,
        lastX: e.clientX,
        lastY: e.clientY,
      });
    }
  }

  handleMouseMove = (e) => {
    if (!this.state.isDrawing) return;

    this.draw(e);
    this.setState({
      lastX: e.clientX,
      lastY: e.clientY,
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
      tool: 'filler',
    });
    this.props.onToolChange('filler');
  }

  activateEraser = () => {
    this.setState({
      tool: 'eraser',
    });
    ctx.strokeStyle = 'rgb(255, 255, 255)';
    this.props.onToolChange('eraser');
  }

  activateBrush = () => {
    this.setState({
      tool: 'brush',
    });
    ctx.strokeStyle = `rgb(${this.props.colour})`;
    this.props.onToolChange('brush');
  }

  draw = (e) => {
    ctx.beginPath();
    ctx.moveTo(this.state.lastX - e.currentTarget.offsetLeft, this.state.lastY - e.currentTarget.offsetTop);
    ctx.lineTo(e.clientX - e.currentTarget.offsetLeft, e.clientY - e.currentTarget.offsetTop);
    ctx.stroke();
  }

  fill = (e) => {
    const currColour = {
      r: this.props.colour[0],
      g: this.props.colour[1],
      b: this.props.colour[2],
    };

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.strokeRect(-1, -1, 902, 602);

    const width = this.props.preset;
    ctx.lineWidth = width < 2 ? width * 4 : width * 8;

    const imageData = ctx.getImageData(0, 0, 900, 600);

    const startX = e.clientX - e.currentTarget.offsetLeft;
    const startY = e.clientY - e.currentTarget.offsetTop;

    const startPos = (startY * 900 + startX) * 4;

    const startR = imageData.data[startPos];
    const startG = imageData.data[startPos + 1];
    const startB = imageData.data[startPos + 2];

    function shouldBeColoured(pixelPos, initialR, initialG, initialB) {
      const r = imageData.data[pixelPos];
      const g = imageData.data[pixelPos + 1];
      const b = imageData.data[pixelPos + 2];

      // If the current pixel matches the clicked color
      if (r !== initialR && g !== initialG && b !== initialB) {
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
      const pixelPos = (y * 900 + x) * 4;
      const pixelQueue = [];

      colourPixel(pixelPos);

      pixelQueue.push(pixelPos);

      while (pixelQueue.length) {
        const newPos = pixelQueue.shift();

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
    }

    traverse(startX, startY);

    ctx.putImageData(imageData, 0, 0);
  }

  render() {
    const colour = this.state.tool === 'eraser' ? 'transparent' : `rgb(${this.props.colour})`;
    const eraserClassNames = this.state.tool === 'eraser' ? 'eraser tool selected' : 'eraser tool';
    const brushClassNames = this.state.tool === 'brush' ? 'brush tool selected' : 'brush tool';
    const fillerClassNames = this.state.tool === 'filler' ? 'filler tool selected' : 'filler tool';

    return (
      <div className="canvas-and-tools-container">
        <canvas
          ref={this.display}
          onMouseDown={e => this.handleMouseDown(e)}
          onMouseMove={e => this.handleMouseMove(e)}
          onMouseUp={this.handleMouseUp}
          onMouseOut={this.handleMouseOut}
          onBlur={this.handleMouseOut}
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
