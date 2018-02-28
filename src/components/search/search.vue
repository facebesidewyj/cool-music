<template>
<div class="search-wrapper">
  <div class="search-input-wrapper">
    <searchInput ref="searchInput" @searchWordChange="searchWordChange"></searchInput>
  </div>
  <div class="middle-content-wrapper" v-show="!searchWord" ref="middleWrapper">
    <scroll :data="searchAllData" :click="true" ref="scrollWrapper" class="middle-content">
      <div>
        <div class="hot-key-wrapper">
          <h1 class="hot-key-tittle">热门搜索</h1>
          <ul>
            <li class="hot-key" v-for="(key,index) in hotKeys" :key="index" @click="addSearchWord(key.k)">
              <span>{{key.k}}</span>
            </li>
          </ul>
        </div>
        <div class="search-history-wrapper" v-show="searchHistory.length > 0">
          <div class="title">
            <span class="title-text">搜索历史</span>
            <span class="title-icon" @click="showDialog">
              <i class="icon-clear"></i>
            </span>
          </div>
          <historyList :historyArray="searchHistory" @selectItem="selectHistoryItem" @deleteItem="deletetHistoryItem"></historyList>
        </div>
      </div>
    </scroll>
  </div>
  <div class="search-result" v-show="searchWord" ref="searchResult">
    <suggest :searchWord="searchWord" @saveSearchHistory="saveSearchHistory" ref="suggest"></suggest>
  </div>
  <vDialog :text="'您确定要清空搜索历史吗？'" ref="dialog" @selectSureBtn="clearHistory" :type="'confirm'"></vDialog>
  <topTip :delay="1000" :type="0" :text="'删除成功'" ref="topTip"></topTip>
  <router-view></router-view>
</div>
</template>

<script type="text/ecmascript-6">
import { mapActions, mapGetters } from 'vuex';
import SearchInput from 'base/search-input/search-input';
import HistoryList from 'base/history-list/history-list';
import VDialog from 'base/dialog/dialog';
import Scroll from 'base/scroll/scroll';
import Suggest from 'components/suggest/suggest';
import { getHotWord } from 'api/search';
import { ERR_OK } from 'api/config';
import { domUtil } from 'common/js/domUtil';
import { playListMixin } from 'common/js/mixin';
import TopTip from 'base/top-tip/top-tip';

export default {
  name: 'search',
  props: [],
  mixins: [playListMixin],
  data() {
    return {
      hotKeys: [],
      searchWord: ''
    };
  },
  computed: {
    searchAllData() {
      return this.hotKeys.concat(this.searchHistory);
    },
    ...mapGetters(['searchHistory'])
  },
  created() {
    this._getHotWord();
  },
  methods: {
    /**
     * 覆盖mixin中的方法
     */
    handlePlayList(playList) {
      let bottom = '';
      if (playList.length > 0) {
        bottom = '60px';
      }
      domUtil.setCss(this.$refs.middleWrapper, 'bottom', bottom);
      domUtil.setCss(this.$refs.searchResult, 'bottom', bottom);
      this.$refs.scrollWrapper.refresh();
      this.$refs.suggest.scrollRefresh();
    },

    /**
     * 显示提示框
     */
    showDialog() {
      this.$refs.dialog.show();
    },

    /**
     * 点击检索历史进行检索
     * @param  {String} searchWord 检索词
     */
    selectHistoryItem(searchWord) {
      this.addSearchWord(searchWord);
    },

    /**
     * 删除历史记录
     * @param  {String} item l检索词
     */
    deletetHistoryItem(item) {
      this.$refs.topTip.show();
      this.deleteHistory(item);
    },

    /**
     * 点击热门搜索改变检索词
     * @param {String} word 检索词
     */
    addSearchWord(word) {
      this.$refs.searchInput.setSearchWord(word.trim());
    },

    /**
     * 监听检索词变化
     * @param  {String} newWord 检索词
     */
    searchWordChange(newWord) {
      this.searchWord = newWord;

      // 检索词变化，刷新scroll
      setTimeout(() => {
        this.$refs.scrollWrapper.refresh();
      }, 20);
    },

    /**
     * 保存搜索历史
     */
    saveSearchHistory() {
      this.saveHistory(this.searchWord);
    },

    /**
     * 获取检索热词
     */
    _getHotWord() {
      getHotWord().then(res => {
        if (res.code === ERR_OK) {
          this.hotKeys = res.data.hotkey.slice(0, 10);
        }
      });
    },
    ...mapActions(['saveHistory', 'deleteHistory', 'clearHistory'])
  },
  components: {
    SearchInput,
    Suggest,
    HistoryList,
    Scroll,
    VDialog,
    TopTip
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';
@import '../../common/less/mixin.less';

.search-wrapper {
  .search-input-wrapper {
    margin: 20px;
  }

  .middle-content-wrapper {
    position: fixed;
    top: 178px;
    left: 0;
    bottom: 0;
    width: 100%;

    .middle-content {
      overflow: hidden;
      height: 100%;

      .hot-key-wrapper {
        margin: 0 20px 10px;
        font-size: 0;

        .hot-key-tittle {
          margin-bottom: 20px;
          color: @color-text-ll;
          font-size: @font-size-medium;
        }

        .hot-key {
          display: inline-block;
          vertical-align: top;
          padding: 5px 10px;
          margin: 0 20px 10px 0;
          border: 1px solid @color-text-l;
          border-radius: 6px;
          font-size: @font-size-medium;
          color: @color-text-l;
        }
      }

      .search-history-wrapper {
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 30px;
          font-size: @font-size-medium;
          color: @color-text-ll;

          .title-text {
            flex: 1;
          }

          .title-icon {
            .extend-click;
          }
        }
      }
    }
  }

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>
