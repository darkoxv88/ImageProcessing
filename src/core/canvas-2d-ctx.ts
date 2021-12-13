import { byte } from "../utility/byte";
import { convolution } from "../helpers/convolution";
import { Histogram } from "../helpers/histogram";

export class Canvas2dCtx {

  private img: HTMLImageElement | null;

  private _size: number;
  public get size(): number {
    return this._size;
  }

  private _type: string;
  public get type(): string {
    return this._type;
  }

  private org: CanvasRenderingContext2D | null;
  public get orgWidth(): number {
    return this.org?.canvas?.width;
  }
  public get orgHeight(): number {
    return this.org?.canvas?.height;
  }
  private active: CanvasRenderingContext2D | null;
  public get ctx(): CanvasRenderingContext2D | null {
    return this.active;
  }
  public get width(): number {
    return this.active?.canvas?.width;
  }
  public get height(): number {
    return this.active?.canvas?.height;
  }

  constructor() { }

  destructor() {
    this.clear();
  }

  public clear(): void {
    this.img = null;
    this._size = undefined;
    this._type = undefined;
    this.org = null;
    this.active = null;
  }

  private generate2dCtx(w: number, h: number): CanvasRenderingContext2D {
    let newCanvas = document.createElement('canvas');
    newCanvas.width = w;
    newCanvas.height = h;
    return  newCanvas.getContext('2d');
  }

  private duplicateCtxOrg(): CanvasRenderingContext2D {
    let context = this.generate2dCtx(this.org?.canvas?.width, this.org?.canvas?.height)
    context.drawImage(this.org?.canvas, 0, 0);
    return context;
  }

  private duplicateCtxActive(): CanvasRenderingContext2D {
    let context = this.generate2dCtx(this.active?.canvas?.width, this.active?.canvas?.height)
    context.drawImage(this.active?.canvas, 0, 0);
    return context;
  }

  public loadImage(file: File | Blob): Promise<void> {
    if (!file) {
      return;
    }

    this.clear(); 

    return new Promise<void>((resolve, reject) => {
      var reader: FileReader = new FileReader();

      reader.onload = (ev: ProgressEvent<FileReader>) => {
        if (typeof reader.result == 'string') {
          var image = new Image();

          image.onload = () => {
            this.img = image;

            this._size = file?.size;
            this._type = file?.type;
      
            let ctx: CanvasRenderingContext2D = this.generate2dCtx(this.img?.width, this.img?.height);
            ctx.drawImage(this.img, 0, 0);
      
            this.org = ctx;
            this.active = this.duplicateCtxOrg();

            resolve()
          };

          image.onerror = reject;
          image.src = reader.result;
        } else {
          reject(ev);
        }
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  public isLoaded(): boolean {
    return !!this.org;
  }

  public getOrgImageUrl(): string {
    return this.org?.canvas?.toDataURL('image/png');
  }

  public getOrgImageData(): ImageData {
    return this.active?.getImageData(0, 0, this.orgWidth, this.orgHeight);
  }

  public getActiveImageUrl(): string {
    return this.active?.canvas?.toDataURL('image/png');
  }

  public getActiveImageData(): ImageData {
    return this.active?.getImageData(0, 0, this.width, this.height);
  }

  public putActiveImageData(data: ImageData): void {
    try
    {
      this.active.canvas.width = data.width;
      this.active.canvas.height = data.height
      this.active?.putImageData(data, 0, 0);
    }
    catch(err)
    { 
      console.error(err);
    }
  }

  public histogram(): Histogram {
    return new Histogram(this.getActiveImageData());
  }

  public flipImage(flipH: boolean, flipV: boolean): void {
    var scaleH = flipH ? -1 : 1;
    var scaleV = flipV ? -1 : 1;

    if(flipH) { 
      this.active.translate(this.width, 0); 
    }

    if(flipV) { 
      this.active.translate(0, this.height); 
    } 

    this.active.scale(scaleH, scaleV);
    this.active.drawImage(this.active.canvas, 0, 0);
    this.active.setTransform(1,0,0,1,0,0);
    this.active.restore();
  }

}
