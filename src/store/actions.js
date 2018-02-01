/**
 *封装一系列mutation操作
 */
import * as types from './mutation-types';

export function selectPlay({ commit, state }, { list, index }) {
  commit(types.SET_SEQUENCE_LIST, list);
  commit(types.SET_FULL_SCREEN, false);
  commit(types.SET_PLAY_LIST, list);
  commit(types.SET_PLAY_STATE, true);
  commit(types.SET_CURRENT_INDEX, index);
}
