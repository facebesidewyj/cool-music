<template>
  <div>歌手页面</div>
</template>

<script type="text/ecmascript-6">
import { getSingers } from 'api/singer';
import { ERR_OK } from 'api/config';
import Singer from 'common/js/singer';

const HOT_NAME = '热门';
const HOT_LIST_SIZE = 10;

export default {
  name: 'singer',
  props: {},
  data() {
    return {
      singers: []
    };
  },
  created() {
    this._getSingers();
  },
  methods: {
    /**
     * 获得列表数据
     */
    _getSingers() {
      getSingers().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._formatList(res.data.list);
          console.log(this.singers);
        }
      });
    },

    /**
     * 格式化传入的数据，将数据转成通讯录需要的
     * @param  {Array} singerList 传入要格式化的数组
     * @return {Array}            格式化好的数组
     */
    _formatList(singerList) {
      // 封装一个热门歌手列表
      let hotList = [
        {
          title: HOT_NAME,
          data: []
        }
      ];

      // 封装热门歌手列表数据
      singerList.forEach((item, index) => {
        if (index < HOT_LIST_SIZE) {
          hotList[0].data.push(
            new Singer({
              id: item.Fsinger_mid,
              name: item.Fsinger_name
            })
          );
        }
      });

      // 初始化字母索引列表
      let wordArray = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

      // 初始化一个存放分类歌手数据的列表
      let dataList = [];

      // 根据首字母进行排序和分组
      for (let i = 0; i < wordArray.length; i++) {
        let model = {
          title: wordArray[i],
          data: []
        };
        for (let j = 0; j < singerList.length; j++) {
          if (wordArray[i] === singerList[j].Findex) {
            model.data.push(
              new Singer({
                id: singerList[j].Fsinger_mid,
                name: singerList[j].Fsinger_name
              })
            );
          }
        }
        dataList.push(model);
      }
      return hotList.concat(dataList);
    }
  }
};
</script>

<style type="text/css" lang="less" scoped>

</style>
