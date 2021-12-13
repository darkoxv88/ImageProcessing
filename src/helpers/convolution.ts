import { byte } from "../utility/byte";

export function convolution(imgData: ImageData, operationMatrix: Array<number>): ImageData {
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
          };

          while (currentMatH >= canvasHeight) {
            currentMatH -= 1;
          };

          while (currentMatW < 0) {
            currentMatW += 1;
          };

          while (currentMatW >= canvasWidth) {
            currentMatW -= 1;
          };

          let offset = (currentMatH * canvasWidth + currentMatW) * 4;
          let operation = operationMatrix[matH * side + matW];

          sumR += imgData.data[offset] * operation;
          sumG += imgData.data[offset + 1] * operation;
          sumB += imgData.data[offset + 2] * operation;
        }
      }

      outputData.data[position] = byte(sumR);
      outputData.data[position + 1] = byte(sumG);
      outputData.data[position + 2] = byte(sumB);
      outputData.data[position + 3] = imgData.data[position + 3];
    }
  }

  return outputData; 
}
