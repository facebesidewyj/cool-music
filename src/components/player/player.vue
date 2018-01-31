<template lang="html">
<div class="player-wrapper" v-if="playList.length > 0">
  <div class="full-screen-player" v-show="fullScreen">
    全屏播放器
  </div>
  <div class="mini-player">
    迷你播放器
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import { mapGetters } from 'vuex';

export default {
  name: 'player',
  data() {
    return {};
  },
  computed: {
    ...mapGetters(['playList', 'fullScreen'])
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';

.full-screen-player {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 100;
  background-color: @color-background;
}
</style>
