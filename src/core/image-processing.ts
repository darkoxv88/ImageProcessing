import { Canvas2dCtx } from "../helpers/canvas-2d-ctx";
import { 
  verifyWebGl1, 
  verifyWebGl2, 
  createCanvas, 
  createWebgl2, 
  compileShader, 
  createProgram, 
  webglResize, 
  setRectangle 
} from './../utility/webgl';

import { colorTemperatureToRgb } from "../helpers/color-temperature";

import imageProcessingVert from './shaders/verts/image-processing.vert';
import imageProcessingFrag from './shaders/frags/image-processing.frag';

export class ImageProcessing {

  public static Canvas2dCtx: typeof Canvas2dCtx = Canvas2dCtx;

  private _scaleX: number;
  private _scaleY: number;
  private _invert: number;
  private _hsl: Array<number>;
  private _gamma: number;
  private _noise: number;
  private _sepia: number;
  private _grayscale: number;
  private _temperature: Array<number>;
  private _transparency: number;

  private ctx: Canvas2dCtx;
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;

  private renderedImageBase64: string;

  constructor() {
    this._scaleX = 1;
    this._scaleY = 1;
    this.invert(false);
    this._hsl = new Array<number>(3);
    this.hsl(0, 0, 0);
    this.gamma(1);
    this.noise(0);
    this.sepia(false);
    this.grayscale(false);
    this.temperature(0);
    this.transparency(1);

    this.ctx = new Canvas2dCtx();
    this.canvas = createCanvas();

    this.renderedImageBase64 = '';

    if (verifyWebGl2()) {
      this.gl = createWebgl2(this.canvas);

      this.program = createProgram(
        this.gl,
        compileShader(this.gl, this.gl.VERTEX_SHADER, imageProcessingVert),
        compileShader(this.gl, this.gl.FRAGMENT_SHADER, imageProcessingFrag)
      );

      return;
    }

    if (verifyWebGl1()) {
      return;
    }
  }

  destructor(): void {
    this.ctx?.destructor();
  }

  public loadImage(image: File): Promise<void> {
    return new Promise((res, rej) => {
      this.ctx.loadImage(image)
      .then(() => {
        res();
      })
      .catch((err: any) => {
        console.error('There was an error while loading image.');

        rej(err);
      })
    });
  }

  public scaleX(value: number): void {
    if (typeof(value) !== 'number' || !value) {
      return
    }

    if (value < 0.001) {
      value = 0.001;
    }

    this._scaleX = value;
  };

  public scaleY(value: number): void {
    if (typeof(value) !== 'number' || !value) {
      return
    }
    
    if (value < 0.001) {
      value = 0.001;
    }

    this._scaleX = value;
  };

  public invert(value: boolean): void {
    if (!!value) {
      this._invert = 1;
    } else {
      this._invert = 0;
    }
  }

  public hsl(h: number, s: number, l: number): void {
    this.h(h);
    this.s(s);
    this.l(l);
  }

  public h(value: number): void {
    if (typeof(value) !== 'number') {
      value = 0;
    }

    value = value / 180;

    while (value > 1) {
      value = value - 1;
    }

    while (value < -1) {
      value = value + 1;
    }

    this._hsl[0] = value;
  }

  public s(value: number): void {
    if (typeof(value) !== 'number') {
      value = 0;
    }

    if (value > 100) {
      value = 100;
    }

    if (value < -100) {
      value = -100;
    }

    this._hsl[1] = value;
  }

  public l(value: number): void {
    if (typeof(value) !== 'number') {
      value = 0;
    }

    if (value > 100) {
      value = 100;
    }

    if (value < -100) {
      value = -100;
    }

    value = value / 100;

    this._hsl[2] = 255 * value;
  }

  public gamma(value: number): void {
    if (typeof(value) !== 'number') {
      value = 1;
    }

    if (value < 0) { 
      value = 0; 
    }

    if (value > 100000) { 
      value = 100000; 
    }

    this._gamma = 1 / value
  }

