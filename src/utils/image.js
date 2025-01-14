export async function getImageLink(imageLinks = {}) {
  // * I need the dimensions of the image
  const image =
    imageLinks.extraLarge ||
    imageLinks.large ||
    imageLinks.medium ||
    imageLinks.small ||
    imageLinks.thumbnail;
  if (image) {
    const img = new Image();
    img.src = image;
    const loadImage = new Promise((resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
    return loadImage
      .then((loadedImg) => {
        return {
          width: loadedImg.width,
          height: loadedImg.height,
          image,
        };
      })
      .catch((error) => {
        console.error("Image failed to load", error);
      });
  }

  return "";
}
