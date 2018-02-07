<template>
<div class="progress-bar" ref="progressBar" @click="progressClick">
  <div class="bar-inner">
    <div class="progress" ref="progress"></div>
    <div class="progress-btn-wrapper" ref="progressBtn" @touchstart.prevent="touchStart" @touchmove.prevent="touchMove" @touchend="touchEnd">
      <div class="progress-btn"></div>
    </div>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import { domUtil } from 'common/js/domUtil';

/**
 * 定义小球按钮宽度
 */
const progressBtnWidth = 16;

export default {
  name: 'progress-bar',
  props: {
    precent: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      // 触摸事件共享数据对象
      touch: {},
      dragFlag: false
    };
  },
  methods: {
    /**
     * 触摸开始
     * @param  {Object} e event对象
     */
    touchStart(e) {
      this.dragFlag = true;
      this.touch.init = true;

      // 设置起始距离
      this.touch.startX = e.touches[0].pageX;

      // 获取进度条宽度
      this.touch.progressWidth = this.$refs.progress.clientWidth;
    },

    /**
     * 触摸移动
     * @param  {Object} e event对象
     */
    touchMove(e) {
      if (this.touch.init) {
        // 获得移动距离
        let distance = e.touches[0].pageX - this.touch.startX;

        // 设置进度条总长度
        let totalWidth = this.touch.progressWidth + distance;

        // 获取组件总长度
        let progressBarWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;

        // 边界判断
        if (totalWidth < 0) {
          totalWidth = 0;
        } else if (totalWidth > progressBarWidth) {
          totalWidth = progressBarWidth;
        }

        // 设置进度条样式
        this._setWidth(totalWidth);
        this.$emit('changePrecentInTouchMove', this._getPrecent());
      }
    },

    /**
     * 触摸结束
     */
    touchEnd() {
      this.touch.init = false;
      this.$emit('changePrecent', this._getPrecent());
    },

    /**
     * 监听点击事件
     * @param  {Object} e event对象
     */
    progressClick(e) {
      // 获取进度条在页面中的位置坐标
      let rect = this.$refs.progressBar.getBoundingClientRect();

      // 计算点击距离
      let progressWidth = e.pageX - rect.left;

      this._setWidth(progressWidth);
      this.$emit('changePrecent', this._getPrecent());
    },

    /**
     * 计算拖动之后的百分比
     * @return {[type]} [description]
     */
    _getPrecent() {
      return (this.$refs.progress.clientWidth + progressBtnWidth) / this.$refs.progressBar.clientWidth;
    },

    /**
     * 设置进度条宽度和小球移动距离
     * @param {Number} width 宽度
     */
    _setWidth(width) {
      domUtil.setCss(this.$refs.progress, 'width', `${width}px`);
      domUtil.setCss(this.$refs.progressBtn, 'transform', `translate3d(${width}px, 0, 0)`);
    }
  },
  watch: {
    precent(newPrecent) {
      // 当歌曲进度走完，切换下一首时，这是的precent是0
      if (newPrecent >= 0 && newPrecent <= 1 && !this.touch.init) {
        // 可见宽度
        let viewWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;

        // 偏移宽度
        let offsetWidth = this.precent * viewWidth;

        // 设置进度条样式
        this._setWidth(offsetWidth);
      }
    }
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background-color: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background-color: @color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      height: 30px;
      width: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid @color-text;
        border-radius: 50%;
        background-color: @color-theme;
      }
    }
  }
}
</style>
