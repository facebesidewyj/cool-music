<template>
<transition name="show">
  <div class="play-list-wrapper" v-show="showFlag" @click="hide">
    <div class="play-list" @click.stop>
      <div class="play-list-title">
        <span class="text">播放列表</span>
        <span class="icon" @click.stop="showDialog">
          <i class="icon-clear"></i>
        </span>
      </div>
      <scroll class="play-list-song" :data="this.sequenceList" :click="true" ref="scroll">
        <ul>
          <li ref="songList" class="song-item" v-for="(song,index) in sequenceList" :key="song.id" @click="selectSong(song,index)">
            <span class="icon-left">
              <i :class="getCurrentIcon(song)"></i>
            </span>
            <span class="song-name" v-html="song.name"></span>
            <span class="icon-right" @click.stop="deleteSong(song)">
              <i class="icon-delete"></i>
            </span>
          </li>
        </ul>
      </scroll>
      <div class="play-list-close" @click.stop="hide">
        <span>关闭</span>
      </div>
    </div>
    <vDialog :text="'您确定要清空播放列表吗？'" ref="dialog" @selectSureBtn="clearPlayList" :type="'confirm'"></vDialog>
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
import { mapGetters, mapMutations, mapActions } from 'vuex';
import Scroll from 'base/scroll/scroll';
import { playMode } from 'common/js/config';
import VDialog from 'base/dialog/dialog';

export default {
  name: 'play-list',
  data() {
    return {
      showFlag: false
    };
  },
  computed: {
    ...mapGetters(['sequenceList', 'currentIndex', 'currentSong', 'playMode', 'playList'])
  },
  methods: {
    /**
     * 点击歌曲
     * @param  {Object} song 歌曲对象
     * @param  {Number} index 索引
     */
    selectSong(song, index) {
      if (this.playMode === playMode.random) {
        index = this.playList.findIndex(item => {
          return item.id === song.id;
        });
      }

      this.setCurrentIndex(index);
      this.setPlayState(true);
    },

    /**
     * 从播放列表中删除
     * @param  {Object} song 歌曲对象
     */
    deleteSong(song) {
      this.deleteSongFromPlayList(song);

      if (!this.playList.length > 0) {
        this.hide();
      }
    },

    /**
     * 显示对话框
     */
    showDialog() {
      this.$refs.dialog.show();
    },

    /**
     * 显示
     */
    show() {
      this.showFlag = true;
      setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 20);
    },

    /**
     * 隐藏
     */
    hide() {
      this.showFlag = false;
    },

    /**
     * 标记当前播放歌曲
     * @param  {Object} song 歌曲对象
     * @return {String}       css样式名称
     */
    getCurrentIcon(song) {
      if (song.id === this.currentSong.id) {
        return 'icon-play';
      }
      return '';
    },

    /**
     * 列表滚动到当前播放歌曲
     * @param  {Object} song 歌曲对象
     */
    scrollToCurrentSong(song) {
      let index = this.sequenceList.findIndex(item => {
        return item.id === song.id;
      });
      this.$refs.scroll.scrollToElement(this.$refs.songList[index], 200);
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
    }),
    ...mapActions(['clearPlayList', 'deleteSongFromPlayList'])
  },
  watch: {
    currentSong(newSong, oldSong) {
      if (!this.showFlag || newSong.id === oldSong.id) {
        return;
      }

      setTimeout(() => {
        this.scrollToCurrentSong(newSong);
      }, 20);
    }
  },
  components: {
    Scroll,
    VDialog
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';
@import '../../common/less/mixin.less';

.play-list-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background-color: @color-background-d;
  &.show-enter-active,
  &.show-leave-active {
    transition: opacity 0.3s linear;
    .play-list {
      transition: all 0.3s;
    }
  }

  &.show-enter,
  &.show-leave-to {
    opacity: 0;
    .play-list {
      transform: translate3d(0, 100%, 0);
    }
  }

  .play-list {
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 201;
    width: 100%;
    background-color: @color-highlight-background;

    .play-list-title {
      display: flex;
      align-items: center;
      padding: 20px 30px 10px 20px;
      .text {
        flex: 1;
        font-size: @font-size-medium;
        color: @color-text-l;
      }

      .icon {
        .extend-click;

        .icon-clear {
          font-size: @font-size-medium;
          color: @color-text-l;
        }
      }
    }

    .play-list-song {
      max-height: 240px;
      overflow: hidden;

      .song-item {
        display: flex;
        align-items: center;
        height: 30px;
        padding: 0 30px 0 20px;
        overflow: hidden;
        .icon-left {
          flex: 0 0 20px;
          width: 20px;
          font-size: @font-size-small;
          color: @color-theme-d;
        }

        .song-name {
          flex: 1;
          .no-wrap;
          font-size: @font-size-medium;
          color: @color-text-ll;
        }

        .icon-right {
          .extend-click;
          font-size: @font-size-small;
          color: @color-theme;
        }
      }
    }

    .play-list-close {
      background-color: @color-background;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: @color-text-l;
    }
  }
}
</style>
