import { Canvas2dCtx } from "./canvas-2d-ctx";
import { 
  verifyWebGl1, 
  verifyWebGl2, 
  createCanvas, 
  createWebgl1,
  createWebgl2, 
  compileShader, 
  createProgram, 
  webglResize, 
  setRectangle 
} from './../utility/webgl';

import { colorTemperatureToRgb } from "../helpers/color-temperature";

import imageProcessingVertGl2 from './shaders/verts/image-processing-gl2.vert';
import imageProcessingFragGl2 from './shaders/frags/image-processing-gl2.frag';

import imageProcessingVertGl1 from './shaders/verts/image-processing-gl1.vert';
import imageProcessingFragGl1 from './shaders/frags/image-processing-gl1.frag';

export class ImageProcessing {

  public static Canvas2dCtx: typeof Canvas2dCtx = Canvas2dCtx;

  private _scaleX: number;
  public get getScaleX(): number {
    return this._scaleX;
  }

  private _scaleY: number;
  public get getScaleY(): number {
    return this._scaleY;
  }

  private _flipVertical: number;
  public get getFlipVertical(): boolean {
    return !!this._flipVertical;
  }

  private _flipHorizontal: number;
  public get getFlipHorizontal(): boolean {
    return !!this._flipHorizontal;
  }

  private _invert: number;
  public get getInvert(): boolean {
    return !!this._invert;
  }

  private _hsl: Array<number>;
  public get getHue(): number {
    return this._hsl[0];
  }
  public get getSaturation(): number {
    return this._hsl[1];
  }
  public get getLightness(): number {
    return this._hsl[2];
  }

  private _gamma: number;
  public get getGamma(): number {
    return this._gamma;
  }

  private _noise: number;
  public get getNoise(): number {
    return this._noise;
  }

  private _sepia: number;
  public get getSepia(): boolean {
    return !!this._sepia;
  }

  private _grayscale: number;
  public get getGrayscale(): boolean {
    return !!this._grayscale;
  }

  private _temperature: Array<number>;
  private _transparency: number;
  public get getTransparency(): number {
    return this._transparency;
  }

  private ctx: Canvas2dCtx;
  private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext | WebGLRenderingContext;
  private program: WebGLProgram;

  private renderedImageBase64: string;

  constructor() {
    this.scaleX(1);
    this.scaleY(1);
    this.flipVertical(false);
    this.flipHorizontal(false);
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
        compileShader(this.gl, this.gl.VERTEX_SHADER, imageProcessingVertGl2),
        compileShader(this.gl, this.gl.FRAGMENT_SHADER, imageProcessingFragGl2)
      );

