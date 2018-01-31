import * as types from './mutation-types';

const mutation = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  },
  [types.SET_PLAY_STATE](state, playState) {
    state.playState = playState;
  },
  [types.SET_FULL_SCREEN](state, fullScreen) {
    state.fullScreen = fullScreen;
  },
  [types.SET_PLAY_LIST](state, playList) {
    state.playList = playList;
  },
  [types.SET_SEQUENCE_LIST](state, sequenceList) {
    state.sequenceList = sequenceList;
  },
  [types.SET_PLAY_MODE](state, playMode) {
    state.playMode = playMode;
  },
  [types.SET_CURRENT_INDEX](state, currentIndex) {
    state.currentIndex = currentIndex;
  }
};

export default mutation;
