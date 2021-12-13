export class Histogram {

  public r: Array<number>;
  public g: Array<number>;
  public b: Array<number>;
  public a: Array<number>;

  constructor(imgData: ImageData) {
    this.r = new Array<number>();
    this.g = new Array<number>();
    this.b = new Array<number>();
    this.a = new Array<number>();

    for (var i = 0; i < 256; i += 1) {
      this.r[i] = 0;
      this.g[i] = 0;
      this.b[i] = 0;
      this.a[i] = 0;
    }
  }

}