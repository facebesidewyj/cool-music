<template lang="html">
<div class="player-wrapper" v-if="playList.length > 0">
  <transition name="normal">
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
        <div class="cd" :class="cdRotate">
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
          <div class="icon-wrapper" @click="togglePlayState">
            <i :class="playIcon"></i>
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
  </transition>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="togglePlayer">
      <div class="mini-cd">
        <img :src="currentSong.image" alt="cd" :class="cdRotate">
      </div>
      <div class="mini-content-wrapper">
        <h1 class="mini-song-name">{{currentSong.name}}</h1>
        <p class="mini-singer-name">{{currentSong.singer}}</p>
      </div>
      <div class="mini-operator-wrapper">
        <div class="mini-icon-wrapper" @click.stop="togglePlayState">
          <i :class="miniPlayIcon"></i>
        </div>
      </div>
    </div>
  </transition>
  <audio :src="currentSong.url" ref="audio"></audio>
</div>
</template>

<script type="text/ecmascript-6">
// 引入vuex的语法糖
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'player',
  data() {
    return {};
  },
  computed: {
    /**
     * 控制cd旋转动画
     */
    cdRotate() {
      return this.playState ? 'play' : 'play pause';
    },

    songDesc() {
      return this.currentSong.album + '-' + this.currentSong.singer;
    },

    /**
     * 全屏播放器播放按钮展示
     */
    playIcon() {
      if (this.playState) {
        return 'icon-pause';
      } else {
        return 'icon-play';
      }
    },

    /**
     * 迷你播放器播放按钮展示
     */
    miniPlayIcon() {
      return this.playState ? 'icon-pause-mini' : 'icon-play-mini';
    },
    ...mapGetters(['playList', 'fullScreen', 'currentSong', 'playState'])
  },
  methods: {
    /**
     * 点击切换播放器显示状态
     */
    togglePlayer() {
      this.setFullScreen(!this.fullScreen);
    },

    /**
     * 点击切换暂停或播放
     */
    togglePlayState() {
      this.setPlayState(!this.playState);
    },

    /**
     * vuex提供的存数据的语法糖，映射mutations里的方法
     * @type {String}
     */
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayState: 'SET_PLAY_STATE'
    })
  },
  watch: {
    currentSong(newSong) {
      setTimeout(() => {
        this.$refs.audio.play();
      }, 5000);
    },
    playState(newState) {
      let audio = this.$refs.audio;

      setTimeout(() => {
        if (newState) {
          audio.play();
        } else {
          audio.pause();
        }
      }, 1000);
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

      // cd旋转动画
      &.play {
        animation: rotate 20s linear infinite;
      }

      &.pause {
        animation-play-state: paused;
      }

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
        .icon-pause {
          font-size: 40px;
        }
      }
    }
  }
}
.normal-enter-active,
.normal-leave-active {
  transition: all 0.5s;
  .top .bottom {
    transition: all 0.5s cubic-bezier(0.86, 0.18, 0.82, 1.32);
  }
}
.normal-enter,
.normal-leave-to {
  opacity: 0;
  .top {
    transform: translate3d(0, -100px, 0);
  }
  .bottom {
    transform: translate3d(0, 100px, 0);
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

      // cd旋转动画
      &.play {
        animation: rotate 10s linear infinite;
      }

      &.pause {
        animation-play-state: paused;
      }
    }
  }
  .mini-content-wrapper {
    flex: 1;
    line-height: 20px;
    .mini-song-name {
      .no-wrap;
      font-size: @font-size-medium;
    }
    .mini-singer-name {
      .no-wrap;
      font-size: @font-size-small;
      color: @color-text-l;
    }
  }
  .mini-operator-wrapper {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    color: @color-sub-theme;
    .icon-play-mini {
      font-size: 30px;
    }
    .icon-pause-mini {
      font-size: 30px;
    }
  }
}
.mini-enter-active,
.mini-leave-active {
  transition: all 0.5s;
}
.mini-leave-to,
.mini-enter {
  opacity: 0;
}
@keyframes rotate {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
