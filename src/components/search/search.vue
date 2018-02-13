<template>
<div class="search-wrapper">
  <div class="search-input-wrapper">
    <searchInput ref="searchInput"></searchInput>
  </div>
  <div class="hot-key-wrapper">
    <h1 class="hot-key-tittle">热门搜索</h1>
    <ul>
      <li class="hot-key" v-for="(key,index) in hotKeys" :key="index" @click="addSearchWord(key.k)">
        <span>{{key.k}}</span>
      </li>
    </ul>
  </div>
</div>
</template>

<script type="text/ecmascript-6">
import SearchInput from 'base/search-input/search-input';
import { getHotWord } from 'api/search';
import { ERR_OK } from 'api/config';

export default {
  name: 'search',
  props: [],
  data() {
    return {
      hotKeys: []
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
      this.$refs.searchInput.setSearchWord(word);
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
    SearchInput
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
}
</style>
