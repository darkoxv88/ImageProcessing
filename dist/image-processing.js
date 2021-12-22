/**
  * 
    * @author Darko Petrovic
  * @Link Facebook: https://www.facebook.com/WitchkingOfAngmarr
  * @Link GitHub: https://github.com/darkoxv88
  * 
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.


exports:

  window.ImageProcessing;

backup:

  window.___webpack_export_dp___.ImageProcessing;

**/

/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/refs/root.ts
const root = typeof window !== 'undefined' ? window : typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : ({});
function getRoot() {
    return root;
}

;// CONCATENATED MODULE: ./src/environment.ts
var production = true;
function isProduction() {
    return production;
}

;// CONCATENATED MODULE: ./src/utility/byte.ts
function byte_byte(value) {
    try {
        value = parseInt(value);
        if (value > 255) {
            return 255;
        }
        if (value < 0) {
            return 0;
        }
        return value;
    }
    catch (error) {
        console.error(error);
        return 0;
    }
}

;// CONCATENATED MODULE: ./src/helpers/convolution.ts

function convolution(imgData, operationMatrix) {
    if (!(imgData instanceof ImageData)) {
        return null;
    }
    if (!Array.isArray(operationMatrix)) {
        return imgData;
    }
    if (imgData.data.length <= 1) {
        return imgData;
    }
    let side = Math.round(Math.sqrt(operationMatrix.length));
    let halfSide = Math.floor(side / 2);
    let canvasWidth = imgData.width;
    let canvasHeight = imgData.height;
    let outputData = new ImageData(canvasWidth, canvasHeight);
    for (let h = 0; h < canvasHeight; h++) {
        for (let w = 0; w < canvasWidth; w++) {
            let position = (h * canvasWidth + w) * 4;
            let sumR = 0, sumG = 0, sumB = 0;
            for (let matH = 0; matH < side; matH++) {
                for (let matW = 0; matW < side; matW++) {
                    let currentMatH = h + matH - halfSide;
                    let currentMatW = w + matW - halfSide;
                    while (currentMatH < 0) {
                        currentMatH += 1;
                    }
                    ;
                    while (currentMatH >= canvasHeight) {
                        currentMatH -= 1;
                    }
                    ;
                    while (currentMatW < 0) {
                        currentMatW += 1;
                    }
                    ;
                    while (currentMatW >= canvasWidth) {
                        currentMatW -= 1;
                    }
                    ;
                    let offset = (currentMatH * canvasWidth + currentMatW) * 4;
                    let operation = operationMatrix[matH * side + matW];
                    sumR += imgData.data[offset] * operation;
                    sumG += imgData.data[offset + 1] * operation;
                    sumB += imgData.data[offset + 2] * operation;
                }
            }
            outputData.data[position] = byte_byte(sumR);
            outputData.data[position + 1] = byte_byte(sumG);
            outputData.data[position + 2] = byte_byte(sumB);
            outputData.data[position + 3] = imgData.data[position + 3];
        }
    }
    return outputData;
}

;// CONCATENATED MODULE: ./src/helpers/histogram.ts
class Histogram {
    constructor(imgData) {
        this.r = new Array();
        this.g = new Array();
        this.b = new Array();
        this.a = new Array();
        for (var i = 0; i < 256; i += 1) {
            this.r[i] = 0;
            this.g[i] = 0;
            this.b[i] = 0;
            this.a[i] = 0;
        }
        for (var i = 0; i < imgData.data.length; i += 4) {
            this.r[imgData.data[i]] += 1;
            this.g[imgData.data[i + 1]] += 1;
            this.b[imgData.data[i + 2]] += 1;
            this.a[imgData.data[i + 3]] += 1;
        }
    }
}

;// CONCATENATED MODULE: ./src/core/canvas-2d-ctx.ts


