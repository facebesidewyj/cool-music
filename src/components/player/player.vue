<!-- 动画有问题，第一次不执行 -->
<template>
<div class="player-wrapper" v-show="playList.length > 0">
  <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
    <div class="full-screen-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.image" alt="背景图" width="100%" height="100%">
      </div>
      <!-- 顶部布局 -->
      <div class="top">
        <div class="icon-back-wrapper" @click="togglePlayer">
          <i class="icon-back"></i>
        </div>
        <h1 class="song-name" v-html="currentSong.name"></h1>
        <h2 class="singer-name" v-html="currentSong.singer"></h2>
      </div>
      <!-- 中间布局 -->
      <div class="middle" @touchstart.prevent="moveTouchStart" @touchmove.prevent="moveTouching" @touchend="moveTouchEnd">
        <div class="middle-cd" ref="cdWrapper">
          <div class="cd" ref="cd">
            <img :src="currentSong.image" :class="cdRotate" alt="cd">
          </div>
          <div class="song-desc-wrapper">
            <div class="song-desc">{{songDesc}}</div>
          </div>
        </div>
        <scroll class="middle-lyric" :data="currentLyric && currentLyric.lines" ref="lyricScroll">
          <div>
            <div class="lyric-wrapper" v-if="currentLyric">
              <p class="lyric" :class="{'current': currentLineNum === index}" v-for="(item,index) in currentLyric.lines" :key="index" ref="lyricLine">{{item.txt}}</p>
            </div>
          </div>
        </scroll>
      </div>
      <!-- 底部布局 -->
      <div class="bottom">
        <div class="dot-wrapper">
          <div class="dot" :class="{'active': currentDot === 'cd'}"></div>
          <div class="dot" :class="{'active': currentDot === 'lyric'}"></div>
        </div>
        <div class="progress-wrapper">
          <span class="play-time">{{playTime}}</span>
          <div class="progress-bar-wrapper">
            <progressBar :precent="precent" @changePrecent="changePrecent" @changePrecentInTouchMove="changePrecentInTouchMove"></progressBar>
          </div>
          <span class="total-time">{{totalTime}}</span>
        </div>
        <div class="operators-wrapper">
          <div class="icon-wrapper" @click="togglePlayMode">
            <i :class="playModeIcon"></i>
          </div>
          <div class="icon-wrapper" @click="goPrevSong" :class="disabledClass">
            <i class="icon-prev"></i>
          </div>
          <div class="icon-wrapper" @click="togglePlayState" :class="disabledClass">
            <i :class="playIcon" ></i>
          </div>
          <div class="icon-wrapper" @click="goNextSong" :class="disabledClass">
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
        <h1 class="mini-song-name" v-html="currentSong.name"></h1>
        <p class="mini-singer-name" v-html="currentSong.singer"></p>
      </div>
      <div class="mini-operator-wrapper" @click.stop="togglePlayState">
        <progressCircle :precent="precent" :radius="radius">
          <i :class="miniPlayIcon" class="icon-mini-play"></i>
        </progressCircle>
      </div>
      <div class="mini-operator-wrapper">
        <i class="icon-playlist"></i>
      </div>
    </div>
  </transition>
  <audio :src="currentSong.url" ref="audio" @canplay="songPlay" @error="songError" @timeupdate="updateTime" @ended='songEnd'></audio>
</div>
</template>

<script type="text/ecmascript-6">
// 引入vuex的语法糖
import { mapGetters, mapMutations } from 'vuex';
import animations from 'create-keyframe-animation';
import { domUtil } from 'common/js/domUtil';
import { util } from 'common/js/util';
import ProgressBar from 'base/progress-bar/progress-bar';
import ProgressCircle from 'base/progress-circle/progress-circle';
import Scroll from 'base/scroll/scroll';
import { playMode } from 'common/js/config';
import LyricParse from 'lyric-parser';

