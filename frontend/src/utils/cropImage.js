// utils/cropImage.js
export const getCroppedImg = async (imageSrc, pixelCrop, size = 512) => {
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));
  
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
  
    const ctx = canvas.getContext("2d");
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      size,
      size
    );
  
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, "image/jpeg", 0.9);
    });
  };