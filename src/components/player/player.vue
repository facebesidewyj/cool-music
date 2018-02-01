<template lang="html">
<div class="player-wrapper" v-if="playList.length > 0">
  <div class="full-screen-player" v-show="fullScreen">
    <div class="background">
      <img :src="currentSong.image" alt="背景图" width="100%" height="100%">
    </div>
    <!-- 顶部布局 -->
    <div class="top">
      <div class="icon-back-wrapper" @click="togglePlayer">
        <i class="icon-back"></i>
      </div>
      <h1 class="song-name">{{currentSong.album}}</h1>
      <h2 class="singer-name" v-html="currentSong.singer"></h2>
    </div>
    <!-- 中间布局 -->
    <div class="middle">
      <div class="cd">
        <img :src="currentSong.image" alt="cd">
      </div>
      <div class="song-desc-wrapper">
        <div class="song-desc">{{songDesc}}</div>
      </div>
    </div>
    <!-- 底部布局 -->
    <div class="bottom">
      <div class="operators-wrapper">
        <div class="icon-wrapper">
          <i class="icon-sequence"></i>
        </div>
        <div class="icon-wrapper">
          <i class="icon-prev"></i>
        </div>
        <div class="icon-wrapper">
          <i class="icon-play"></i>
        </div>
        <div class="icon-wrapper">
          <i class="icon-next"></i>
        </div>
        <div class="icon-wrapper">
          <i class="icon-not-favorite"></i>
        </div>
      </div>
    </div>
  </div>
  <div class="mini-player" v-show="!fullScreen">
    <div class="mini-cd">
      <img :src="currentSong.image" alt="cd">
    </div>
    <div class="mini-content-wrapper">
      <h1 class="mini-song-name">{{currentSong.name}}</h1>
      <p class="mini-singer-name">{{currentSong.singer}}</p>
    </div>
    <div class="mini-operator-wrapper">
      <div class="mini-icon-wrapper">
        <i class="icon-play"></i>
      </div>

    </div>
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
    songDesc() {
      return this.currentSong.album + '-' + this.currentSong.singer;
    },
    ...mapGetters(['playList', 'fullScreen', 'currentSong'])
  },
  methods: {
    togglePlayer() {
      alert(1);
    }
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';
@import '../../common/less/mixin.less';

.full-screen-player {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 150;
  background-color: @color-background;
  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    // css滤镜
    filter: blur(20px);
  }
  .top {
    position: relative;
    margin-bottom: 25px;
    .icon-back-wrapper {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;
      .icon-back {
        display: block;
        padding: 10px;
        transform: rotate(-90deg);
        font-size: @font-size-large-x;
        color: @color-theme;
      }
    }
    .song-name {
      width: 70%;
      margin: 0 auto;
      line-height: 40px;
      text-align: center;
      .no-wrap;
      font-size: @font-size-large;
      color: @color-text;
    }
    .singer-name {
      line-height: 20px;
      text-align: center;
      font-size: @font-size-medium;
      color: @color-text;
    }
  }
  .middle {
    position: fixed;
    top: 80px;
    bottom: 170px;
    width: 100%;
    white-space: nowrap;
    .cd {
      width: 100%;
      text-align: center;
      img {
        width: 80%;
        height: 80%;
        border-radius: 50%;
        box-sizing: border-box;
        border: 10px solid rgba(255, 255, 255, 0.1);
      }
    }
    .song-desc-wrapper {
      width: 80%;
      margin: 30px auto 0 auto;
      text-align: center;
      .no-wrap;
      .song-desc {
        height: 20px;
        line-height: 20px;
        font-size: @font-size-medium;
        color: @color-text-l;
      }
    }
  }

  .bottom {
    position: absolute;
    bottom: 50px;
    width: 100%;
    .operators-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-around;
      .icon-wrapper {
        color: @color-theme;
        font-size: 30px;
        padding: 10px;
        .icon-play {
          font-size: 40px;
        }
      }
    }
  }
}
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  z-index: 180;
  background: @color-highlight-background;
  .mini-cd {
    flex: 0 0 40px;
    width: 40px;
    padding: 0 10px 0 20px;
    img {
      width: 100%;
      border-radius: 50%;
    }
  }
  .mini-content-wrapper {
    flex: 1;
    line-height: 20px;
    .mini-song-name {
      font-size: @font-size-medium;
    }
    .mini-singer-name {
      font-size: @font-size-small;
      color: @color-text-l;
    }
  }
  .mini-operator-wrapper {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    color: @color-sub-theme;
    .icon-play {
      font-size: 30px;
    }
  }
}
</style>
