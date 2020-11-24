import componentsMap from './components.js'

const routerUtil = {
  /**
	 * 后台返回的路由表，需要组合
	 * @param {Array} routerTable 路由表
	 */
  combination(routerTable) {
    if (routerTable) {
      routerTable.forEach((item, index) => {
        item.meta = {
          icon: item.icon,
          title: item.title,
          userAuth: item.userAuth
        }
        item.component = componentsMap[item.component]
        delete item.icon
        delete item.title
        delete item.userAuth
      })
    }
  },
  /**
	 * 递归组合成路由树
	 * @param {Array} notesArray 路由表
	 * @param {Number} chileId 父节点ID
	 */
  routerTree(notesArray, chileId) {
    const treeNotes = []
    if (notesArray && notesArray.length > 0) {
      notesArray.forEach(note => {
        const parentId = note.parentId
        if (chileId == parentId) {
          const cchileId = note.id
          const children = routerUtil.routerTree(notesArray, cchileId)
          if (children && children.length > 0) {
            note['children'] = children
          }
          treeNotes.push(note)
        }
      })
    }
    return treeNotes
  }
}
export default routerUtil
