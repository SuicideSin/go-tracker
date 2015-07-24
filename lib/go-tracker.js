function startTracking() {
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext('2d');

  var FastTracker = function() {
    FastTracker.base(this, 'constructor');
  };
  tracking.inherits(FastTracker, tracking.Tracker);

  tracking.Fast.THRESHOLD = 10;
  FastTracker.prototype.threshold = tracking.Fast.THRESHOLD;

  FastTracker.prototype.track = function(pixels, width, height) {
    var gray = tracking.Image.grayscale(pixels, width, height);
    var corners = tracking.Fast.findCorners(gray, width, height);
    var hough = houghTransformPoints(corners, width, height);

    this.emit('track', {
      data: hough
    });
  };

  var tracker = new FastTracker();

  var mx = video.width * 0.5;
  var my = video.height * 0.5;

  tracker.on('track', function(event) {
    var a, d, rad, line, closest, absdy;
    var abs   = Math.abs;
    var round = Math.round;
    var sin   = Math.sin;
    var cos   = Math.cos;
    var PI    = Math.PI;
    context.clearRect(0, 0, canvas.width, canvas.height);
    var hough = event.data;
    var max = 0;
    for (a = 0; a < hough.length; a++) {
      for (d in hough[a]) {
        if (hough[a][d] > 20) {
          rad = a * (PI / 180.0);
          line = {
            x:   round(d * cos(rad)) + mx,
            y:   round(d * sin(rad)) + my,
            dx: -sin(rad),
            dy:  cos(rad),
          }
          context.beginPath();
          context.strokeStyle = '#00f';
          context.moveTo(line.x, line.y);
          context.lineTo(line.x + line.dx*100, line.y + line.dy*100);
          context.stroke();
          absdy = abs(line.dy);
          if (absdy < 0.1) {
            if (!closest ||
                line.y > closest.y) {
              closest = line;
            }
          }
        }
      }
    }
    if (closest) {
      context.beginPath();
      context.strokeStyle = '#f00';
      context.moveTo(closest.x, closest.y);
      context.lineTo(closest.x + closest.dx*100, closest.y + closest.dy*100);
      context.stroke();
    }
  });

  tracking.track('#video', tracker, { camera: true });
}
