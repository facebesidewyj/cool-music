<template>
<scroll class="listView-wrapper" :data="data" ref="scroll" :listenScroll="true" @scroll="scroll" :probeType="3" :click="true">
  <ul>
    <li class="listView-group" v-for="(singerGroup, index) in data" :key="index" ref="listGroup">
      <h2 class="title">{{singerGroup.title}}</h2>
      <ul>
        <li class="listView-item" v-for="(singer, index) in singerGroup.data" :key="index" @click="selectSinger(singer)">
          <img v-lazy="singer.avatar" alt="userImage">
          <span class="name">{{singer.name}}</span>
        </li>
      </ul>
    </li>
  </ul>
  <div class="word-index-wrapper" @touchstart="scrollToListGroup" @touchmove.stop.prevent="touchMoveScroll" @touchend="touchEnd">
    <ul>
      <li ref="wordIndexList" v-for="(item, index) in wordIndexList" :key="index" class="word-index" :data-index="index" :class="{'active':targetIndex === index}">
        {{item}}
      </li>
    </ul>
  </div>
  <div class="word-tip" v-if="tipFlag">
    <span class="text">{{wordTip}}</span>
  </div>
  <div class="fixed-title-wrapper" v-if="fixedTitle" ref="fixedTitle">
    <h2 class="fixed-title">{{fixedTitle}}</h2>
  </div>
</scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll';
import { domUtil } from 'common/js/domUtil';

const WORD_INDEX_LENGTH = 18;
const TITLE_HEIGHT = 30;

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
      // 滚动对象，记录位置和索引
      touchScroll: {},
      // Y轴滚动距离
      scrollY: -1,
      // 索引
      targetIndex: 0,
      // 高度区间列表
      heightList: [],
      // 字母提示
      tipFlag: false,
      // 字母提示文字
      wordTip: '',
      // 分组列表title距离fixedTitle的数值
      distanceToTitle: 0,
      // 分组列表title移动到fixedTitle的距离
      moveDistance: 0
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
    },
    /**
     * 固定在顶部显示的标题
     */
    fixedTitle() {
      if (this.data[this.targetIndex]) {
        // 边界判断
        if (this.scrollY > 0) {
          return this.data[this.targetIndex].title;
        }
      }
      return '';
    }
  },
  methods: {
    /**
     * 点击字母索引，滚动到指定分组
     */
    scrollToListGroup(event) {
      // 获得索引
      let index = parseInt(domUtil.attr(event.target, 'data-index'));

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
      let targetIndex = startIndex + scrollIndex;

      this._scrollToElement(targetIndex);
    },

    /**
     * 结束触摸,关闭提示
     */
    touchEnd() {
      this.tipFlag = false;
    },

    /**
     * 监听scroll组件中的scroll事件
     * @param  {Object} pos 滚动位置坐标
     */
    scroll(pos) {
      this.scrollY = -pos.y;
    },

    /**
     * 派发点击事件
     * @param  {Object} item singer对象
     */
    selectSinger(item) {
      this.$emit('selectSinger', item);
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

        // 显示字母提示
        this.tipFlag = true;
        this.wordTip = this.$refs.wordIndexList[index].innerText;

        // 根据索引滚动到对应分组并更新索引
        this.$refs.scroll.scrollToElement(this.$refs.listGroup[index], 0);
        this.targetIndex = index;
      }
    },
    /**
     * 私有函数，计算分组数据的高度
     */
    _computeHeight() {
      let height = 0;
      let groupList = this.$refs.listGroup;

      // 计算分组高度区间
      this.heightList.push(height);
      for (let i = 0; i < groupList.length; i++) {
        let item = groupList[i];
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
      } else if (newScrollY > this.heightList[this.heightList.length - 1]) {
        // 滚动到底部
        this.targetIndex = this.heightList.length - 1;
      } else {
        // 在中间滚动
        for (let i = 0; i < this.heightList.length - 1; i++) {
          let minHeight = this.heightList[i];
          let maxHeight = this.heightList[i + 1];

          if (newScrollY >= minHeight && newScrollY <= maxHeight) {
            this.targetIndex = i;

            // 计算分组列表title和fixedTitle的距离
            this.distanceToTitle = maxHeight - newScrollY;
          }
        }
      }
    },
    distanceToTitle(newDistance) {
      let moveDistance = 0;
      if (newDistance > 0 && newDistance < TITLE_HEIGHT) {
        // 获得一个负的向上偏移量
        moveDistance = newDistance - TITLE_HEIGHT;
      } else {
        moveDistance = 0;
      }

      if (moveDistance !== this.moveDistance) {
        this.moveDistance = moveDistance;
        this.$refs.fixedTitle.style.transform = `translate3D(0, ${this.moveDistance}px, 0)`;
      }
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
  .word-tip {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    text-align: center;
    .text {
      display: inline-block;
      width: 50px;
      height: 50px;
      line-height: 50px;
      padding-right: 4px;
      border-radius: 50%;
      background-color: @color-dialog-background;
      opacity: 0.8;
      color: @color-theme;
      font-size: @font-size-large;
    }
  }
  .fixed-title-wrapper {
    position: absolute;
    top: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: @font-size-small;
      color: @color-text-l;
      background-color: @color-highlight-background;
    }
  }
}
</style>
