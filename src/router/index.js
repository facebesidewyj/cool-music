import Vue from 'vue';
import Router from 'vue-router';
import Rank from 'components/rank/rank';
import Recommend from 'components/recommend/recommend';
import Search from 'components/search/search';
import Singer from 'components/singer/singer';

Vue.use(Router);

export default new Router({
  routes: [{
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend
    },
    {
      path: '/rank',
      component: Rank
    },
    {
      path: '/singer',
      component: Singer
    },
    {
      path: '/search',
      component: Search
    }
  ]
});
