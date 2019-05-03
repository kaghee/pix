import React, { Component } from 'react';
import Palette from './Palette';
import Presets from './Presets';
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
      colour: [0, 0, 0],
      preset: 1,
    };
  }

  componentDidMount() {
    this.props.socket.on('drawing', (data) => {
      this.draw(data.data.moveToCoords, data.data.lineToCoords, true);
    });

    this.props.socket.on('changeColour', (newColour) => {
      this.changeColour(newColour, true);
    });

    this.props.socket.on('changePreset', (newPreset) => {
      this.changePreset(newPreset, true);
    });

    // this.props.socket.on('fill', (imageData) => {
    //   this.executeFill(imageData.data, true);
    // });

    this.props.socket.on('resetCanvas', () => {
      this.reset(true);
    });

    ctx = this.display.current.getContext('2d');
    ctx.canvas.width = 900;
    ctx.canvas.height = 600;

    const width = this.state.preset;

    ctx.lineWidth = width < 2 ? width * 4 : width * 8;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
  }

  componentDidUpdate(prevState) {
    if (this.state.colour !== prevState.colour) {
      ctx.strokeStyle = `rgb(${this.state.colour})`;
    }

    if (this.state.preset !== prevState.preset) {
      const width = this.state.preset;

      ctx.lineWidth = width < 2 ? width * 4 : width * 8;
    }
  }

  changeColour = (newColour, ws) => {
    this.setState({
      colour: newColour,
    });
    if (!ws) {
      this.props.socket.emit('changeColour', newColour);
    }
  }

  changePreset = (newPreset, ws) => {
    this.setState({
      preset: newPreset,
    });
    if (!ws) {
      this.props.socket.emit('changePreset', newPreset);
    }
  }

  changeTool = (newTool) => {
    this.setState({
      tool: newTool,
    });
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

    const moveToCoords = [this.state.lastX - e.currentTarget.offsetLeft, this.state.lastY - e.currentTarget.offsetTop];
    const lineToCoords = [e.clientX - e.currentTarget.offsetLeft, e.clientY - e.currentTarget.offsetTop];

    this.draw(moveToCoords, lineToCoords);
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

  reset = (ws) => {
    ctx.clearRect(0, 0, 900, 600);
    if (!ws) {
      this.props.socket.emit('resetCanvas');
    }
  }

  activateFill = () => {
    this.setState({
      tool: 'filler',
    });
  }

  activateEraser = () => {
    this.setState({
      tool: 'eraser',
    });
    ctx.strokeStyle = 'rgb(255, 255, 255)';
  }

  activateBrush = () => {
    this.setState({
      tool: 'brush',
    });
  }

  draw = (moveToCoords, lineToCoords, ws) => {
    ctx.beginPath();
    ctx.moveTo(moveToCoords[0], moveToCoords[1]);
    ctx.lineTo(lineToCoords[0], lineToCoords[1]);
    ctx.strokeStyle = `rgb(${this.state.colour})`;
    ctx.closePath();

    ctx.stroke();

    if (!ws) {
      this.props.socket.emit('drawing', {
        moveToCoords,
        lineToCoords,
      });
    }
  }

  fill = (e, ws) => {
    const currColour = {
      r: this.state.colour[0],
      g: this.state.colour[1],
      b: this.state.colour[2],
    };

    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgb(0, 0, 0)';
    ctx.strokeRect(-1, -1, 902, 602);

    const width = this.state.preset;
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
    const colour = this.state.tool === 'eraser' ? 'transparent' : `rgb(${this.state.colour})`;
    const eraserClassNames = this.state.tool === 'eraser' ? 'eraser tool selected' : 'eraser tool';
    const brushClassNames = this.state.tool === 'brush' ? 'brush tool selected' : 'brush tool';
    const fillerClassNames = this.state.tool === 'filler' ? 'filler tool selected' : 'filler tool';

    return (
      <div className={`canvas-and-tools-container ${this.props.canDraw ? 'enabled' : 'disabled'}`}>
        <canvas
          ref={this.display}
          onMouseDown={e => this.handleMouseDown(e)}
          onMouseMove={e => this.handleMouseMove(e)}
          onMouseUp={this.handleMouseUp}
          onMouseOut={this.handleMouseOut}
          onBlur={this.handleMouseOut}
        />
        <div className="palette-and-presets-toolbar">
          <Palette onColourChange={this.changeColour} tool={this.state.tool} />
          <Presets onPresetChange={this.changePreset} />
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
