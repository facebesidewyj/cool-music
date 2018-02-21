/**
 *封装一系列mutation操作
 */
import * as types from './mutation-types';
import { util } from 'common/js/util';
import { playMode } from 'common/js/config';

/**
 * 播放歌曲
 */
export function selectPlay({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list);

  // 随机播放，打乱播放列表，并寻找索引
  if (state.playMode === playMode.random) {
    let randomList = util.randomArray(list);

    index = findIndex(randomList, list[index]);
    commit(types.SET_PLAY_LIST, randomList);
  } else {
    commit(types.SET_PLAY_LIST, list);
  }

  commit(types.SET_PLAY_STATE, true);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_CURRENT_INDEX, index);
}

/**
 * 随机播放
 */
export function playRandom({ commit }, { list }) {
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_PLAY_MODE, playMode.random);
  commit(types.SET_FULL_SCREEN, true);

  // 打乱播放列表
  let randomList = util.randomArray(list);
  commit(types.SET_PLAY_LIST, randomList);
  commit(types.SET_PLAY_STATE, true);
  commit(types.SET_CURRENT_INDEX, 0);
}

/**
 * 向列表中插入新歌曲
 */
export function insertNewSong({ commit, state }, song) {
  let playList = state.playList.slice();
  let sequenceList = state.sequenceList.slice();
  let currentIndex = state.currentIndex;

  // 获取当前歌曲
  let currentSong = playList[currentIndex];

  // 判断当前播放列表中是否已经存在要插入的歌曲
  let songInPlayList = findIndex(playList, song);

  // 判断前播放列表中是否存在该歌曲
  if (songInPlayList > -1) {
    // 将已存在的歌曲去除
    playList.splice(songInPlayList, 1);

    // 判断当前索引的位置
    if (currentIndex > songInPlayList) {
      playList.splice(currentIndex, 0, song);
    } else {
      playList.splice(currentIndex + 1, 0, song);
    }
  } else {
    playList.splice(currentIndex + 1, 0, song);
  }

  // 获取原始歌曲列表中的当前索引和该歌曲索引
  let currentSongInSequenceList = findIndex(sequenceList, currentSong);
  let songInSequenceList = findIndex(sequenceList, song);

  // 判断原始列表中是否存在该歌曲
  if (songInSequenceList > -1) {
    // 将已存在的歌曲去除
    sequenceList.splice(songInSequenceList, 1);

    // 判断当前索引的位置
    if (currentSongInSequenceList > songInSequenceList) {
      sequenceList.splice(currentSongInSequenceList, 0, song);
    } else {
      sequenceList.splice(currentSongInSequenceList + 1, 0, song);
    }
  } else {
    sequenceList.splice(currentSongInSequenceList + 1, 0, song);
  }

  currentIndex++;

  commit(types.SET_PLAY_LIST, playList);
  commit(types.SET_SEQUENCE_LIST, sequenceList);
  commit(types.SET_CURRENT_INDEX, currentIndex);
  commit(types.SET_PLAY_STATE, true);
  commit(types.SET_FULL_SCREEN, true);
}

function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id;
  });
}
