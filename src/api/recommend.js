/**
 * 获取推荐页数据
 */
// import jsonp from 'common/js/jsonp';
import { commonParams } from './config';
import axios from 'axios';

export function getRecommend() {
  const url = '/api/getRecommend';

  // Object.assign对象合并，第一个参数为目标对象，后续两个参数为源对象
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  });

  return axios.get(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}

/**
 * 获取推荐歌单
 */
export function getDiscList() {
  const url = '/api/getDiscList';

  // Object.assign对象合并，第一个参数为目标对象，后续两个参数为源对象
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });

  // axios通过浏览器发送ajax请求获取数据
  return axios.get(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}
