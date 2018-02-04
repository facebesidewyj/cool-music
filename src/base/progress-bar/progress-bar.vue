<template>
  <div class="progress-bar" ref="progressBar">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
import { domUtil } from 'common/js/domUtil';

  const progressBtnWidth = 16;

  export default {
    name: 'progress-bar',
    props: {
      precent: 0
    },
    data () {
      return {
      };
    },
    methods: {
    },
    watch: {
      precent(newPrecent) {
        // 可见宽度
        let viewWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;

        // 偏移宽度
        let offsetWidth = this.precent * viewWidth;

        // 设置进度条样式
        domUtil.setCss(this.$refs.progress, 'width', `${offsetWidth}px`);
        domUtil.setCss(this.$refs.progressBtn, 'transform', `translate3d(${offsetWidth}px, 0, 0)`);
      }
    }
  };
</script>
<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';

.progress-bar{
  height: 30px;

  .bar-inner{
    position: relative;
    top: 13px;
    height: 4px;
    background-color: rgba(0, 0, 0, 0.3);

    .progress{
      position: absolute;
      height: 100%;
      background-color: @color-theme;
    }

    .progress-btn-wrapper{
      position: absolute;
      left: -8px;
      top: -13px;
      height: 30px;
      width: 30px;

      .progress-btn{
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
