<template>
<transition name="show">
  <div class="dialog-wrapper" v-show="showFlag" @click.stop>
    <div class="dialog">
      <p class="text">{{text}}</p>
      <div class="button-wrapper" v-show="type=== 'confirm'">
        <span class="left" @click="selectSureBtn">{{sure}}</span>
        <span @click="selectCancelBtn">{{cancel}}</span>
      </div>
      <div class="button-wrapper" v-show="type=== 'alert'">
        <span @click="selectCancelBtn">确定</span>
      </div>
    </div>
  </div>
</transition>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'v-dialog',
  props: {
    /**
     * 显示文本
     */
    text: {
      type: String,
      default: '警告'
    },

    /**
     * 确认按钮文本
     */
    sure: {
      type: String,
      default: '确定'
    },

    /**
     * 删除按钮文本
     */
    cancel: {
      type: String,
      default: '再想想'
    },

    /**
     * 显示类型（确认框或提示框）
     */
    type: {
      type: String,
      default: 'alert'
    }
  },
  data() {
    return {
      showFlag: false
    };
  },
  methods: {
    /**
     * 显示
     */
    show() {
      this.showFlag = true;
    },

    /**
     * 隐藏
     */
    hide() {
      this.showFlag = false;
    },

    /**
     * 点击了确认按钮
     */
    selectSureBtn() {
      this.showFlag = false;
      this.$emit('selectSureBtn');
    },

    /**
     * 点击取消按钮
     */
    selectCancelBtn() {
      this.showFlag = false;
    }
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';
@import '../../common/less/mixin.less';

.dialog-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 998;
  color: @color-background-d;

  &.show-enter-active {
    animation: dialog-fadein 0.2s linear;
  }

  .dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 270px;
    transform: translate3d(-50%, -50%, 0);
    z-index: 999;
    border-radius: 13px;
    background-color: @color-highlight-background;

    .text {
      padding: 19px 15px;
      line-height: 22px;
      text-align: center;
      font-size: @font-size-large;
      color: @color-text-ll;
    }

    .button-wrapper {
      display: flex;
      align-items: center;
      text-align: center;
      font-size: @font-size-large;

      span {
        flex: 1;
        line-height: 22px;
        padding: 10px 0;
        border-top: 1px solid @color-background-d;
        color: @color-text-l;

        &.left {
          border-right: 1px solid @color-background-d;
        }
      }
    }
  }
}

@keyframes dialog-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
