<template>
<scroll class="suggest" :data="results" :pullup="true" @scrollToEnd="getMoreResult" ref="scroll">
  <ul class="suggest-list">
    <li class="suggest-item" v-for="(item,index) in results" :key="index" @click="selectItem(item)">
      <div class="icon">
        <i :class="getIcon(item)"></i>
      </div>
      <div class="name">
        <p class="text" v-html="getName(item)"></p>
      </div>
    </li>
    <loading v-if="hasMoreResult" :text="''"></loading>
  </ul>
  <div class="no-result-wrapper" v-show="noResult">
    <span>抱歉，暂无结果</span>
  </div>
</scroll>
</template>

<script type="text/ecmascript-6">
// vuex提供的语法糖
import { mapMutations, mapActions } from 'vuex';
import Scroll from 'base/scroll/scroll';
import Loading from 'base/loading/loading';
import { searchWord, formatSongs } from 'api/search';
import { ERR_OK } from 'api/config';
import Singer from 'common/js/singer';

// 声明两个常量
const perpage = 20;
const TYPE_SINGER = 'singer';

export default {
  name: 'suggest',
  props: {
    searchWord: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      page: 1,
      results: [],
      noResult: false,
      hasMoreResult: true
    };
  },
  methods: {
    /**
     * 滚动列表刷新
     */
    scrollRefresh() {
      this.$refs.scroll.refresh();
    },

    /**
     * 获取检索数据
     */
    search() {
      // 初始化一些操作
      this.page = 1;
      this.$refs.scroll.scrollTo(0, 0);
      this.hasMoreResult = true;
      searchWord(this.searchWord, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.results = this._formatResult(res.data);
          this._checkHasMoreResult(res.data);
        }
      });
    },

    /**
     * 计算图标样式
     * @param  {Object} item 歌曲或者歌手
     * @return {String}      样式名称
     */
    getIcon(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine';
      } else {
        return 'icon-music';
      }
    },

    /**
     * 获得显示的名称
     * @param  {Object} item 歌曲或者歌手
     * @return {String}      名称
     */
    getName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return item.name;
      }
    },

    /**
     * 加载更多搜索结果
     * @return {[type]} [description]
     */
    getMoreResult() {
      if (!this.hasMoreResult) {
        return;
      }
      this.page++;
      searchWord(this.searchWord, this.page, this.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          let list = this._formatResult(res.data);
          this.results = this.results.concat(list);
          this._checkHasMoreResult(res.data);
        }
      });
    },

    /**
     * 点击事件
     * @param  {Object} item 歌曲或歌手
     */
    selectItem(item) {
      // 判断点击的列表类型
      if (item.type === TYPE_SINGER) {
        let singer = new Singer({
          id: item.singermid,
          name: item.singername
        });

        this.$router.push({
          path: `/singer/${singer.id}`
        });
        this.setSinger(singer);
      } else {
        this.insertNewSong(item);
      }
      this.$emit('saveSearchHistory');
    },

    /**
     * 检查是否还能加载到更多
     * @param  {Object} data 歌手或歌曲数据
     */
    _checkHasMoreResult(data) {
      const song = data.song;
      if (!song.list.length || song.curnum + song.curpage * perpage > song.totalnum) {
        this.hasMoreResult = false;
      } else {
        this.hasMoreResult = true;
      }
    },

    /**
     * 格式化搜索结果
     * @param  {Object} data 搜索结果
     * @return {Array}      用于展示的数组
     */
    _formatResult(data) {
      let res = [];

      if (data.zhida && data.zhida.singerid) {
        res.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }

      if (data.song) {
        res = res.concat(formatSongs(data.song.list));
      }

      return res;
    },

    /**
     * vuex提供的存数据的语法糖，映射mutations里的方法
     * @type {String}
     */
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions(['insertNewSong'])
  },
  watch: {
    searchWord(newVal) {
      this.search();
    },
    results(newResults) {
      if (newResults.length === 0) {
        this.noResult = true;
      } else {
        this.noResult = false;
      }
    }
  },
  components: {
    Scroll,
    Loading
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';
@import '../../common/less/mixin.less';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;

      .icon {
        flex: 0 0 30px;
        width: 30px;
        font-size: 14px;
        color: @color-text-d;
      }

      .name {
        flex: 1;
        font-size: @font-size-medium;
        color: @color-text-d;
        overflow: hidden;
        .text {
          .no-wrap;
        }
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
    text-align: center;
    color: @color-text-l;
    font-size: @font-size-medium;
  }
}
</style>