export default {
  name: 'player',
  data() {
    return {
      songReady: false,
      /**
       * 歌曲播放进度
       */
      currentTime: 0,
      /**
       * 迷你播放器圆形进度条半径
       */
      radius: 32,
      /**
       * 当前歌词对象
       */
      currentLyric: null,
      /**
       * 歌词当前行
       */
      currentLineNum: 0,
      /**
       * 当前显示页面
       */
      currentDot: 'cd',
      /**
       * 定义保存滑动数据的对象
       */
      touch: {}
    };
  },
  computed: {
    /**
     * 歌曲进度所占百分比
     */
    precent() {
      return this.currentTime / this.currentSong.duration;
    },

    /**
     * 歌曲进度时间
     */
    playTime() {
      return util.formatTime(this.currentTime);
    },

    /**
     * 歌曲总时间
     */
    totalTime() {
      return util.formatTime(this.currentSong.duration);
    },
    disabledClass() {
      return this.songReady ? '' : 'disable';
    },

    /**
     * 控制cd旋转动画
     */
    cdRotate() {
      return this.playState ? 'play' : 'play pause';
    },

    /**
     * 歌曲描述
     */
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
     * 播放模式按钮样式
     */
    playModeIcon() {
      let classStr = '';
      if (this.playMode === playMode.sequence) {
        classStr = 'icon-sequence';
      } else if (this.playMode === playMode.loop) {
        classStr = 'icon-loop';
      } else {
        classStr = 'icon-random';
      }
      return classStr;
    },

    /**
     * 迷你播放器播放按钮展示
     */
    miniPlayIcon() {
      return this.playState ? 'icon-pause-mini' : 'icon-play-mini';
    },
    ...mapGetters(['playList', 'fullScreen', 'currentSong', 'playState', 'currentIndex', 'playMode', 'sequenceList'])
  },
  methods: {
    /**
     * 过渡动画开始进入时执行的操作
     * @param  {Object} el   执行动画的Dom
     * @param  {Function} done 回调函数执行下一阶段
     */
    enter(el, done) {
      const { x, y, scale } = this._getPosAndScale();

      // 设置动画效果
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: 'translate3d(0, 0, 0) scale(1.1)'
        },
        100: {
          transform: 'translate3d(0, 0, 0) scale(1)'
        }
      };

      // 注册动画
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      });

      // 执行动画
      animations.runAnimation(this.$refs.cd, 'move', done);
    },

    /**
     * 过渡动画进入结束时执行的操作
     */
    afterEnter() {
      // 取消动画
      animations.unregisterAnimation('move');
      domUtil.setCss(this.$refs.cd, 'transform', '');
    },

    /**
     * 过渡动画开始离开时执行的操作
     * @param  {Object} el   执行动画的Dom
     * @param  {Function} done 回调函数执行下一阶段
     */
    leave(el, done) {
      const cdDom = this.$refs.cd;

      // 获取移动距离和缩放比例
      const { x, y, scale } = this._getPosAndScale();
      domUtil.setCss(cdDom, 'transition', 'all 0.4s');
      domUtil.setCss(cdDom, 'transform', `translate3d(${x}px, ${y}px, 0) scale(${scale})`);

      // 监听过渡结束
      cdDom.addEventListener('transitionend', done);
    },

    /**
     * 过渡动画离开结束时执行的操作
     */
    afterLeave() {
      const cdDom = this.$refs.cd;
      domUtil.setCss(cdDom, 'transition', '');
      domUtil.setCss(cdDom, 'transform', '');
    },

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
      if (!this.songReady) {
        return;
      }
      this.setPlayState(!this.playState);
    },

    /**
     * 歌曲后退
     */
    goPrevSong() {
      if (this.songReady) {
        let index = this.currentIndex - 1;

        // 边界判断
        if (index === -1) {
          index = this.playList.length - 1;
        }

        this.setCurrentIndex(index);

        if (!this.playState) {
          this.togglePlayState();
        }

        this.songReady = false;
      }
    },

    /**
     * 歌曲前进
     */
    goNextSong() {
      if (this.songReady) {
        let index = this.currentIndex + 1;

        // 边界判断
        if (index === this.playList.length) {
          index = 0;
        }

        this.setCurrentIndex(index);

        if (!this.playState) {
          this.togglePlayState();
        }

        this.songReady = false;
      }
    },

    /**
     * 歌曲能播放
     */
    songPlay() {
      this.songReady = true;
    },

    /**
     * 歌曲播放加载出错
     */
    songError() {
      this.songReady = true;
    },

    /**
     * 歌曲进度监听
     * @param  {Object} e 事件对象
     */
    updateTime(e) {
      this.currentTime = e.target.currentTime;
    },

    /**
     * 拖动或点击结束改变歌曲进度
     * @param  {Number} precent 进度百分比
     */
    changePrecent(precent) {
      this.$refs.audio.currentTime = this.currentSong.duration * precent;
    },

    /**
     * 拖动滚动条的过程中只改变歌曲进度时间，但不改变歌曲进度
     * @param  {Number} precent 进度百分比
     */
    changePrecentInTouchMove(precent) {
      this.currentTime = this.currentSong.duration * precent;
    },

    /**
     * 点击切换播放模式
     */
    togglePlayMode() {
      // 修改播放模式
      let changeMode = (this.playMode + 1) % 3;

      // 同步到vuex
      this.setPlayMode(changeMode);

      // 随机播放，打乱播放列表
      if (changeMode === playMode.random) {
        let playList = util.randomArray(this.sequenceList);

        // 找出当前这首歌的索引
        let currentIndex = playList.findIndex(item => {
          return item.id === this.currentSong.id;
        });

        // 同步当前索引和播放列表
        this.setPlayList(playList);
        this.setCurrentIndex(currentIndex);
      } else {
        // 找出当前这首歌的索引
        let currentIndex = this.sequenceList.findIndex(item => {
          return item.id === this.currentSong.id;
        });

        // 同步当前索引和播放列表
        this.setPlayList(this.sequenceList);
        this.setCurrentIndex(currentIndex);
      }
    },

    /**
     * 监听歌曲播放完毕事件
     */
    songEnd() {
      // 判断是不是单曲循环
      if (this.playMode === playMode.loop) {
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play();
      } else {
        this.goNextSong();
      }
    },

    /**
     * 获取歌词
     */
    getLyric() {
      this.currentSong.getLyric().then(data => {
        this.currentLyric = new LyricParse(data, this.handleLyric);
        if (this.playState) {
          this.currentLyric.play();
        }
      });
    },

    handleLyric({ lineNum, txt }) {
      if (this.$refs.lyricLine) {
        this.currentLineNum = lineNum;

        // 高亮歌词保持在中间
        if (lineNum > 5) {
          let el = this.$refs.lyricLine[lineNum - 5];
          this.$refs.lyricScroll.scrollToElement(el, 1000);
        } else {
          this.$refs.lyricScroll.scrollTo(0, 0, 1000);
        }
      }
    },

    /**
     * 监听页面滑动开始
     * @param  {Object} e event对象
     */
    moveTouchStart(e) {
      // 记录一些初始值
      this.touch.init = true;
      this.touch.startX = e.touches[0].pageX;
      this.touch.startY = e.touches[0].pageY;
    },

    /**
     * 监听页面滑动中
     * @param  {Object} e event对象
     */
    moveTouching(e) {
      if (this.touch.init) {
        let fingerTouch = e.touches[0];

        // 获取滑动的距离
        let moveX = fingerTouch.pageX - this.touch.startX;
        let moveY = fingerTouch.pageY - this.touch.startY;

        // 由于歌词是上下滚动，所以X轴移动的距离要比Y轴移动的距离大才行
        if (Math.abs(moveY) > Math.abs(moveX)) {
          return;
        }

        // 记录歌词页面最左侧的位置
        let leftBegin = 0;
        let windowWidth = window.innerWidth;
        if (this.currentDot === 'lyric') {
          leftBegin = -windowWidth;
        }

        // 计算偏移宽度
        let offsetWidth = leftBegin + moveX;
        if (offsetWidth > 0) {
          offsetWidth = 0;
        } else if (offsetWidth < -windowWidth) {
          offsetWidth = -windowWidth;
        }

        this.touch.precent = Math.abs(offsetWidth) / windowWidth;

        // 设置动画
        domUtil.setCss(this.$refs.lyricScroll.$el, 'transform', `translate3d(${offsetWidth}px, 0, 0)`);
        domUtil.setCss(this.$refs.lyricScroll.$el, 'transitionDuration', 0);
        domUtil.setCss(this.$refs.cdWrapper, 'opacity', 1 - this.touch.precent);
        domUtil.setCss(this.$refs.cdWrapper, 'transitionDuration', 0);
      }
    },

    /**
     * 页面滑动结束
     */
    moveTouchEnd() {
      let precent = this.touch.precent;
      let offsetWidth;
      let windowWidth = window.innerWidth;
      let opacity;

      // 当前页是cd页面，计算偏移距离和透明度
      if (this.currentDot === 'cd') {
        if (precent > 0.1) {
          offsetWidth = -windowWidth;
          this.currentDot = 'lyric';
          opacity = 0;
        } else {
          offsetWidth = 0;
          opacity = 1;
        }
      } else {
        // 当前页是歌词页面，计算偏移距离和透明度
        if (precent < 0.9) {
          offsetWidth = 0;
          this.currentDot = 'cd';
          opacity = 1;
        } else {
          offsetWidth = -windowWidth;
          opacity = 0;
        }
      }

      // 设置动画
      domUtil.setCss(this.$refs.lyricScroll.$el, 'transform', `translate3d(${offsetWidth}px, 0, 0)`);
      domUtil.setCss(this.$refs.lyricScroll.$el, 'transitionDuration', 400);
      domUtil.setCss(this.$refs.cdWrapper, 'opacity', opacity);
      domUtil.setCss(this.$refs.cdWrapper, 'transitionDuration', 400);
    },

    /**
     * 获取位置和缩放比例
     * @return {Object} 带有位置和缩放比例的对象
     */
    _getPosAndScale() {
      // 获得相应的页面边距
      const paddingLeft = 40;
      const paddingBottom = 30;
      const paddingTop = 80;

      // 获取大CD的宽度
      const cdWidth = window.innerWidth * 0.8;
      const miniCdWidth = 40;

      // 计算X轴的移动距离（X轴为负）
      const x = -(window.innerWidth / 2 - paddingLeft);

      // 计算Y轴的移动距离
      const y = window.innerHeight - paddingTop - paddingBottom - cdWidth / 2;

      // 计算缩放比例
      const scale = miniCdWidth / cdWidth;

      return { x, y, scale };
    },

    /**
     * vuex提供的存数据的语法糖，映射mutations里的方法
     */
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayState: 'SET_PLAY_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayList: 'SET_PLAY_LIST',
      setPlayMode: 'SET_PLAY_MODE'
    })
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!oldSong || newSong.id !== oldSong.id) {
        this.$nextTick(() => {
          this.$refs.audio.play();
          this.getLyric();
        });
      }
    },
    playState(newState) {
      this.$nextTick(() => {
        let audio = this.$refs.audio;
        if (newState) {
          audio.play();
        } else {
          audio.pause();
        }
      });
    }
  },
  components: {
    ProgressBar,
    ProgressCircle,
    Scroll
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

    .middle-cd {
      display: inline-block;
      vertical-align: middle;
      width: 100%;
      height: 100%;
      overflow: hidden;
      .cd {
        width: 100%;
        text-align: center;

        img {
          width: 80%;
          height: 80%;
          border-radius: 50%;
          box-sizing: border-box;
          border: 10px solid rgba(255, 255, 255, 0.1);

          // cd旋转动画
          &.play {
            animation: rotate 20s linear infinite;
          }

          &.pause {
            animation-play-state: paused;
          }
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

    .middle-lyric {
      display: inline-block;
      vertical-align: middle;
      width: 100%;
      height: 100%;
      overflow: hidden;

      .lyric-wrapper {
        width: 80%;
        height: 100%;
        margin: 0 auto;
        text-align: center;

        .lyric {
          line-height: 32px;
          font-size: @font-size-medium;
          color: @color-text-l;

          &.current {
            color: @color-text;
          }
        }
      }
    }
  }

  .bottom {
    position: absolute;
    bottom: 50px;
    width: 100%;

    .dot-wrapper {
      font-size: 0;
      text-align: center;
      .dot {
        display: inline-block;
        vertical-align: top;
        width: 10px;
        height: 10px;
        margin: 0 4px;
        border-radius: 50%;
        background-color: @color-text-l;

        &.active {
          width: 20px;
          border-radius: 5px;
          background-color: @color-text-ll;
        }
      }
    }
    .progress-wrapper {
      display: flex;
      align-items: center;
      width: 80%;
      margin: 0 auto;
      padding: 10px 0;

      .play-time {
        flex: 0 0 30px;
        width: 30px;
        line-height: 30px;
        text-align: left;
        color: @color-text;
        font-size: @font-size-small;
      }

      .progress-bar-wrapper {
        flex: 1;
      }

      .total-time {
        flex: 0 0 30px;
        width: 30px;
        line-height: 30px;
        text-align: right;
        color: @color-text;
        font-size: @font-size-small;
      }
    }

    .operators-wrapper {
      display: flex;
      align-items: center;
      justify-content: space-around;

      .icon-wrapper {
        color: @color-theme;
        font-size: 30px;
        padding: 10px;

        &.disable {
          color: @color-theme-d;
        }

        .icon-play {
          font-size: 40px;
        }

        .icon-pause {
          font-size: 40px;
        }
      }
    }
  }
  &.normal-enter-active,
  &.normal-leave-active {
    transition: all 0.4s linear;
    .top,
    .bottom {
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }
  }
  &.normal-enter,
  &.normal-leave-to {
    opacity: 0;
    .top {
      transform: translate3d(0, -100px, 0);
    }
    .bottom {
      transform: translate3d(0, 100px, 0);
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

    .icon-play-mini,
    .icon-pause-mini,
    .icon-playlist {
      font-size: 32px;
      color: @color-theme-d;
    }

    // 绝对定位使其脱档
    .icon-mini-play {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.4s;
  }
  &.mini-leave-to,
  &.mini-enter {
    opacity: 0;
  }
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
