/**
 * 获取歌曲列表数据
 */
import { commonParams } from './config';
import axios from 'axios';
import { createSong } from 'common/js/song';
import { getUid } from 'common/js/uid';

/**
 * 用于获取歌手对应歌曲列表的接口
 * @return {Object} 返回Promise
 */
export function getSingerSongs(singerId) {
  const url = '/api/getSingerSongs';
  const data = Object.assign(commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  });

  return axios.get(url, { params: data }).then(res => {
    return Promise.resolve(res.data);
  });
}

/**
 * 用于获取合法key的接口
 * @return {Object} 返回Promise
 */
export function getVKey(songmid, filename) {
  const url = '/api/getVKey';

  const data = Object.assign({}, commonParams, {
    cid: 205361747,
    format: 'json',
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    uin: 0,
    songmid,
    filename,
    guid: getUid()
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
    // 解构赋值
    let { musicData } = song;
    if (musicData.songid && musicData.albumid) {
      res.push(createSong(musicData));
    }
  });
  return res;
}
