import { getRoot } from "./refs/root";
import { ImageProcessing } from "./core/image-processing"

export const Api: typeof ImageProcessing = ImageProcessing;

/*
const toTest: boolean = true;
if (toTest) {
  const test = new Api();

  getRoot().onload = function() {
    const img = new Image();
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.onchange = (async (ev: any) => {
      await test.loadImage(ev.target.files[0]);
      img.src = test.getImage();
    })
    const div1 = document.createElement('div');
    div1.append(input);
    div1.append(img);
    document.body.appendChild(div1);
  }
}
*/
