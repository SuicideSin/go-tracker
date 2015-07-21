// pass in ImageData
function houghTransform(image) {
  var i, a, rad, d, x, y;
  var width  = image.width;
  var height = image.height;
  var mx     = width * 0.5;
  var my     = height * 0.5;
  var hough  = [];
  var length = image.length / 4;
  for (i = 0; i < length; i++) {
    // look at r (should be the same in grayscale)
    if (image[i * 4] > 32) {
      for (a = 0; a <= 180; a++) {
        x = i % width;
        y = Math.floor((i - x) / width);
        rad = a * (Math.PI / 180.0);
        d = Math.round((x-mx) * Math.cos(rad) + (y-my) * Math.sin(rad));
        if (!hough[a]) {
          hough[a] = {};
        }
        if (hough[a][d] >= 0) {
          hough[a][d] += 1;
        } else {
          hough[a][d] = 1;
        }
      }
    }
  }
  return hough;
}

function houghTransformPoints(points, width, height) {
  var i, a, rad, d, x, y;
  var mx     = width * 0.5;
  var my     = height * 0.5;
  var hough  = [];
  var length = points.length;
  for (i = 0; i < length; i+=2) {
    for (a = 0; a <= 180; a++) {
      x = points[i];
      y = points[i + 1];
      rad = a * (Math.PI / 180.0);
      d = Math.round((x-mx) * Math.cos(rad) + (y-my) * Math.sin(rad));
      if (!hough[a]) {
        hough[a] = {};
      }
      if (hough[a][d] >= 0) {
        hough[a][d] += 1;
      } else {
        hough[a][d] = 1;
      }
    }
  }
  return hough;
}
