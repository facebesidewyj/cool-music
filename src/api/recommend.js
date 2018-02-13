/**
 * 推荐页相关接口
 */
import { commonParams } from './config';
import { createSong, isVaildSong } from 'common/js/song';
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

/**
 * 获取歌单详情
 */
export function getDiscDetail(id) {
  const url = '/api/getDiscDetail';

  const data = Object.assign({}, commonParams, {
    disstid: id,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  });

  return axios.get(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}

/**
 * 将歌曲列表处理成我们需要的数据
 * @param  {Array} songs 传入的歌曲列表
 * @return {Array}       符合要求的歌曲列表
 */
export function formatDiscSongs(songs) {
  let res = [];
  songs.forEach(song => {
    if (isVaildSong(song)) {
      res.push(createSong(song));
    }
  });
  return res;
}
