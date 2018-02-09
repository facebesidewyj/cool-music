/**
 *封装一系列mutation操作
 */
import * as types from './mutation-types';
import { util } from 'common/js/util';
import { playMode } from 'common/js/config';

export function selectPlay({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list);

  // 随机播放，打乱播放列表，并寻找索引
  if (state.playMode === playMode.random) {
    let randomList = util.randomArray(list);
    index = randomList.findIndex(item => {
      return item.id === list[index].id;
    });
    commit(types.SET_PLAY_LIST, randomList);
  } else {
    commit(types.SET_PLAY_LIST, list);
  }

  commit(types.SET_PLAY_STATE, true);
  commit(types.SET_FULL_SCREEN, true);
  commit(types.SET_CURRENT_INDEX, index);
}

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
