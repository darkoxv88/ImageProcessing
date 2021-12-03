const gl1: boolean = !!WebGLRenderingContext;

export function verifyWebGl1(): boolean {
  return gl1;
}

const gl2: boolean = !!WebGL2RenderingContext;

export function verifyWebGl2(): boolean {
  return gl2;
}

export function createCanvas(): HTMLCanvasElement {
  let canvas: HTMLCanvasElement = document.createElement('canvas');
  canvas.innerHTML = 'This browser does not support HTML5';

  return canvas;
}

export function createWebgl2(canvas?: HTMLCanvasElement): WebGL2RenderingContext {
  if (verifyWebGl2() == false) return null;

  if (!canvas) canvas = createCanvas();

  let gl: WebGL2RenderingContext = canvas.getContext('webgl2');

  if (!gl) throw new Error('Could not get context, there was an unknown error.');

  return gl;
}

export function compileShader(gl: WebGLRenderingContext | WebGL2RenderingContext, shaderType: number, shaderSource: string): WebGLShader {
  var shader = gl.createShader(shaderType);

  gl.shaderSource(shader, shaderSource);
  gl.compileShader(shader);

  if (!(gl.getShaderParameter(shader, gl.COMPILE_STATUS))) {
    gl.deleteShader(shader);

    throw 'Could not compile shader: ' + gl.getShaderInfoLog(shader);
  }

  return shader;
}

export function createProgram(
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader): WebGLProgram {
  var program: WebGLProgram = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);

  if (!(gl.getProgramParameter(program, gl.LINK_STATUS))) throw ('Program failed to link: ' + gl.getProgramInfoLog (program));

  return program;
}

export function webglResize(gl: WebGLRenderingContext | WebGL2RenderingContext, canvas: HTMLCanvasElement, width: number, height: number): void {
  if (!canvas) return;

  canvas.width = width;
  canvas.height = height;

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1, 1, 1, 1);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

export function setRectangle(gl: WebGLRenderingContext | WebGL2RenderingContext, x: number, y: number, width: number, height: number) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    x1, y1,
    x2, y1,
    x1, y2,
    x1, y2,
    x2, y1,
    x2, y2,
  ]), gl.STATIC_DRAW);
}
