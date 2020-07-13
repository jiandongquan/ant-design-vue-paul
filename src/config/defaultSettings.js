/**
 * 项目默认配置项
 * primaryColor - 默认主题色, 如果修改颜色不生效，请清理 localStorage
 * navTheme - sidebar theme ['dark', 'light'] 两种主题
 * colorWeak - 色盲模式
 * layout - 整体布局方式 ['sidemenu', 'topmenu'] 两种布局
 * fixedHeader - 固定 Header : boolean
 * fixSiderbar - 固定左侧菜单栏 ： boolean
 * contentWidth - 内容区布局： 流式 |  固定
 * storageOptions: {} - Vue-ls 插件配置项 (localStorage/sessionStorage)
 */

export default {
  // 侧边栏的主题，包括两种：dark、light
  navTheme: 'light',

  // Ant Design组件的默认主题颜色，如果修改颜色不生效，则需要清理localstorage
  primaryColor: '#92C41A',

  // 整体布局-菜单栏的位置，包括两种：sidemenu、topmenu
  layout: 'sidemenu',

  // 内容区域布局，只有菜单栏位置为topmenu时有效，包括两种：Fluid-流式布局、Fixed-固定布局
  contentWidth: 'Fluid',

  // 固定Header
  fixedHeader: false,

  // 固定侧边栏，只有菜单栏位置为sidemenu时有效；
  fixSiderbar: false,

  // 色弱模式
  colorWeak: false,

  // 菜单--本地？
  menu: {
    locale: true
  },

  // 应用标题
  title: 'Ant Design Pro',

  // pwa模式
  pwa: false,

  // 图标库URL
  iconfontUrl: '',

  whiteList: ['login', 'register', 'registerResult'],

  // 是否生产版本；
  production: process.env.NODE_ENV === 'production' && process.env.VUE_APP_PREVIEW !== 'true'
}
