import jsonp from 'common/js/jsonp';
import { commonParam, options } from './config';

export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

  // Object.assign对象合并，第一个参数为目标对象，后续两个参数为源对象
  const data = Object.assign({}, commonParam, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });

  return jsonp(url, data, options);
}

export function getDicsList() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg';

  // Object.assign对象合并，第一个参数为目标对象，后续两个参数为源对象
  const data = Object.assign({}, commonParam, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });

  return jsonp(url, data, options);
}
