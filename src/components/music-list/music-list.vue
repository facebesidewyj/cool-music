<template>
  <div class="music-list-wrapper">
    <div class="title-wrapper">
      <div class="icon-back-wrapper">
        <i class="icon-back" @click="back"></i>
      </div>
      <h1 class="title" v-html="singerName"></h1>
    </div>
    <div class="background-image" :style="backgroundImage" ref="bgImage">
      <div class="play-btn-wrapper" v-show="songs.length" ref="playBtn">
        <div class="play-btn" @click.stop="playAllWithRandom">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <!-- 遮罩层 -->
      <div class="image-filter" ref="filter"></div>
    </div>
    <!-- 上滑时遮住图片 -->
    <div class="image-layer" ref="layer"></div>
    <scroll :data="songs" :listenScroll="true" :probeType="3" :click="true" @scroll="scroll" class="scroll-list" ref="scrollList">
      <div class="song-list-wrapper">
        <song-list :songs="songs" @selectSong="selectSong"></song-list>
      </div>
      <div class="loading-wrapper" v-show="!songs.length">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>

<script type="text/ecmascript-6">
import SongList from 'base/song-list/song-list';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { domUtil } from 'common/js/domUtil';
import { mapActions } from 'vuex';

const TITLE_HEIGHT = 40;
const IMAGE_HEIGHT = 262;

export default {
  name: 'music-list',
  props: {
    /**
     * 歌手名
     * @type {String}
     */
    singerName: {
      type: String,
      default: ''
    },

    /**
     * 背景图
     * @type {String}
     */
    bgImage: {
      type: String,
      default: ''
    },

    /**
     * 歌曲列表
     * @type {Array}
     */
    songs: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      // Y轴滚动距离
      scrollY: 0,
      // 图片最大滚动距离
      maxImageScroll: 0
    };
  },
  computed: {
    backgroundImage() {
      return `background-image:url(${this.bgImage})`;
    }
  },
  mounted() {
    // 设置背景图最大滚动距离(露出歌手名)
    this.maxImageScroll = IMAGE_HEIGHT - TITLE_HEIGHT;
  },
  methods: {
    /**
     * 回退
     */
    back() {
      this.$router.back();
    },

    /**
     * 监听滚动，记录滚动距离
     * @param  {Object} pos 坐标对象
     */
    scroll(pos) {
      this.scrollY = -pos.y;
    },

    /**
     * 歌曲点击事件
     * @param  {Object} song  歌曲对象
     * @param  {Number} index 歌曲索引
     */
    selectSong(song, index) {
      this.selectPlay({
        list: this.songs,
        index: index
      });
    },

    /**
     * 随机播放全部
     */
    playAllWithRandom() {
      this.playRandom({
        list: this.songs
      });
    },

    ...mapActions(['selectPlay', 'playRandom'])
  },
  watch: {
    scrollY(newY) {
      // 获取频繁操作的Dom对象
      let bgImageDom = this.$refs.bgImage;

      // 列表上滑时遮住图片
      let translateY = Math.min(newY, this.maxImageScroll);
      domUtil.setCss(this.$refs.layer, 'transform', `translate3d(0, -${translateY}px, 0)`);

      let zIndex = 0;
      let blur = 0;
      let scale = 1;

      // 计算放大和模糊比例
      const precent = Math.abs(newY / IMAGE_HEIGHT);

      // 下拉时，背景图放大
      if (newY < 0) {
        scale = 1 + precent;
        zIndex = 10;
      } else {
        blur = Math.min(20, precent * 20);
      }

      domUtil.setCss(bgImageDom, 'transform', `scale(${scale})`);
      domUtil.setCss(this.$refs.filter, 'backdrop', `blur(${blur}px)`);

      // 列表上滑到最大距离，露出歌手名，修改背景图高度和z-index
      if (newY > this.maxImageScroll) {
        domUtil.setCss(bgImageDom, 'height', `${TITLE_HEIGHT}px`);
        domUtil.setCss(this.$refs.playBtn, 'display', 'none');
        zIndex = 10;
      } else {
        domUtil.setCss(bgImageDom, 'height', `${IMAGE_HEIGHT}px`);
        domUtil.setCss(this.$refs.playBtn, 'display', '');
      }
      domUtil.setCss(bgImageDom, 'zIndex', zIndex);
    }
  },
  components: {
    SongList,
    Scroll,
    Loading
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';
@import '../../common/less/mixin.less';

.music-list-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: @color-background;
  .title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 50;
    .icon-back-wrapper {
      position: absolute;
      left: 6px;
      top: 0;
      .icon-back {
        display: block;
        padding: 10px;
        font-size: @font-size-large-x;
        color: @color-theme;
      }
    }
    .title {
      width: 70%;
      margin: 0 auto;
      line-height: 40px;
      .no-wrap;
      text-align: center;
      font-size: @font-size-large;
      color: @color-text;
    }
  }
  .background-image {
    position: relative;
    width: 100%;
    height: 262px;
    // 定义Y轴起始位置
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      width: 100%;
      z-index: 50;
      .play-btn {
        width: 135px;
        box-sizing: border-box;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid @color-theme;
        border-radius: 100px;
        color: @color-theme;
        font-size: 0;
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: @font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: @font-size-small;
        }
      }
    }
    .image-filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(7, 17, 27, 0.3);
    }
  }
  .image-layer {
    position: relative;
    height: 100%;
    background-color: @color-background;
  }
  .scroll-list {
    position: absolute;
    top: 262px;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: @color-background;
    .song-list-wrapper {
      padding: 20px 30px;
    }
    .loading-wrapper {
      position: absolute;
      top: 50%;
      width: 100%;
      text-align: center;
      transform: translateY(-50%);
    }
  }
}
</style>
