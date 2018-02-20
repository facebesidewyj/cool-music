/**
 * 搜索页相关接口
 */
import { commonParams } from './config';
import axios from 'axios';
import { createSong, isVaildSong } from 'common/js/song';

/**
 * 获取搜索热词
 */
export function getHotWord() {
  const url = '/api/getHotWord';

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  });

  return axios.get(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}

/**
 * 搜索接口
 * @param  {String} query   检索词
 * @param  {Number} page    当前页
 * @param  {Number} zhida   是否搜索歌手
 * @param  {Number} perpage 前一页
 */
export function searchWord(query, page, zhida, perpage) {
  const url = '/api/searchWord';

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
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
export function formatSongs(songs) {
  let res = [];
  songs.forEach(song => {
    if (isVaildSong(song)) {
      res.push(createSong(song));
    }
  });
  return res;
}
