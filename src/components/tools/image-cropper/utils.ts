interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Scales CSS container dimensions to natural image dimensions.
 */
export function scaleCropCoordinates(
  containerWidth: number,
  containerHeight: number,
  naturalWidth: number,
  naturalHeight: number,
  boxX: number,
  boxY: number,
  boxWidth: number,
  boxHeight: number
): Rect {
  if (containerWidth <= 0 || containerHeight <= 0 || naturalWidth <= 0 || naturalHeight <= 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const scaleX = naturalWidth / containerWidth;
  const scaleY = naturalHeight / containerHeight;

  return {
    x: Math.round(boxX * scaleX),
    y: Math.round(boxY * scaleY),
    width: Math.round(boxWidth * scaleX),
    height: Math.round(boxHeight * scaleY),
  };
}
