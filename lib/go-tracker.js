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

    this.emit('track', {
      data: corners
    });
  };

  var tracker = new FastTracker();

  var mx = video.width * 0.5;
  var my = video.height * 0.5;

  tracker.on('track', function(event) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    // var corners = event.data;
    // for (var i = 0; i < corners.length; i += 2) {
    //   context.fillStyle = '#f00';
    //   context.fillRect(corners[i], corners[i + 1], 2, 2);
    // }

    var hough = houghTransformPoints(event.data, video.width, video.height);
    var max = 0;
    for (var a = 0; a < hough.length; a++) {
      for (var d in hough[a]) {
        if (hough[a][d] > 25) {
          var rad = a * (Math.PI / 180.0);
          var x = Math.round(d * Math.cos(rad)) + mx;
          var y = Math.round(d * Math.sin(rad)) + my;
          // rad = Math.atan2(this.x, -this.y);
          var dx = -Math.sin(rad) * 100;
          var dy = Math.cos(rad) * 100;
          context.beginPath();
          context.strokeStyle = '#00f';
          context.moveTo(x, y);
          context.lineTo(x + dx, y + dy);
          context.stroke();
        }
      }
    }
  });

  tracking.track('#video', tracker, { camera: true });
}
