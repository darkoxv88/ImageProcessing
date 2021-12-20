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

    for (var i = 0; i < imgData.data.length; i += 4) {
      this.r[imgData.data[i]] += 1;
      this.g[imgData.data[i + 1]] += 1;
      this.b[imgData.data[i + 2]] += 1;
      this.a[imgData.data[i + 3]] += 1;
    }
  }

}