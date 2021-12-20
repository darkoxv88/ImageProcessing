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

  window.___webpack_export_dp_ImageProcessing___.definition

**/

declare class Histogram {

  public r: Array<number>;
  public g: Array<number>;
  public b: Array<number>;
  public a: Array<number>;

  constructor(imgData: ImageData);

}

declare class Canvas2dCtx {

	public static convolution(imgData: ImageData, operationMatrix: Array<number>): ImageData;

	private img: HTMLImageElement | null;
	private org: CanvasRenderingContext2D | null;
	public get orgWidth(): number;
  public get orgHeight(): number;
  private active: CanvasRenderingContext2D | null;
	public get ctx(): CanvasRenderingContext2D | null;
  public get width(): number;
  public get height(): number;
  private _size: number;
  public get size(): number;
  private _type: string;
  public get type(): string;

	constructor();
	destructor(): void;

	private generate2dCtx(w: number, h: number): CanvasRenderingContext2D;
  private duplicateCtxOrg(): CanvasRenderingContext2D;
  private duplicateCtxActive(): CanvasRenderingContext2D;
	public loadImage(file: File | Blob): Promise<void>;
	public isLoaded(): boolean;
	public getOrgImageUrl(): string;
  public getOrgImageData(): ImageData;
	public getActiveImageUrl(): string;
  public getActiveImageData(): ImageData;
  public putActiveImageData(data: ImageData): void;
	public histogram(): Histogram;

}

export declare class ImageProcessing {

	public static Canvas2dCtx: typeof Canvas2dCtx;

	private _scaleX: number;
	public get getScaleX(): number;
  private _scaleY: number;
	public get getScaleY(): number;
	private _flipVertical: number;
	public get getFlipVertical(): boolean;
  private _flipHorizontal: number;
	public get getFlipHorizontal(): boolean;
  private _invert: number;
	public get getInvert(): boolean;
	private _hsl: Array<number>;
	public get getHue(): number;
	public get getSaturation(): number;
	public get getLightness(): number;
	private _gamma: number;
	public get getGamma(): number;
	private _noise: number;
	public get getNoise(): number;
	private _sepia: number;
	public get getSepia(): boolean;
	private _grayscale: number;
	public get getGrayscale(): boolean;
	private _temperature: Array<number>;
  private _transparency: number;
	public get getTransparency(): number;

	private ctx: Canvas2dCtx;
	private canvas: HTMLCanvasElement;
  private gl: WebGL2RenderingContext;

	private renderedImageBase64: string;

	constructor();
	destructor(): void;

	public scaleX(value: number): void;
	public scaleY(value: number): void;
	public flipVertical(value: boolean): void;
	public flipHorizontal(value: boolean): void;
	public invert(value: boolean): void;
	public hsl(h: number, s: number, l: number): void;
	public hue(value: number): void;
	public saturation(value: number): void;
	public lightness(value: number): void;
	public gamma(value: number): void;

	/** 
	 * Adds noise to the image.
	 * WebGL2 only.
	**/
	public noise(value: number): void;

	public sepia(value: boolean): void;
	public grayscale(value: boolean): void;
	public temperature(value: number): void;
	public transparency(value: number): void;

	public loadImage(image: File | Blob): Promise<void>;
	public isLoaded(): boolean;
	public render(): Promise<void>;

	/** 
	 * return the base64url of the rendered image.
	**/
	public getImage(): string;
	public isImageRendered(): boolean;

}
