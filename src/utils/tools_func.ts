

// 对象去重
export const unique = (arr: Array<any>, key: string): Array<any> => {
  var result = [];
  var obj = {};
  for (var i = 0; i < arr.length; i++) {
    if (!obj[arr[i][key]]) {
      result.push(arr[i]);
      obj[arr[i][key]] = true;
    }
  }
  return result;
}