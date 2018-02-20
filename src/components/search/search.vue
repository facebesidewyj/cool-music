<template>
<div class="search-wrapper">
  <div class="search-input-wrapper">
    <searchInput ref="searchInput" @searchWordChange="searchWordChange"></searchInput>
  </div>
  <div class="hot-key-wrapper" v-show="!searchWord">
    <h1 class="hot-key-tittle">热门搜索</h1>
    <ul>
      <li class="hot-key" v-for="(key,index) in hotKeys" :key="index" @click="addSearchWord(key.k)">
        <span>{{key.k}}</span>
      </li>
    </ul>
  </div>
  <div class="search-result" v-show="searchWord">
    <suggest :searchWord="searchWord"></suggest>
  </div>
  <router-view></router-view>
</div>
</template>

<script type="text/ecmascript-6">
import SearchInput from 'base/search-input/search-input';
import Suggest from 'components/suggest/suggest';
import { getHotWord } from 'api/search';
import { ERR_OK } from 'api/config';

export default {
  name: 'search',
  props: [],
  data() {
    return {
      hotKeys: [],
      searchWord: ''
    };
  },
  created() {
    this._getHotWord();
  },
  methods: {
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
    }
  },
  components: {
    SearchInput,
    Suggest
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';

.search-wrapper {
  .search-input-wrapper {
    margin: 20px;
  }

  .hot-key-wrapper {
    margin: 0 20px 20px;
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

  .search-result {
    position: fixed;
    width: 100%;
    top: 178px;
    bottom: 0;
  }
}
</style>
