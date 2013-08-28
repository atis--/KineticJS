
function sign(n) {
    return n?(n<0?-1:1):0;
}
var adj_f = 1.2;

(function() {
    Kinetic.SmoothLine = function(config) {
        this.___init(config);
    };

    Kinetic.SmoothLine.prototype = {
        ___init: function(config) {
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.className = 'SmoothLine';
        },
        drawFunc: function(canvas) {
            var points = this.getPoints(),
                length = points.length,
                context = canvas.getContext(),
                n, point, prev_point, next_point, f, prev_seg, seg,
                seg_len, prev_seg_len, CSP, CEP, corner_size;

            // Do nothing if there's only a single point.
            if (length < 2)
                return;

            // First segment.
            prev_point = points[0];
            prev_seg = {
                x: points[1].x - prev_point.x,
                y: points[1].y - prev_point.y
            };
            prev_seg_len = Math.sqrt(prev_seg.x*prev_seg.x + prev_seg.y*prev_seg.y);

            // Move to intial point (note the adjustment/hack).
            context.beginPath();
            context.moveTo(points[0].x+adj_f*sign(prev_seg.x),
                           points[0].y+adj_f*sign(prev_seg.y));

            if (length < 3) {
                // Direct line to final point (+hack).
                context.lineTo(points[length-1].x-adj_f*sign(prev_seg.x),
                               points[length-1].y-adj_f*sign(prev_seg.y));
                canvas.stroke(this);
                return;
            }

            for (n = 1; n <= length - 2; n++) {
                point = points[n];
                next_point = points[n+1];

                // Next segment.
                seg = {
                    x: next_point.x - point.x,
                    y: next_point.y - point.y
                };
                seg_len = Math.sqrt(seg.x*seg.x + seg.y*seg.y);

                // Corner size.
                corner_size = Math.min(8, prev_seg_len*0.5, seg_len*0.5);

                // Curve start point.
                f = (prev_seg_len - corner_size) / prev_seg_len;
                CSP = {
                    x: prev_point.x + prev_seg.x*f,
                    y: prev_point.y + prev_seg.y*f
                };

                // Curve end point.
                f = corner_size / seg_len;
                CEP = {
                    x: point.x + seg.x*f,
                    y: point.y + seg.y*f
                };
                context.lineTo(CSP.x, CSP.y);
                context.quadraticCurveTo(point.x, point.y, CEP.x, CEP.y);

                prev_point = point;
                prev_seg = seg;
                prev_seg_len = seg_len;
            }

            // Straight line to last point (+hack).
            point = points[length-1];
            context.lineTo(point.x-adj_f*sign(seg.x),
                           point.y-adj_f*sign(seg.y));

            canvas.stroke(this);
        }
    };
    Kinetic.Util.extend(Kinetic.SmoothLine, Kinetic.Shape);

    Kinetic.Factory.addPointsGetterSetter(Kinetic.SmoothLine, 'points');
})();
