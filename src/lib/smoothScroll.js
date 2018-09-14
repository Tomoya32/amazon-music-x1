let smoothScrollTo = function(element, target, duration) {
  /**
  source: https://coderwall.com/p/hujlhg/smooth-scrolling-without-jquery
      Smoothly scroll element to the given target (element.scrollLeft)
      for the given duration

      Returns a promise that's fulfilled when done, or rejected if
      interrupted
   */
    target = Math.round(target);
    duration = Math.round(duration);
    if (duration < 0) {
        return Promise.reject("bad duration");
    }
    if (duration === 0) {
        element.scrollLeft = target;
        return Promise.resolve();
    }

    let start_time = Date.now();
    let end_time = start_time + duration;

    let start_top = element.scrollLeft;
    let distance = target - start_top;

    // based on http://en.wikipedia.org/wiki/Smoothstep
    let smooth_step = function(start, end, point) {
        if(point <= start) { return 0; }
        if(point >= end) { return 1; }
        let x = (point - start) / (end - start); // interpolation
        return x*x*(3 - 2*x);
    }

    return new Promise(function(resolve, reject) {
        // This is to keep track of where the element's scrollTop is
        // supposed to be, based on what we're doing
        let previous_top = element.scrollLeft;

        // This is like a think function from a game loop
        let scroll_frame = function() {
            if(element.scrollLeft != previous_top) {
                reject("interrupted");
                return;
            }

            // set the scrollTop for this frame
            let now = Date.now();
            let point = smooth_step(start_time, end_time, now);
            let frameTop = Math.round(start_top + (distance * point));
            element.scrollLeft = frameTop;

            // check if we're done!
            if(now >= end_time) {
                resolve();
                return;
            }

            // If we were supposed to scroll but didn't, then we
            // probably hit the limit, so consider it done; not
            // interrupted.
            if(element.scrollLeft === previous_top
                && element.scrollLeft !== frameTop) {
                resolve();
                return;
            }
            previous_top = element.scrollLeft;

            // schedule next frame for execution
            setTimeout(scroll_frame, 0);
        }

        // boostrap the animation process
        setTimeout(scroll_frame, 0);
    });
}

export default smoothScrollTo;
