import Vue from 'vue'
import Vuex from 'vuex'
import { fetchItems, fetchIdsByType, fetchUser } from './api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    activeType: null,
    itemsPerPage: 20,
    items: {/* [id: number]: Item */},
    users: {/* [id: string]: User */},
    lists: {
      top: [/* number */],
      new: [],
      show: [],
      ask: [],
      job: []
    }
  },

  actions: {
    // ensure data for rendering given list type
    // 配置type数据，获取数据
    FETCH_LIST_DATA: ({ commit, dispatch, state }, { type }) => {
      commit('SET_ACTIVE_TYPE', { type })
      // 获取type
      return fetchIdsByType(type)
        .then(ids => commit('SET_LIST', { type, ids }))
        .then(() => dispatch('ENSURE_ACTIVE_ITEMS'))
    },

    // ensure all active items are fetched
    // 刷新ids数据
    ENSURE_ACTIVE_ITEMS: ({ dispatch, getters }) => {
      return dispatch('FETCH_ITEMS', {
        ids: getters.activeIds
      })
    },

    FETCH_ITEMS: ({ commit, state }, { ids }) => {
      // on the client, the store itself serves as a cache.
      // only fetch items that we do not already have, or has expired (3 minutes)
      // 刷新ids的数据信息
      const now = Date.now()
      ids = ids.filter(id => {
        const item = state.items[id]
        if (!item) {
          return true
        }
        if (now - item.__lastUpdated > 1000 * 60 * 3) {
          return true
        }
        return false
      })
      if (ids.length) {
        // 获取ids
        return fetchItems(ids).then(items => commit('SET_ITEMS', { items }))
      } else {
        return Promise.resolve()
      }
    },

    FETCH_USER: ({ commit, state }, { id }) => {
      return state.users[id]
        ? Promise.resolve(state.users[id])
        // 获取user
        : fetchUser(id).then(user => commit('SET_USER', { user }))
    }
  },

  mutations: {
    SET_ACTIVE_TYPE: (state, { type }) => {
      state.activeType = type
    },

    SET_LIST: (state, { type, ids }) => {
      state.lists[type] = ids
    },

    SET_ITEMS: (state, { items }) => {
      items.forEach(item => {
        if (item) {
          Vue.set(state.items, item.id, item)
        }
      })
    },

    SET_USER: (state, { user }) => {
      Vue.set(state.users, user.id, user)
    }
  },

  getters: {
    // ids of the items that should be currently displayed based on
    // current list type and current pagination
    // 获取数据列表
    activeIds (state) {
      const { activeType, itemsPerPage, lists } = state
      const page = Number(state.route.params.page) || 1
      if (activeType) {
        // 计算0
        const start = (page - 1) * itemsPerPage
        const end = page * itemsPerPage
        return lists[activeType].slice(start, end)
      } else {
        return []
      }
    },

    // items that should be currently displayed.
    // this Array may not be fully fetched.
    // 获取数据信息
    activeItems (state, getters) {
      return getters.activeIds.map(id => state.items[id]).filter(_ => _)
    }
  }
})

export default store
