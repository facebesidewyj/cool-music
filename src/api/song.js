/**
 * 获取歌手列表数据并对数据进行处理
 */
// import { commonParams } from './config';
// import axios from 'axios';

import { createSong } from 'common/js/song';

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
