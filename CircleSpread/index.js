import React, {Component} from 'react';
import ReactDom from 'react-dom';

const defaultStyle = {
  width: 30,
  height: 30,
  background: 'transparent',
  borderRadius: '50%',
  overflow: 'hidden',
  display: 'inline-block',
  color: 'rgba(250,250,50,1)',
};
export default class CircleSpread extends Component {

  constructor(props) {
    super(props);
    this.style = Object.assign(defaultStyle, props.style || {});
    this.state = {
    };
    this.xx = parseInt(this.style.width / 2);
    this.yy = parseInt(this.style.height / 2);
    this.maxRadius = props.maxRadius || 20;
    this.radius = 0;
  }

  radiu = () => {
    let {maxRadius = 20} = this.props;
    this.radius += 0.5; //每一帧半径增加0.5
    if (this.radius > maxRadius) {
      this.radius = 0;
    }
  };

  paint = () => {
    const context = this.context;
    context.beginPath();
    context.arc(this.xx, this.yy, this.radius, 0, Math.PI * 2);
    context.closePath();
    context.lineWidth = 2; //线条宽度
    context.strokeStyle = this.style.color; //颜色
    context.stroke();
  };

  createCircles = () => {
    this.paint();
    this.radiu();
  };

  createOutCircle = () => {
    const backCanvas = document.createElement('canvas');
    const backCtx = backCanvas.getContext('2d');
    backCanvas.width = this.style.width;
    backCanvas.height = this.style.height;
    //设置主canvas的绘制透明度
    this.context.globalAlpha = 0.95;
    //显示即将绘制的图像，忽略临时canvas中已存在的图像
    backCtx.globalCompositeOperation = 'copy';
    this.backCanvas = backCanvas;
    this.backCtx = backCtx;
  };
  
  init = () => {
    const {width, height} = this.style;
    this.backCtx.drawImage(this.canvas, 0, 0, width, height);
    //清除主canvas上的图像
    this.context.clearRect(0, 0, width, height);
    //在主canvas上画新圆
    this.createCircles();
    //等新圆画完后，再把临时canvas的图像绘制回主canvas中
    this.context.drawImage(this.backCanvas, 0, 0, width, height);
  };

  componentDidMount() {
    this.canvas = ReactDom.findDOMNode(this.refs['canvas']);
    this.context = this.canvas.getContext("2d");
    this.createOutCircle();
    this.setIntervalId = setInterval(this.init, 25);
  }

  componentWillUnmount() {
    clearInterval(this.setIntervalId);
  }

  render() {
    const {onClick = () => {}, title = ""} = this.props;
    const {style} = this;

    return <div id="box"
                title={title}
                style={style}>
      <canvas ref="canvas" width={style.width} id="canvas" height={style.height}></canvas>
    </div>
  }
}
