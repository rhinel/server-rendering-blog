import ItemList from '../components/ItemList.vue'

// This is a factory function for dynamically creating root-level list views,
// since they share most of the logic except for the type of items to display.
// They are essentially higher order components wrapping ItemList.vue.
export function createListView (type) {
  return {
    name: `${type}-stories-view`,
    // this will be called during SSR to pre-fetch data into the store!
    // 服务端渲染前置调用
    preFetch (store) {
      return store.dispatch('FETCH_LIST_DATA', { type })
    },
    // 渲染组件，传递参数
    render (h) {
      return h(ItemList, { props: { type }})
    }
  }
}