  public noise(value: number): void {
    if (typeof(value) !== 'number') {
      value = 0;
    }

    value = value * 255 * 0.1;

    this._noise = value;
  }

  public sepia(value: boolean): void {
    if (!!value) {
      this._sepia = 1;
    } else {
      this._sepia = 0;
    }
  }

  public grayscale(value: boolean): void {
    if (!!value) {
      this._grayscale = 1;
    } else {
      this._grayscale = 0;
    }
  }

  public temperature(value: number): void {
    let temp: Array<number> = colorTemperatureToRgb(value);

    temp[0] = temp[0] / 255;
    temp[1] = temp[1] / 255;
    temp[2] = temp[2] / 255;
    
    this._temperature = temp;
  }

  public transparency(value: number): void {
    if (typeof(value) !== 'number' || !value) {
      value = 1;
    }

    value = parseInt(value.toString());

    if (value > 1) {
      value = 1;
    }

    if (value < 0) {
      value = 1;
    }

    this._transparency = value;
  }

  private renderGl2(): Promise<void> {
    return new Promise((res, rej) => {
      try
      {
        const imgWidth: number = parseInt((this.ctx.orgWidth * this._scaleX).toFixed(0));
        const imgHeight: number = parseInt((this.ctx.orgHeight * this._scaleY).toFixed(0));
  
        webglResize(this.gl, this.canvas, imgWidth, imgHeight);
  
        // from VERT
        const positionAttributeLocation: number = this.gl.getAttribLocation(this.program, 'a_position');
        const texCoordAttributeLocation: number = this.gl.getAttribLocation(this.program, 'a_texCoord');
        const resolutionUniformLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        
        // from FRAG
        const uniformInvert: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_invert');
        const uniformGamma: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_gamma');
        const uniformHSL: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_hsl');
        const uniformNoise: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_noise');
        const uniformSepia: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_sepia');
        const uniformGrayscale: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_grayscale');
        const uniformTemperature: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_temperature');
        const uniformTransparency: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_transparency');
        const imageUniformLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_image');
  
        const vao: WebGLVertexArrayObject = this.gl.createVertexArray();
        this.gl.bindVertexArray(vao);
  
        let positionBuffer = this.gl.createBuffer();
  
        this.gl.enableVertexAttribArray(positionAttributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
  
        var texCoordBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
          0.0,  0.0,
          1.0,  0.0,
          0.0,  1.0,
          0.0,  1.0,
          1.0,  0.0,
          1.0,  1.0,
        ]), this.gl.STATIC_DRAW);
  
        this.gl.enableVertexAttribArray(texCoordAttributeLocation);
        this.gl.vertexAttribPointer(texCoordAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
        const texture: WebGLTexture = this.gl.createTexture();
        this.gl.activeTexture(this.gl.TEXTURE0 + 0);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.ctx.getOrgImageData());

        this.gl.useProgram(this.program);

        this.gl.bindVertexArray(vao);

        this.gl.uniform2f(resolutionUniformLocation, imgWidth, imgHeight);
        this.gl.uniform1i(imageUniformLocation, 0);

        this.gl.uniform1f(uniformInvert, this._invert);
        this.gl.uniform3fv(uniformHSL, this._hsl);
        this.gl.uniform1f(uniformGamma, this._gamma);
        this.gl.uniform1f(uniformNoise, this._noise);
        this.gl.uniform1f(uniformSepia, this._sepia);
        this.gl.uniform1f(uniformGrayscale, this._grayscale);
        this.gl.uniform3fv(uniformTemperature, this._temperature);
        this.gl.uniform1f(uniformTransparency, this._transparency);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);

        setRectangle(this.gl, 0, 0, imgWidth, imgHeight);

        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

        this.renderedImageBase64 = this.canvas.toDataURL('image/png');

        res();
      }
      catch (err)
      {
        rej(err);
      }
    });
  }

  public render(): Promise<void> {
    if (verifyWebGl2()) {
      return this.renderGl2();
    }

    if (verifyWebGl1()) {

    }
  }

  public getImage(): string {
    return this.renderedImageBase64;
  }

}