      return;
    }

    if (verifyWebGl1()) {
      this.gl = createWebgl1(this.canvas);

      this.program = createProgram(
        this.gl,
        compileShader(this.gl, this.gl.VERTEX_SHADER, imageProcessingVertGl1),
        compileShader(this.gl, this.gl.FRAGMENT_SHADER, imageProcessingFragGl1)
      );

      return;
    }
  }

  destructor(): void {
    this.ctx?.destructor();
    this.renderedImageBase64 = '';
  }

  public loadImage(image: File | Blob): Promise<void> {
    return new Promise((res, rej) => {
      this.renderedImageBase64 = '';
      
      this.ctx.loadImage(image)
        .then(() => {
          this.render()
            .then(() => {
              res();
            })
            .catch((err) => {
              rej(err);
            });
        })
        .catch((err: any) => {
          console.error('There was an error while loading image.');

          rej(err);
        })
    });
  }

  public isLoaded(): boolean {
    return this.ctx.isLoaded();
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

  public flipVertical(value: boolean): void {
    if (!!value) {
      this._flipVertical = 1;
    } else {
      this._flipVertical = 0;
    }
  }

  public flipHorizontal(value: boolean): void {
    if (!!value) {
      this._flipHorizontal = 1;
    } else {
      this._flipHorizontal = 0;
    }
  }

  public invert(value: boolean): void {
    if (!!value) {
      this._invert = 1;
    } else {
      this._invert = 0;
    }
  }

  public hsl(h: number, s: number, l: number): void {
    this.hue(h);
    this.saturation(s);
    this.lightness(l);
  }

  public hue(value: number): void {
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

  public saturation(value: number): void {
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

  public lightness(value: number): void {
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
    if (typeof(value) !== 'number') {
      value = 1;
    }

    value = parseFloat(value.toString());

    if (value > 1) {
      value = 1;
    }

    if (value < 0) {
      value = 0;
    }

    this._transparency = value;
  }

  private renderGl2(): Promise<void> {
    return new Promise((res, rej) => {
      try
      {
        if (!(this.gl instanceof WebGL2RenderingContext)) {
          rej(new Error('Rendering contex is not WebGL2RenderingContext!'));

          return;
        }

        const imgWidth: number = parseInt((this.ctx.orgWidth * this._scaleX).toFixed(0));
        const imgHeight: number = parseInt((this.ctx.orgHeight * this._scaleY).toFixed(0));
  
        webglResize(this.gl, this.canvas, imgWidth, imgHeight);
  
        // from VERT
        const positionAttributeLocation: number = this.gl.getAttribLocation(this.program, 'a_position');
        const texCoordAttributeLocation: number = this.gl.getAttribLocation(this.program, 'a_texCoord');
        const resolutionUniformLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        const uniformFlipVertical: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_flipVertical');
        const uniformFlipHorizontal: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_flipHorizontal');
        
        // from FRAG
        const randUniformLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_rand');
        const imageUniformLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_image');
        const uniformInvert: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_invert');
        const uniformGamma: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_gamma');
        const uniformHSL: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_hsl');
        const uniformNoise: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_noise');
        const uniformSepia: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_sepia');
        const uniformGrayscale: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_grayscale');
        const uniformTemperature: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_temperature');
        const uniformTransparency: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_transparency');
  
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
        this.gl.uniform1f(randUniformLocation, Math.random());
        this.gl.uniform1i(imageUniformLocation, 0);

        this.gl.uniform1f(uniformFlipVertical, this._flipVertical);
        this.gl.uniform1f(uniformFlipHorizontal, this._flipHorizontal);
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

  private renderGl1(): Promise<void> {
    return new Promise((res, rej) => {
      try
      {
        if (!(this.gl instanceof WebGLRenderingContext)) {
          rej(new Error('Rendering contex is not WebGLRenderingContext!'));

          return;
        }

        const imgWidth: number = parseInt((this.ctx.orgWidth * this._scaleX).toFixed(0));
        const imgHeight: number = parseInt((this.ctx.orgHeight * this._scaleY).toFixed(0));
  
        webglResize(this.gl, this.canvas, imgWidth, imgHeight);

        // from VERT
        const positionAttributeLocation: number = this.gl.getAttribLocation(this.program, 'a_position');
        const texCoordAttributeLocation: number = this.gl.getAttribLocation(this.program, 'a_texCoord');
        const resolutionUniformLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
        const uniformFlipVertical: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_flipVertical');
        const uniformFlipHorizontal: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_flipHorizontal');

        // from FRAG
        const randUniformLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_rand');
        const imageUniformLocation: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_image');
        const uniformInvert: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_invert');
        const uniformGamma: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_gamma');
        const uniformHSL: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_hsl');
        const uniformNoise: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_noise');
        const uniformSepia: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_sepia');
        const uniformGrayscale: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_grayscale');
        const uniformTemperature: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_temperature');
        const uniformTransparency: WebGLUniformLocation = this.gl.getUniformLocation(this.program, 'u_transparency');

        let positionBuffer: WebGLBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        setRectangle(this.gl, 0, 0, imgWidth, imgHeight);
      
        let texcoordBuffer: WebGLBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texcoordBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
          0.0,  0.0,
          1.0,  0.0,
          0.0,  1.0,
          0.0,  1.0,
          1.0,  0.0,
          1.0,  1.0,
        ]), this.gl.STATIC_DRAW);

        let texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.ctx.getOrgImageData());

        this.gl.useProgram(this.program);

        this.gl.enableVertexAttribArray(positionAttributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
        this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.enableVertexAttribArray(texCoordAttributeLocation);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texcoordBuffer);
        this.gl.vertexAttribPointer(texCoordAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);

        this.gl.uniform2f(resolutionUniformLocation, imgWidth, imgHeight);
        this.gl.uniform1f(randUniformLocation, Math.random());
        this.gl.uniform1i(imageUniformLocation, 0);

        this.gl.uniform1f(uniformFlipVertical, this._flipVertical);
        this.gl.uniform1f(uniformFlipHorizontal, this._flipHorizontal);
        this.gl.uniform1f(uniformFlipVertical, this._flipVertical);
        this.gl.uniform1f(uniformFlipHorizontal, this._flipHorizontal);
        this.gl.uniform1f(uniformInvert, this._invert);
        this.gl.uniform3fv(uniformHSL, this._hsl);
        this.gl.uniform1f(uniformGamma, this._gamma);
        this.gl.uniform1f(uniformNoise, this._noise);
        this.gl.uniform1f(uniformSepia, this._sepia);
        this.gl.uniform1f(uniformGrayscale, this._grayscale);
        this.gl.uniform3fv(uniformTemperature, this._temperature);
        this.gl.uniform1f(uniformTransparency, this._transparency);

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
    this.ctx.putActiveImageData(this.ctx.getOrgImageData());

    if (verifyWebGl2()) {
      return this.renderGl2();
    }

    if (verifyWebGl1()) {
      return this.renderGl1();
    }
  }

  public getImage(): string {
    return this.renderedImageBase64;
  }

  public isImageRendered(): boolean {
    return !!(this.renderedImageBase64);
  }

}
