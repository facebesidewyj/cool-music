<template>
<div class="search">
  <i class="icon-search"></i>
  <input class="search-input" v-model="searchWord" :placeholder="placeholder">
  <i class="icon-dismiss" @click="clearSearchWord" v-show="searchWord"></i>
</div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'search-input',
  props: {
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data() {
    return {
      searchWord: ''
    };
  },
  created() {
    this.$watch('searchWord', newWord => {
      this.$emit('searchWordChange', newWord);
    });
  },
  methods: {
    /**
     * 点击清空检索词
     */
    clearSearchWord() {
      this.searchWord = '';
    },

    /**
     * 设置检索词
     * @param {String} searchWord 传入的检索词
     */
    setSearchWord(searchWord) {
      this.searchWord = searchWord;
    }
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import '../../common/less/variable.less';

.search {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 40px;
  background-color: @color-highlight-background;
  border-radius: 6px;

  .icon-search {
    font-size: 24px;
    color: @color-background;
  }

  .search-input {
    flex: 1;
    margin: 0 5px;
    padding: 5px 0;
    line-height: 20px;
    border: none;
    background-color: @color-highlight-background;
    color: @color-text-ll;
    font-size: @font-size-medium;
    outline: 0;
  }

  .icon-dismiss {
    font-size: 16px;
    color: @color-background;
  }
}
::-webkit-input-placeholder {
  color: @color-text-ll;
}
</style>
