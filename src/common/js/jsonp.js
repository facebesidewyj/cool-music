import OriginalJSONP from 'jsonp';

export default function jsonp(url, data, option) {
  // 判断传入的url是否存在？
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data);
  return new Promise((resolve, reject) => {
    OriginalJSONP(url, option, (err, data) => {
      // 成功
      if (err !== null) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}

/**
 * 将传入的参数封装成字符串拼接
 * @param  {Object} data 参数对象
 * @return {String}      拼接字符串
 */
function param(data) {
  let url = '';
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : '';
    url += `&${k}=${encodeURIComponent(value)}`;
  }
  return url ? url.substring(1) : '';
}
