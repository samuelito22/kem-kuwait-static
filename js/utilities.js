const addEventListener = (elem, event, fn) => {
  if (elem.addEventListener) {
    // modern browsers
    elem.addEventListener(event, fn, false);
  } else if (elem.attachEvent) {
    // IE 8 and earlier
    elem.attachEvent("on" + event, fn);
  } else {
    // fallback for ancient browsers
    elem["on" + event] = fn;
  }
};
const removeEventListener = (elem, event, fn) => {
  if (elem.removeEventListener) {
    // modern browsers
    elem.removeEventListener(event, fn, false);
  } else if (elem.attachEvent) {
    // IE 8 and earlier
    elem.detachEvent("on" + event, fn);
  } else {
    // fallback for ancient browsers
    elem["on" + event] = null;
  }
};
//
