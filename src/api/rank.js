/**
 * 榜单页相关接口
 */
import { commonParams } from './config';
import { createSong, isVaildSong } from 'common/js/song';
import axios from 'axios';

/**
 * 获取榜单列表
 */
export function getRankList() {
  const url = '/api/getRankList';

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  });

  return axios(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}

/**
 * 获取榜单歌曲列表
 * @param  {Number} id 榜单id
 */
export function getRankDetail(id) {
  const url = '/api/getRankDetail';

  const data = Object.assign({}, commonParams, {
    topid: id,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5',
    format: 'json'
  });

  return axios.get(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}

export function formatRankSongs(songs) {
  let res = [];
  songs.forEach(song => {
    if (isVaildSong(song.data)) {
      res.push(createSong(song.data));
    }
  });
  return res;
}
