<template>
<div class="history-list">
  <!-- 给列表删除增加动画 -->
  <transition-group name="show" tag="ul">
    <li class="history-item" v-for="(item,index) in historyArray" :key="index" @click="selectItem(item)">
      <span class="text">{{item}}</span>
      <span class="icon" @click.stop="deleteItem(item)">
        <i class="icon-delete"></i>
      </span>
    </li>
  </transition-group>
</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'history-list',
  props: {
    /**
     * 搜索历史列表
     */
    historyArray: {
      type: Array,
      default: null
    }
  },
  methods: {
    /**
     * 派发点击事件
     * @param  {String} item 检索词
     */
    selectItem(searchWord) {
      this.$emit('selectItem', searchWord);
    },

    /**
     * 派发删除事件
     * @param  {String} item 检索词
     */
    deleteItem(searchWord) {
      this.$emit('deleteItem', searchWord);
    }
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';
@import '../../common/less/mixin.less';

.history-list {
  .history-item {
    display: flex;
    align-items: center;
    height: 40px;
    overflow: hidden;
    font-size: @font-size-medium;
    color: @color-text-l;

    &.show-enter-active,
    &.show-leave-active {
      transition: all 0.1s linear;
    }

    &.show-enter,
    &.show-leave-to {
      height: 0;
    }

    .text {
      flex: 1;
    }

    .icon {
      .extend-click;
    }
  }
}
</style>
