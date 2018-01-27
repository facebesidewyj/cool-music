import * as types from './mutation-types';

const mutation = {
  [types.SET_SINGER](state, singer) {
    state.singer = singer;
  }
};

export default mutation;
