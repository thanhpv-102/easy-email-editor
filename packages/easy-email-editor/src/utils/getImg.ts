import { ImageManager } from 'easy-email-core';

const defaultImagesMap = {
  IMAGE_59:
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiM0Rjc5QTQiIHJ4PSI0Ii8+PHBhdGggZD0iTTkgMTFWOWgyTDggNiA1IDloMlYxMWgyem02IDJWOTE4bC0zIDNoLTJWOUg4bDMtM3ptMCA2bC0zIDNoMlYyMUg4di0ybC0zIDMgMy0zSDd2LTJsMy0zIDMgM3oiIGZpbGw9IiNmZmZmZmYiLz48L3N2Zz4=',
};

ImageManager.add(defaultImagesMap);

export function getImg(name: keyof typeof defaultImagesMap) {
  return ImageManager.get(name);
}
