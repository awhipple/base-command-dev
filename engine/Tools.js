export function shallow(obj, depth = 1) {
  var newObj = {};
  Object.keys(obj).forEach(key => {
    if (obj.hasOwnProperty(key)) {
      if ( depth > 1 && typeof obj[key] ) {
        newObj[key] = shallow(obj[key], depth - 1);
      } else {
        newObj[key] = obj[key];
      }
    }
  });
  return newObj;
}