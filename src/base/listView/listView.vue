<template>
<scroll class="listView-wrapper" :data="data" ref="scroll" :listenScroll="true" @scroll="scroll" :probeType="3">
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
  <div class="word-index-wrapper" @touchstart="scrollToListGroup" @touchmove.stop.prevent="touchMoveScroll">
    <ul>
      <li v-for="(item, index) in wordIndexList" :key="index" class="word-index" :data-index="index" :class="{active:targetIndex === index}">
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
      touchScroll: {},
      scrollY: -1,
      targetIndex: 0,
      heightList: []
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
     * 点击字母索引，滚动到指定分组
     */
    scrollToListGroup(event) {
      // 获得索引
      let index = domUtil.attr(event.target, 'data-index');

      // 记录起始索引和起始位置
      this.touchScroll.startIndex = index;
      this.touchScroll.startPageY = event.touches[0].pageY;

      this._scrollToElement(index);
    },

    /**
     * 手指在索引上滑动，滚动到对应分组
     */
    touchMoveScroll(event) {
      // 获得滑动距离
      let startPageY = this.touchScroll.startPageY;
      let endPageY = event.touches[0].pageY;
      let distance = endPageY - startPageY;

      // 根据距离获得目标索引（起始索引+滚动索引）
      let startIndex = this.touchScroll.startIndex;
      let scrollIndex = Math.ceil(distance / WORD_INDEX_LENGTH);
      let targetIndex = parseInt(startIndex) + scrollIndex;

      // 根据索引滚动到对应分组
      this._scrollToElement(targetIndex);
    },

    /**
     * 监听scroll组件中的scroll事件
     * @param  {Object} pos 滚动位置坐标
     */
    scroll(pos) {
      this.scrollY = -pos.y;
    },

    /**
     * 私有函数，根据索引跳转到对应分组
     * @param  {Number} index 索引
     */
    _scrollToElement(index) {
      if (index) {
        // 索引边界判断
        if (index < 0) {
          index = 0;
        } else if (index > this.wordIndexList.length - 1) {
          index = this.wordIndexList.length - 1;
        }
        this.$refs.scroll.scrollToElement(this.$refs.listGroup[index], 0);
      }
    },
    /**
     * 私有函数，计算分组数据的高度
     */
    _computeHeight() {
      let listGroup = this.$refs.listGroup;
      let height = 0;

      // 构造高度区间
      this.heightList.push(height);
      for (let i = 0; i < listGroup.length; i++) {
        let item = listGroup[i];
        height += item.clientHeight;
        this.heightList.push(height);
      }
    }
  },
  watch: {
    /**
     * 监听data变化，计算高度
     */
    data() {
      setTimeout(() => {
        this._computeHeight();
      }, 20);
    },
    scrollY(newScrollY) {
      // 滚动到顶部
      if (newScrollY < 0) {
        this.targetIndex = 0;
      }

      // 在中间滚动
      for (let i = 0; i < this.heightList.length - 1; i++) {
        let startHeight = this.heightList[i];
        let endHeight = this.heightList[i + 1];
        if (newScrollY >= startHeight && newScrollY <= endHeight) {
          this.targetIndex = i;
          return;
        }
      }

      // 滚动到底部
      this.targetIndex = this.heightList.length - 2;
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