class Canvas2dCtx {
    constructor() { }
    get size() {
        return this._size;
    }
    get type() {
        return this._type;
    }
    get orgWidth() {
        var _a, _b;
        return (_b = (_a = this.org) === null || _a === void 0 ? void 0 : _a.canvas) === null || _b === void 0 ? void 0 : _b.width;
    }
    get orgHeight() {
        var _a, _b;
        return (_b = (_a = this.org) === null || _a === void 0 ? void 0 : _a.canvas) === null || _b === void 0 ? void 0 : _b.height;
    }
    get ctx() {
        return this.active;
    }
    get width() {
        var _a, _b;
        return (_b = (_a = this.active) === null || _a === void 0 ? void 0 : _a.canvas) === null || _b === void 0 ? void 0 : _b.width;
    }
    get height() {
        var _a, _b;
        return (_b = (_a = this.active) === null || _a === void 0 ? void 0 : _a.canvas) === null || _b === void 0 ? void 0 : _b.height;
    }
    destructor() {
        this.clear();
    }
    clear() {
        this.img = null;
        this._size = undefined;
        this._type = undefined;
        this.org = null;
        this.active = null;
    }
    generate2dCtx(w, h) {
        let newCanvas = document.createElement('canvas');
        newCanvas.width = w;
        newCanvas.height = h;
        return newCanvas.getContext('2d');
    }
    duplicateCtxOrg() {
        var _a, _b, _c, _d, _e;
        let context = this.generate2dCtx((_b = (_a = this.org) === null || _a === void 0 ? void 0 : _a.canvas) === null || _b === void 0 ? void 0 : _b.width, (_d = (_c = this.org) === null || _c === void 0 ? void 0 : _c.canvas) === null || _d === void 0 ? void 0 : _d.height);
        context.drawImage((_e = this.org) === null || _e === void 0 ? void 0 : _e.canvas, 0, 0);
        return context;
    }
    duplicateCtxActive() {
        var _a, _b, _c, _d, _e;
        let context = this.generate2dCtx((_b = (_a = this.active) === null || _a === void 0 ? void 0 : _a.canvas) === null || _b === void 0 ? void 0 : _b.width, (_d = (_c = this.active) === null || _c === void 0 ? void 0 : _c.canvas) === null || _d === void 0 ? void 0 : _d.height);
        context.drawImage((_e = this.active) === null || _e === void 0 ? void 0 : _e.canvas, 0, 0);
        return context;
    }
    loadImage(file) {
        if (!file) {
            return;
        }
        this.clear();
        return new Promise((resolve, reject) => {
            var reader = new FileReader();
            reader.onload = (ev) => {
                if (typeof reader.result == 'string') {
                    var image = new Image();
                    image.onload = () => {
                        var _a, _b;
                        this.img = image;
                        this._size = file === null || file === void 0 ? void 0 : file.size;
                        this._type = file === null || file === void 0 ? void 0 : file.type;
                        let ctx = this.generate2dCtx((_a = this.img) === null || _a === void 0 ? void 0 : _a.width, (_b = this.img) === null || _b === void 0 ? void 0 : _b.height);
                        ctx.drawImage(this.img, 0, 0);
                        this.org = ctx;
                        this.active = this.duplicateCtxOrg();
                        resolve();
                    };
                    image.onerror = reject;
                    image.src = reader.result;
                }
                else {
                    reject(ev);
                }
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    isLoaded() {
        return !!this.org;
    }
    getOrgImageUrl() {
        var _a, _b;
        return (_b = (_a = this.org) === null || _a === void 0 ? void 0 : _a.canvas) === null || _b === void 0 ? void 0 : _b.toDataURL('image/png');
    }
    getOrgImageData() {
        var _a;
        return (_a = this.active) === null || _a === void 0 ? void 0 : _a.getImageData(0, 0, this.orgWidth, this.orgHeight);
    }
    getActiveImageUrl() {
        var _a, _b;
        return (_b = (_a = this.active) === null || _a === void 0 ? void 0 : _a.canvas) === null || _b === void 0 ? void 0 : _b.toDataURL('image/png');
    }
    getActiveImageData() {
        var _a;
        return (_a = this.active) === null || _a === void 0 ? void 0 : _a.getImageData(0, 0, this.width, this.height);
    }
    putActiveImageData(data) {
        var _a;
        try {
            this.active.canvas.width = data.width;
            this.active.canvas.height = data.height;
            (_a = this.active) === null || _a === void 0 ? void 0 : _a.putImageData(data, 0, 0);
        }
        catch (err) {
            console.error(err);
        }
    }
    histogram() {
        return new Histogram(this.getActiveImageData());
    }
    flipImage(flipH, flipV) {
        var scaleH = flipH ? (-1) : 1;
        var scaleV = flipV ? (-1) : 1;
        if (flipH) {
            this.active.translate(this.width, 0);
        }
        if (flipV) {
            this.active.translate(0, this.height);
        }
        this.active.scale(scaleH, scaleV);
        this.active.drawImage(this.active.canvas, 0, 0);
        this.active.setTransform(1, 0, 0, 1, 0, 0);
        this.active.restore();
    }
}
Canvas2dCtx.convolution = convolution;

;// CONCATENATED MODULE: ./src/utility/webgl.ts
const forceGL1 = false;
const gl1 = !!WebGLRenderingContext;
function verifyWebGl1() {
    return gl1;
}
const gl2 = !!WebGL2RenderingContext;
function verifyWebGl2() {
    return (gl2 && !forceGL1);
}
function createCanvas() {
    let canvas = document.createElement('canvas');
    canvas.innerHTML = 'This browser does not support HTML5';
    return canvas;
}
function createWebgl1(canvas) {
    if (verifyWebGl1() == false)
        return null;
    if (!canvas)
        canvas = createCanvas();
    let gl = canvas.getContext('webgl', { preserveDrawingBuffer: false });
    if (!gl)
        throw new Error('Could not get context, there was an unknown error.');
    return gl;
}
function createWebgl2(canvas) {
    if (verifyWebGl2() == false)
        return null;
    if (!canvas)
        canvas = createCanvas();
    let gl = canvas.getContext('webgl2', { preserveDrawingBuffer: false });
    if (!gl)
        throw new Error('Could not get context, there was an unknown error.');
    return gl;
}
function compileShader(gl, shaderType, shaderSource) {
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
    if (!(gl.getShaderParameter(shader, gl.COMPILE_STATUS))) {
        gl.deleteShader(shader);
        throw 'Could not compile shader: ' + gl.getShaderInfoLog(shader);
    }
    return shader;
}
function createProgram(gl, vertexShader, fragmentShader) {
    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!(gl.getProgramParameter(program, gl.LINK_STATUS)))
        throw ('Program failed to link: ' + gl.getProgramInfoLog(program));
    return program;
}
function webglResize(gl, canvas, width, height) {
    if (!canvas)
        return;
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1, 1, 1, 1);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}
function setRectangle(gl, x, y, width, height) {
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

;// CONCATENATED MODULE: ./src/helpers/color-temperature.ts
const defaulTemperatures = {
    1000: [255, 56, 0],
    1500: [255, 109, 0],
    1900: [255, 131, 0],
    2000: [255, 137, 18],
    2200: [255, 147, 44],
    2500: [255, 161, 72],
    2700: [255, 169, 87],
    2800: [255, 173, 94],
    2900: [255, 177, 101],
    3000: [255, 180, 107],
    3500: [255, 196, 137],
    4000: [255, 209, 163],
    4100: [255, 211, 168],
    4300: [255, 215, 177],
    4500: [255, 219, 186],
    5000: [255, 228, 206],
    5100: [255, 230, 210],
    5200: [255, 232, 213],
    5300: [255, 233, 217],
    5400: [255, 235, 220],
    5500: [255, 236, 224],
    5600: [255, 238, 227],
    5700: [255, 239, 230],
    6000: [255, 243, 239],
    6500: [255, 249, 253],
    6600: [254, 249, 255],
    6700: [252, 247, 255],
    6800: [249, 246, 255],
    6900: [247, 245, 255],
    7000: [245, 243, 255],
    7100: [243, 242, 255],
    7200: [240, 241, 255],
    7300: [239, 240, 255],
    7400: [237, 239, 255],
    7500: [235, 238, 255],
    8000: [227, 233, 255],
    8500: [220, 229, 255],
    9000: [214, 225, 255],
    9300: [210, 223, 255],
    9500: [208, 222, 255],
    9600: [207, 221, 255],
    9700: [207, 221, 255],
    9800: [206, 220, 255],
    9900: [205, 220, 255],
    10000: [204, 219, 255],
    10500: [200, 217, 255],
    11000: [200, 213, 255],
    11500: [193, 213, 255],
    12000: [191, 211, 255],
    12500: [188, 210, 255],
    13000: [186, 208, 255],
    13500: [184, 207, 255],
    14000: [182, 206, 255],
    14500: [180, 205, 255],
    15000: [179, 204, 255],
    15500: [177, 203, 255],
    16000: [176, 202, 255],
    16500: [175, 201, 255],
    17000: [174, 200, 255],
    17500: [173, 200, 255],
};
function colorTemperatureToRgb(value) {
    let r = 255, g = 1255, b = 255;
    if (typeof (value) !== 'number' || !value) {
        return [255, 255, 255];
    }
    if (value < 0)
        value = 0;
    if (value == 0) {
        return [255, 255, 255];
    }
    if (defaulTemperatures[value]) {
        return [defaulTemperatures[value][0], defaulTemperatures[value][1], defaulTemperatures[value][2]];
    }
    if (value > 100000000)
        value = 100000000;
    value /= 100;
    if (value <= 66) {
        r = 255;
        g = parseFloat((99.4708025861 * Math.log(value) - 161.1195681661).toFixed(0));
    }
    else {
        r = parseFloat((329.698727446 * Math.pow(value - 60, -0.1332047592)).toFixed(0));
        g = parseFloat((288.1221695283 * Math.pow(value - 60, -0.0755148492)).toFixed(0));
    }
    if (value >= 66) {
        b = 255;
    }
    else if (value <= 19) {
        b = 0;
    }
    else {
        b = parseFloat((138.5177312231 * Math.log(value - 10) - 305.0447927307).toFixed(0));
    }
    return [r, g, b];
}

;// CONCATENATED MODULE: ./src/core/shaders/verts/image-processing-gl2.vert
/* harmony default export */ const image_processing_gl2 = ("#version 300 es\r\n\r\nin vec2 a_position;\r\nin vec2 a_texCoord;\r\n\r\nuniform vec2 u_resolution;\r\nuniform float u_flipVertical;\r\nuniform float u_flipHorizontal;\r\n\r\nout vec2 v_texCoord;\r\n\r\nvoid main() {\r\n  vec2 zeroToOne = a_position / u_resolution;\r\n  vec2 zeroToTwo = zeroToOne * 2.0;\r\n  vec2 clipSpace = zeroToTwo - 1.0;\r\n  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\r\n  vec2 texCoord = vec2(a_texCoord.x, a_texCoord.y);\r\n\r\n  if (u_flipVertical == 1.0f)\r\n  {\r\n    texCoord.x = 1.0f - texCoord.x;\r\n  }\r\n\r\n  if (u_flipHorizontal == 1.0f)\r\n  {\r\n    texCoord.y = 1.0f - texCoord.y;\r\n  }\r\n\r\n  v_texCoord = texCoord;\r\n}\r\n");
;// CONCATENATED MODULE: ./src/core/shaders/frags/image-processing-gl2.frag
/* harmony default export */ const frags_image_processing_gl2 = ("#version 300 es\r\nprecision highp float;\r\n\r\nfloat g_goldNoise(float v, float seed) \r\n{\r\n  return fract(tan(distance(v * 1.61803398874989484820459f, v) * seed) * v);\r\n}\r\nfloat g_goldNoise(vec2 v, float seed) \r\n{\r\n  return fract(tan(distance(v * 1.61803398874989484820459f, v) * seed) * v.x);\r\n}\r\nfloat g_goldNoise(vec3 v, float seed) \r\n{\r\n  return fract(tan(distance(v * 1.61803398874989484820459f, v) * seed) * v.x);\r\n}\r\nfloat g_goldNoise(vec4 v, float seed) \r\n{\r\n  return fract(tan(distance(v * 1.61803398874989484820459f, v) * seed) * v.x);\r\n}\r\nuint g_hash(uint x) \r\n{\r\n  x += (x << 10u);\r\n  x ^= (x >>  6u);\r\n  x += (x <<  3u);\r\n  x ^= (x >> 11u);\r\n  x += (x << 15u);\r\n  return x;\r\n}\r\nuint g_hash(uvec2 v) \r\n{ \r\n  return g_hash( v.x ^ g_hash(v.y)); \r\n}\r\nuint g_hash(uvec3 v) \r\n{ \r\n  return g_hash( v.x ^ g_hash(v.y) ^ g_hash(v.z)); \r\n}\r\nuint g_hash(uvec4 v) \r\n{ \r\n  return g_hash( v.x ^ g_hash(v.y) ^ g_hash(v.z) ^ g_hash(v.w) );\r\n}\r\nfloat g_floatConstruct(uint m) \r\n{\r\n  const uint ieeeMantissa = 0x007FFFFFu;\r\n  const uint ieeeOne = 0x3F800000u; \r\n\r\n  m &= ieeeMantissa;                     \r\n  m |= ieeeOne;                          \r\n\r\n  float f = uintBitsToFloat( m );   \r\n\r\n  return f - 1.0;                       \r\n}\r\nfloat g_random(float v) \r\n{ \r\n  return g_goldNoise(v, g_floatConstruct(g_hash(floatBitsToUint(v))));\r\n}\r\nfloat g_random(vec2  v) \r\n{ \r\n  return g_goldNoise(v, g_floatConstruct(g_hash(floatBitsToUint(v))));\r\n}\r\nfloat g_random(vec3  v) \r\n{ \r\n  return g_goldNoise(v, g_floatConstruct(g_hash(floatBitsToUint(v))));\r\n}\r\nfloat g_random(vec4  v) \r\n{ \r\n  return g_goldNoise(v, g_floatConstruct(g_hash(floatBitsToUint(v))));\r\n}\r\n\r\nuniform float u_rand;\r\nuniform sampler2D u_image;\r\n\r\nuniform float u_invert;\r\nuniform vec3 u_hsl;\r\nuniform float u_gamma;\r\nuniform float u_noise;\r\nuniform float u_sepia;\r\nuniform float u_grayscale;\r\nuniform vec3 u_temperature;\r\nuniform float u_transparency;\r\n\r\nin vec2 v_texCoord;\r\nout vec4 outColor;\r\n\r\nvec3 rgbToHSL(float cR, float cG, float cB) \r\n{\r\n  float r = cR / 255.0f;\r\n  float g = cG / 255.0f;\r\n  float b = cB / 255.0f;\r\n\r\n  float max = max(max(r, g), b); \r\n  float min = min(min(r, g), b);\r\n  float del = max - min;\r\n\r\n  float h = 0.0f; \r\n  float s = 0.0f; \r\n  float l = (max + min) / 2.0f;\r\n\r\n  if (max == min) \r\n  {\r\n    return vec3(h, s, l);\r\n  }\r\n\r\n  if (l < 0.5f)  \r\n  {\r\n    s = del / (max + min);\r\n  }\r\n  else  \r\n  {\r\n    s = del / (2.0f - max - min); \r\n  }\r\n\r\n  float delR = ( ( ( max - r ) / 6.0f ) + ( del / 2.0f ) ) / del;\r\n  float delG = ( ( ( max - g ) / 6.0f ) + ( del / 2.0f ) ) / del;\r\n  float delB = ( ( ( max - b ) / 6.0f ) + ( del / 2.0f ) ) / del;\r\n\r\n  if (r == max) \r\n  {\r\n    h = delB - delG;\r\n  }\r\n  else if (g == max) \r\n  {\r\n    h = (1.0f / 3.0f) + delR - delB;\r\n  }\r\n  else if (b == max) \r\n  {\r\n    h = (2.0f / 3.0f) + delG - delR;\r\n  }\r\n\r\n  if (h < 0.0f) \r\n  {\r\n    h += 1.0f;\r\n  }\r\n\r\n  if (h > 1.0f) \r\n  {\r\n    h -= 1.0f;\r\n  }\r\n\r\n  return vec3(h, s, l);\r\n}\r\n\r\nfloat _hue_2_rgb_(float v1, float v2, float vH) \r\n{\r\n  if (vH < 0.0f) \r\n  {\r\n    vH += 1.0f;\r\n  }\r\n\r\n  if (vH > 1.0f) \r\n  {\r\n    vH -= 1.0f;\r\n  }\r\n\r\n  if ((6.0f * vH) < 1.0f) \r\n  {\r\n    return (v1 + (v2 - v1) * 6.0f * vH);\r\n  }\r\n  if ((2.0f * vH) < 1.0f)\r\n  {\r\n    return v2;\r\n  }\r\n  if ((3.0f * vH) < 2.0f)\r\n  {\r\n    return (v1 + (v2 - v1) * ((2.0f / 3.0f) - vH) * 6.0f);\r\n  }\r\n\r\n  return v1;\r\n}\r\n\r\nvec3 hslToRGB(float h, float s, float l) \r\n{\r\n  float r = 0.0f;\r\n  float g = 0.0f;\r\n  float b = 0.0f;\r\n  float val1 = 0.0f;\r\n  float val2 = 0.0f;\r\n\r\n  if (s == 0.0f)\r\n  {\r\n    r = l * 255.0f;\r\n    g = l * 255.0f;\r\n    b = l * 255.0f;\r\n\r\n    return vec3(r, g, b);\r\n  }\r\n\r\n  if (l < 0.5f) \r\n  {\r\n    val2 = l * (1.0f + s);\r\n  }\r\n  else\r\n  {\r\n    val2 = (l + s) - (l * s);\r\n  }\r\n      \r\n  val1 = 2.0f * l - val2;\r\n\r\n  r = 255.0f * _hue_2_rgb_(val1, val2, h + (1.0f / 3.0f));\r\n  g = 255.0f * _hue_2_rgb_(val1, val2, h);\r\n  b = 255.0f * _hue_2_rgb_(val1, val2, h - (1.0f / 3.0f));\r\n\r\n  return vec3(r, g, b);\r\n}\r\n\r\n\r\n\r\nvoid main() \r\n{\r\n  vec4 mainPixel = texture(u_image, v_texCoord);\r\n  float x = mainPixel.x * 255.0f;\r\n  float y = mainPixel.y * 255.0f;\r\n  float z = mainPixel.z * 255.0f;\r\n  float w = mainPixel.w;\r\n\r\n  // invert\r\n  if (u_invert == 1.0f) \r\n  {\r\n    x = 255.0f - x;\r\n    y = 255.0f - y;\r\n    z = 255.0f - z;\r\n  }\r\n\r\n  // hsl\r\n  {\r\n    float sVal = u_hsl.y;\r\n    float saturationAdd = 0.0f;\r\n\r\n    if (sVal < 0.0f) \r\n    {\r\n      sVal = (100.0f + sVal) / 100.0f;\r\n      sVal *= sVal;\r\n    } \r\n    else \r\n    {\r\n      sVal = sVal / 100.0f;\r\n    }\r\n    \r\n    if (u_hsl.y > 0.0f) \r\n    {\r\n      saturationAdd = sVal;\r\n    }\r\n\r\n    vec3 _hsl = rgbToHSL(x, y, z);\r\n    vec3 _rgb = hslToRGB(_hsl.x + u_hsl.x, _hsl.y + saturationAdd, _hsl.z);\r\n\r\n    x = _rgb.x;\r\n    y = _rgb.y;\r\n    z = _rgb.z;\r\n\r\n    if (u_hsl.y < 0.0f) \r\n    {\r\n      float luR = 0.3086;\r\n      float luG = 0.6094;\r\n      float luB = 0.0820;\r\n\r\n      x = ( ((1.0f - sVal) * luR + sVal) * x + ((1.0f - sVal) * luG) * y + ((1.0f - sVal) * luB) * z );\r\n      y = ( ((1.0f - sVal) * luR) * x + ((1.0f - sVal) * luG + sVal) * x + ((1.0f - sVal) * luB) * z );\r\n      z = ( ((1.0f - sVal) * luR) * x + ((1.0f - sVal) * luG) * y + ((1.0f - sVal) * luB + sVal) * z );\r\n    }\r\n\r\n    x = x + u_hsl.z;\r\n    y = y + u_hsl.z;\r\n    z = z + u_hsl.z;\r\n  }\r\n\r\n  // gamma\r\n  {\r\n    x = 255.0f * pow((x / 255.0f), u_gamma);\r\n    y = 255.0f * pow((y / 255.0f), u_gamma);\r\n    z = 255.0f * pow((z / 255.0f), u_gamma);\r\n  }\r\n\r\n  // noise\r\n  {\r\n    float randAdd = 2.0f + 1.8f * u_rand;\r\n    float ran = (0.5f - g_random(v_texCoord + vec2(randAdd, randAdd))) * u_noise;\r\n\r\n    x = x + ran;\r\n    y = y + ran;\r\n    z = z + ran;\r\n  }\r\n\r\n  // sepia\r\n  if (u_sepia == 1.0f) \r\n  {\r\n    float red = x;\r\n    float green = y;\r\n    float blue = z;\r\n\r\n    x = (0.393f * red) + (0.769f * green) + (0.189f * blue);\r\n    y = (0.349f * red) + (0.686f * green) + (0.168f * blue);\r\n    z = (0.272f * red) + (0.534f * green) + (0.131f * blue);\r\n  }\r\n\r\n  // grayscale\r\n  if (u_grayscale == 1.0f) \r\n  {\r\n    x = y = z = ((x + y + z) / 3.0f);\r\n  }\r\n\r\n  x = x * u_temperature.x;\r\n  y = y * u_temperature.y;\r\n  z = z * u_temperature.z;\r\n  w = w * u_transparency;\r\n\r\n  outColor = vec4(x / 255.0f, y / 255.0f, z / 255.0f, w).rgba;\r\n}\r\n");
;// CONCATENATED MODULE: ./src/core/shaders/verts/image-processing-gl1.vert
/* harmony default export */ const image_processing_gl1 = ("attribute vec2 a_position;\r\nattribute vec2 a_texCoord;\r\n\r\nuniform vec2 u_resolution;\r\nuniform float u_flipVertical;\r\nuniform float u_flipHorizontal;\r\n\r\nvarying vec2 v_texCoord;\r\n\r\nvoid main() {\r\n  vec2 zeroToOne = a_position / u_resolution;\r\n  vec2 zeroToTwo = zeroToOne * 2.0;\r\n  vec2 clipSpace = zeroToTwo - 1.0;\r\n  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\r\n  vec2 texCoord = vec2(a_texCoord.x, a_texCoord.y);\r\n\r\n  if (u_flipVertical == 1.0)\r\n  {\r\n    texCoord.x = 1.0 - texCoord.x;\r\n  }\r\n\r\n  if (u_flipHorizontal == 1.0)\r\n  {\r\n    texCoord.y = 1.0 - texCoord.y;\r\n  }\r\n\r\n  v_texCoord = texCoord;\r\n}\r\n");
;// CONCATENATED MODULE: ./src/core/shaders/frags/image-processing-gl1.frag
/* harmony default export */ const frags_image_processing_gl1 = ("precision highp float;\r\n\r\nfloat g_goldNoise(float v, float seed) \r\n{\r\n  return fract(tan(distance(v * 1.61803398874989484820459, v) * seed) * v);\r\n}\r\nfloat g_goldNoise(vec2 v, float seed) \r\n{\r\n  return fract(tan(distance(v * 1.61803398874989484820459, v) * seed) * v.x);\r\n}\r\nfloat g_goldNoise(vec3 v, float seed) \r\n{\r\n  return fract(tan(distance(v * 1.61803398874989484820459, v) * seed) * v.x);\r\n}\r\nfloat g_goldNoise(vec4 v, float seed) \r\n{\r\n  return fract(tan(distance(v * 1.61803398874989484820459, v) * seed) * v.x);\r\n}\r\n\r\nuniform float u_rand;\r\nuniform sampler2D u_image;\r\n\r\nuniform float u_invert;\r\nuniform vec3 u_hsl;\r\nuniform float u_gamma;\r\nuniform float u_noise;\r\nuniform float u_sepia;\r\nuniform float u_grayscale;\r\nuniform vec3 u_temperature;\r\nuniform float u_transparency;\r\n\r\nvarying vec2 v_texCoord;\r\n\r\nvec3 rgbToHSL(float cR, float cG, float cB) \r\n{\r\n  float r = cR / 255.0;\r\n  float g = cG / 255.0;\r\n  float b = cB / 255.0;\r\n\r\n  float max = max(max(r, g), b); \r\n  float min = min(min(r, g), b);\r\n  float del = max - min;\r\n\r\n  float h = 0.0; \r\n  float s = 0.0; \r\n  float l = (max + min) / 2.0;\r\n\r\n  if (max == min) \r\n  {\r\n    return vec3(h, s, l);\r\n  }\r\n\r\n  if (l < 0.5)  \r\n  {\r\n    s = del / (max + min);\r\n  }\r\n  else  \r\n  {\r\n    s = del / (2.0 - max - min); \r\n  }\r\n\r\n  float delR = ( ( ( max - r ) / 6.0 ) + ( del / 2.0 ) ) / del;\r\n  float delG = ( ( ( max - g ) / 6.0 ) + ( del / 2.0 ) ) / del;\r\n  float delB = ( ( ( max - b ) / 6.0 ) + ( del / 2.0 ) ) / del;\r\n\r\n  if (r == max) \r\n  {\r\n    h = delB - delG;\r\n  }\r\n  else if (g == max) \r\n  {\r\n    h = (1.0 / 3.0) + delR - delB;\r\n  }\r\n  else if (b == max) \r\n  {\r\n    h = (2.0 / 3.0) + delG - delR;\r\n  }\r\n\r\n  if (h < 0.0) \r\n  {\r\n    h += 1.0;\r\n  }\r\n\r\n  if (h > 1.0) \r\n  {\r\n    h -= 1.0;\r\n  }\r\n\r\n  return vec3(h, s, l);\r\n}\r\n\r\nfloat _hue_2_rgb_(float v1, float v2, float vH) \r\n{\r\n  if (vH < 0.0) \r\n  {\r\n    vH += 1.0;\r\n  }\r\n\r\n  if (vH > 1.0) \r\n  {\r\n    vH -= 1.0;\r\n  }\r\n\r\n  if ((6.0 * vH) < 1.0)\r\n  {\r\n    return (v1 + (v2 - v1) * 6.0 * vH);\r\n  }\r\n  if ((2.0 * vH) < 1.0)\r\n  {\r\n    return v2;\r\n  }\r\n  if ((3.0 * vH) < 2.0)\r\n  {\r\n    return (v1 + (v2 - v1) * ((2.0 / 3.0) - vH) * 6.0);\r\n  }\r\n\r\n  return v1;\r\n}\r\n\r\nvec3 hslToRGB(float h, float s, float l) {\r\n  float r = 0.0;\r\n  float g = 0.0;\r\n  float b = 0.0;\r\n  float val1 = 0.0;\r\n  float val2 = 0.0;\r\n\r\n  if (s == 0.0)\r\n  {\r\n    r = l * 255.0;\r\n    g = l * 255.0;\r\n    b = l * 255.0;\r\n\r\n    return vec3(r, g, b);\r\n  }\r\n\r\n  if (l < 0.5) \r\n  {\r\n    val2 = l * (1.0 + s);\r\n  }\r\n  else\r\n  {\r\n    val2 = (l + s) - (l * s);\r\n  }\r\n      \r\n  val1 = 2.0 * l - val2;\r\n\r\n  r = 255.0 * _hue_2_rgb_(val1, val2, h + (1.0 / 3.0));\r\n  g = 255.0 * _hue_2_rgb_(val1, val2, h);\r\n  b = 255.0 * _hue_2_rgb_(val1, val2, h - (1.0 / 3.0));\r\n\r\n  return vec3(r, g, b);\r\n}\r\n\r\n\r\n\r\nvoid main() {\r\n  vec4 mainPixel = texture2D(u_image, v_texCoord);\r\n  float x = mainPixel.x * 255.0;\r\n  float y = mainPixel.y * 255.0;\r\n  float z = mainPixel.z * 255.0;\r\n  float w = mainPixel.w;\r\n\r\n  // invert\r\n  if (u_invert == 1.0) \r\n  {\r\n    x = 255.0 - x;\r\n    y = 255.0 - y;\r\n    z = 255.0 - z;\r\n  }\r\n\r\n  // hsl\r\n  {\r\n    float sVal = u_hsl.y;\r\n    float saturationAdd = 0.0;\r\n\r\n    if (sVal < 0.0) \r\n    {\r\n      sVal = (100.0 + sVal) / 100.0;\r\n      sVal *= sVal;\r\n    } \r\n    else \r\n    {\r\n      sVal = sVal / 100.0;\r\n    }\r\n    \r\n    if (u_hsl.y > 0.0) \r\n    {\r\n      saturationAdd = sVal;\r\n    }\r\n\r\n    vec3 _hsl = rgbToHSL(x, y, z);\r\n    vec3 _rgb = hslToRGB(_hsl.x + u_hsl.x, _hsl.y + saturationAdd, _hsl.z);\r\n\r\n    x = _rgb.x;\r\n    y = _rgb.y;\r\n    z = _rgb.z;\r\n\r\n    if (u_hsl.y < 0.0) \r\n    {\r\n      float luR = 0.3086;\r\n      float luG = 0.6094;\r\n      float luB = 0.0820;\r\n\r\n      x = ( ((1.0 - sVal) * luR + sVal) * x + ((1.0 - sVal) * luG) * y + ((1.0 - sVal) * luB) * z );\r\n      y = ( ((1.0 - sVal) * luR) * x + ((1.0 - sVal) * luG + sVal) * x + ((1.0 - sVal) * luB) * z );\r\n      z = ( ((1.0 - sVal) * luR) * x + ((1.0 - sVal) * luG) * y + ((1.0 - sVal) * luB + sVal) * z );\r\n    }\r\n\r\n    x = x + u_hsl.z;\r\n    y = y + u_hsl.z;\r\n    z = z + u_hsl.z;\r\n  }\r\n\r\n  // gamma\r\n  {\r\n    x = 255.0 * pow((x / 255.0), u_gamma);\r\n    y = 255.0 * pow((y / 255.0), u_gamma);\r\n    z = 255.0 * pow((z / 255.0), u_gamma);\r\n  }\r\n\r\n  // noise\r\n  {\r\n    float randAdd = 2.0 + 1.8 * u_rand;\r\n    float ran = 0.0;\r\n\r\n    x = x + ran;\r\n    y = y + ran;\r\n    z = z + ran;\r\n  }\r\n\r\n  // sepia\r\n  if (u_sepia == 1.0) \r\n  {\r\n    float red = x;\r\n    float green = y;\r\n    float blue = z;\r\n\r\n    x = (0.393 * red) + (0.769 * green) + (0.189 * blue);\r\n    y = (0.349 * red) + (0.686 * green) + (0.168 * blue);\r\n    z = (0.272 * red) + (0.534 * green) + (0.131 * blue);\r\n  }\r\n\r\n  // grayscale\r\n  if (u_grayscale == 1.0) \r\n  {\r\n    x = y = z = ((x + y + z) / 3.0);\r\n  }\r\n\r\n  x = x * u_temperature.x;\r\n  y = y * u_temperature.y;\r\n  z = z * u_temperature.z;\r\n  w = w * u_transparency;\r\n\r\n  gl_FragColor = vec4(x / 255.0, y / 255.0, z / 255.0, w).rgba;\r\n}\r\n");
;// CONCATENATED MODULE: ./src/core/image-processing.ts







class ImageProcessing {
    constructor() {
        this._scaleX = 1;
        this._scaleY = 1;
        this.flipVertical(false);
        this.flipHorizontal(false);
        this.invert(false);
        this._hsl = new Array(3);
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
            this.program = createProgram(this.gl, compileShader(this.gl, this.gl.VERTEX_SHADER, image_processing_gl2), compileShader(this.gl, this.gl.FRAGMENT_SHADER, frags_image_processing_gl2));
            return;
        }
        if (verifyWebGl1()) {
            this.gl = createWebgl1(this.canvas);
            this.program = createProgram(this.gl, compileShader(this.gl, this.gl.VERTEX_SHADER, image_processing_gl1), compileShader(this.gl, this.gl.FRAGMENT_SHADER, frags_image_processing_gl1));
            return;
        }
    }
    get getScaleX() {
        return this._scaleX;
    }
    get getScaleY() {
        return this._scaleY;
    }
    get getFlipVertical() {
        return !!this._flipVertical;
    }
    get getFlipHorizontal() {
        return !!this._flipHorizontal;
    }
    get getInvert() {
        return !!this._invert;
    }
    get getHue() {
        return this._hsl[0];
    }
    get getSaturation() {
        return this._hsl[1];
    }
    get getLightness() {
        return this._hsl[2];
    }
    get getGamma() {
        return this._gamma;
    }
    get getNoise() {
        return this._noise;
    }
    get getSepia() {
        return !!this._sepia;
    }
    get getGrayscale() {
        return !!this._grayscale;
    }
    get getTransparency() {
        return this._transparency;
    }
    destructor() {
        var _a;
        (_a = this.ctx) === null || _a === void 0 ? void 0 : _a.destructor();
        this.renderedImageBase64 = '';
    }
    loadImage(image) {
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
                .catch((err) => {
                console.error('There was an error while loading image.');
                rej(err);
            });
        });
    }
    isLoaded() {
        return this.ctx.isLoaded();
    }
    scaleX(value) {
        if (typeof (value) !== 'number') {
            return;
        }
        if (value < 0.001) {
            value = 0.001;
        }
        this._scaleX = value;
    }
    ;
    scaleY(value) {
        if (typeof (value) !== 'number') {
            return;
        }
        if (value < 0.001) {
            value = 0.001;
        }
        this._scaleX = value;
    }
    ;
    flipVertical(value) {
        if (!!value) {
            this._flipVertical = 1;
        }
        else {
            this._flipVertical = 0;
        }
    }
    flipHorizontal(value) {
        if (!!value) {
            this._flipHorizontal = 1;
        }
        else {
            this._flipHorizontal = 0;
        }
    }
    invert(value) {
        if (!!value) {
            this._invert = 1;
        }
        else {
            this._invert = 0;
        }
    }
    hsl(h, s, l) {
        this.hue(h);
        this.saturation(s);
        this.lightness(l);
    }
    hue(value) {
        if (typeof (value) !== 'number') {
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
    saturation(value) {
        if (typeof (value) !== 'number') {
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
    lightness(value) {
        if (typeof (value) !== 'number') {
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
    gamma(value) {
        if (typeof (value) !== 'number') {
            value = 1;
        }
        if (value < 0) {
            value = 0;
        }
        if (value > 100000) {
            value = 100000;
        }
        this._gamma = 1 / value;
    }
    noise(value) {
        if (typeof (value) !== 'number') {
            value = 0;
        }
        value = value * 255 * 0.1;
        this._noise = value;
    }
    sepia(value) {
        if (!!value) {
            this._sepia = 1;
        }
        else {
            this._sepia = 0;
        }
    }
    grayscale(value) {
        if (!!value) {
            this._grayscale = 1;
        }
        else {
            this._grayscale = 0;
        }
    }
    temperature(value) {
        let temp = colorTemperatureToRgb(value);
        temp[0] = temp[0] / 255;
        temp[1] = temp[1] / 255;
        temp[2] = temp[2] / 255;
        this._temperature = temp;
    }
    transparency(value) {
        if (typeof (value) !== 'number') {
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
    renderGl2() {
        return new Promise((res, rej) => {
            try {
                if (!(this.gl instanceof WebGL2RenderingContext)) {
                    rej(new Error('Rendering contex is not WebGL2RenderingContext!'));
                    return;
                }
                const imgWidth = parseInt((this.ctx.orgWidth * this._scaleX).toFixed(0));
                const imgHeight = parseInt((this.ctx.orgHeight * this._scaleY).toFixed(0));
                webglResize(this.gl, this.canvas, imgWidth, imgHeight);
                // from VERT
                const positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position');
                const texCoordAttributeLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');
                const resolutionUniformLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
                const uniformFlipVertical = this.gl.getUniformLocation(this.program, 'u_flipVertical');
                const uniformFlipHorizontal = this.gl.getUniformLocation(this.program, 'u_flipHorizontal');
                // from FRAG
                const randUniformLocation = this.gl.getUniformLocation(this.program, 'u_rand');
                const imageUniformLocation = this.gl.getUniformLocation(this.program, 'u_image');
                const uniformInvert = this.gl.getUniformLocation(this.program, 'u_invert');
                const uniformGamma = this.gl.getUniformLocation(this.program, 'u_gamma');
                const uniformHSL = this.gl.getUniformLocation(this.program, 'u_hsl');
                const uniformNoise = this.gl.getUniformLocation(this.program, 'u_noise');
                const uniformSepia = this.gl.getUniformLocation(this.program, 'u_sepia');
                const uniformGrayscale = this.gl.getUniformLocation(this.program, 'u_grayscale');
                const uniformTemperature = this.gl.getUniformLocation(this.program, 'u_temperature');
                const uniformTransparency = this.gl.getUniformLocation(this.program, 'u_transparency');
                const vao = this.gl.createVertexArray();
                this.gl.bindVertexArray(vao);
                let positionBuffer = this.gl.createBuffer();
                this.gl.enableVertexAttribArray(positionAttributeLocation);
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
                this.gl.vertexAttribPointer(positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
                var texCoordBuffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texCoordBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
                    0.0, 0.0,
                    1.0, 0.0,
                    0.0, 1.0,
                    0.0, 1.0,
                    1.0, 0.0,
                    1.0, 1.0,
                ]), this.gl.STATIC_DRAW);
                this.gl.enableVertexAttribArray(texCoordAttributeLocation);
                this.gl.vertexAttribPointer(texCoordAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
                const texture = this.gl.createTexture();
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
            catch (err) {
                rej(err);
            }
        });
    }
    renderGl1() {
        return new Promise((res, rej) => {
            try {
                if (!(this.gl instanceof WebGLRenderingContext)) {
                    rej(new Error('Rendering contex is not WebGLRenderingContext!'));
                    return;
                }
                const imgWidth = parseInt((this.ctx.orgWidth * this._scaleX).toFixed(0));
                const imgHeight = parseInt((this.ctx.orgHeight * this._scaleY).toFixed(0));
                webglResize(this.gl, this.canvas, imgWidth, imgHeight);
                // from VERT
                const positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position');
                const texCoordAttributeLocation = this.gl.getAttribLocation(this.program, 'a_texCoord');
                const resolutionUniformLocation = this.gl.getUniformLocation(this.program, 'u_resolution');
                const uniformFlipVertical = this.gl.getUniformLocation(this.program, 'u_flipVertical');
                const uniformFlipHorizontal = this.gl.getUniformLocation(this.program, 'u_flipHorizontal');
                // from FRAG
                const randUniformLocation = this.gl.getUniformLocation(this.program, 'u_rand');
                const imageUniformLocation = this.gl.getUniformLocation(this.program, 'u_image');
                const uniformInvert = this.gl.getUniformLocation(this.program, 'u_invert');
                const uniformGamma = this.gl.getUniformLocation(this.program, 'u_gamma');
                const uniformHSL = this.gl.getUniformLocation(this.program, 'u_hsl');
                const uniformNoise = this.gl.getUniformLocation(this.program, 'u_noise');
                const uniformSepia = this.gl.getUniformLocation(this.program, 'u_sepia');
                const uniformGrayscale = this.gl.getUniformLocation(this.program, 'u_grayscale');
                const uniformTemperature = this.gl.getUniformLocation(this.program, 'u_temperature');
                const uniformTransparency = this.gl.getUniformLocation(this.program, 'u_transparency');
                let positionBuffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
                setRectangle(this.gl, 0, 0, imgWidth, imgHeight);
                let texcoordBuffer = this.gl.createBuffer();
                this.gl.bindBuffer(this.gl.ARRAY_BUFFER, texcoordBuffer);
                this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
                    0.0, 0.0,
                    1.0, 0.0,
                    0.0, 1.0,
                    0.0, 1.0,
                    1.0, 0.0,
                    1.0, 1.0,
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
            catch (err) {
                rej(err);
            }
        });
    }
    render() {
        this.ctx.putActiveImageData(this.ctx.getOrgImageData());
        if (verifyWebGl2()) {
            return this.renderGl2();
        }
        if (verifyWebGl1()) {
            return this.renderGl1();
        }
    }
    getImage() {
        return this.renderedImageBase64;
    }
    isImageRendered() {
        return !!(this.renderedImageBase64);
    }
}
ImageProcessing.Canvas2dCtx = Canvas2dCtx;

;// CONCATENATED MODULE: ./src/api.ts

const Api = ImageProcessing;

;// CONCATENATED MODULE: ./src/index.js







var libName = 'ImageProcessing';

try
{
	if (getRoot()[libName] && isProduction()) {
    throw new Error('window["' + libName + '"] is already in use! Switching to: ' + 'window["___webpack_export_dp___"].' + libName);
  }

  getRoot()[libName] = Api;
}
catch(err)
{
  console.error(err);

	if (typeof(getRoot()['___webpack_export_dp___']) !== 'object') {
		getRoot()['___webpack_export_dp___'] = ({ });
	}

	getRoot()['___webpack_export_dp___'][libName] = Api;
}

/******/ })()
;