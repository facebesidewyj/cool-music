<template>
<scroll class="listView-wrapper" :data="data" ref="scroll">
  <ul>
    <li class="listView-group" v-for="(singerGroup, index) in data" :key="index" ref="listGroup">
      <h2 class="title">{{singerGroup.title}}</h2>
      <ul>
        <li class="listView-item" v-for="(singer, index) in singerGroup.data" :key="index">
          <img v-lazy="singer.avatar" alt="userImage">
          <span class="name">{{singer.name}}</span>
        </li>
      </ul>
    </li>
  </ul>
  <div class="word-index-wrapper" @touchstart="jumpToListGroup" @touchmove.stop.prevent="scrollToListGroup">
    <ul>
      <li v-for="(item, index) in wordIndexList" :key="index" class="word-index" :data-index="index">
        {{item}}
      </li>
    </ul>
  </div>
</scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll';
import { domUtil } from 'common/js/domUtil';

const WORD_INDEX_LENGTH = 18;

export default {
  name: 'listView',
  props: {
    data: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      touchScroll: {}
    };
  },
  computed: {
    /**
     * 计算属性，计算显示的字母索引
     */
    wordIndexList() {
      return this.data.map((item, index) => {
        return item.title.slice(0, 1);
      });
    }
  },
  methods: {
    /**
     * 点击字母索引滚动到指定分组列表
     */
    jumpToListGroup(event) {
      // 获取点击元素的索引值
      let index = parseInt(domUtil.attr(event.target, 'data-index'));

      // 设置一个对象记录起始索引和开始位置
      this.touchScroll.startIndex = index;
      this.touchScroll.startPageY = event.touches[0].pageY;

      // 滚动到目标元素
      this._scrollToElement(index);
    },

    /**
     * 分组列表跟随字母索引滑动
     */
    scrollToListGroup(event) {
      // 获取Y轴滚动的起始位置和结束位置
      let endPageY = event.touches[0].pageY;
      let startPageY = this.touchScroll.startPageY;

      // 计算滚动了几个索引值
      let scrollIndex = Math.ceil((endPageY - startPageY) / WORD_INDEX_LENGTH);

      // 计算结束索引（起始索引+滚动索引）
      let endIndex = this.touchScroll.startIndex + scrollIndex;

      // 滚动到目标元素
      this._scrollToElement(endIndex);
    },

    /**
     * 私有方法，滚到到目标元素
     */
    _scrollToElement(index) {
      if (!index) {
        return;
      }

      // 边界判断
      if (index < 0) {
        index = 0;
      } else if (index > this.wordIndexList.length - 1) {
        index = this.wordIndexList.length - 1;
      }

      this.$refs.scroll.scrollToElement(this.$refs.listGroup[index], 0);
    }
  },
  components: {
    Scroll
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';
.listView-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: @color-background;
  .listView-group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: @font-size-small;
      color: @color-text-l;
      background-color: @color-highlight-background;
    }
    .listView-item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      img {
        flex: 0 0 50px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .name {
        flex: 1;
        margin-left: 20px;
        color: @color-text-l;
        font-size: @font-size-medium;
      }
    }
  }
  .word-index-wrapper {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    z-index: 30;
    width: 22px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background-color: @color-background-d;
    font-family: Helvetica;
    .word-index {
      padding: 3px;
      line-height: 1;
      color: @color-text-l;
      font-size: @font-size-small;
      &.active {
        color: @color-theme;
      }
    }
  }
}
</style>
