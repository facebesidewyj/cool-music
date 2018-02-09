/**
 * Vue组件调用的mixin
 */
import { mapGetters } from 'vuex';

export const playListMixin = {
  computed: {
    ...mapGetters(['playList'])
  },
  mounted() {
    this.handlePlayList(this.playList);
  },
  /**
   * keep-alive组件激活时触发
   */
  activated() {
    this.handlePlayList(this.playList);
  },
  watch: {
    playList(newList) {
      this.handlePlayList(newList);
    }
  },
  methods: {
    handlePlayList(playList) {
      throw new Error('error');
    }
  }
};
