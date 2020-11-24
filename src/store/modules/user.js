import { login, getPcMenu } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { constantRoutes, resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: constantRoutes
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  ADD_ROUTES: (state, routes) => {
    // console.log(routes)
    // console.log(constantRoutes.concat(routes))
    state.routes = constantRoutes.concat(routes)
    // console.log(state.routes)
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        console.log('success')
        const { data } = response
        commit('SET_TOKEN', data)
        setToken(data)
        resolve()
      }).catch(error => {
        console.log('error')
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getPcMenu().then(response => {
        const { data } = response
        // console.log(data)
        const asyncRoutes = [
          {
            path: '/bus',
            name: '业务管理',
            routePath: 'Layout',
            redirect: '/bus',
            meta: {
              title: '业务管理',
              icon: ''
            },
            hidden: true,
            children: [
              {
                path: 'bus',
                // name: '业务管理_child01',
                routePath: 'bus',
                meta: {
                  title: '业务管理_child01',
                  icon: ''
                },
                hidden: true
              },
              {
                path: 'bus_child',
                // name: '业务管理_child02',
                routePath: 'bus/child',
                meta: {
                  title: '业务管理_child02',
                  icon: ''
                },
                hidden: true
              }
            ]
          }
        ]
        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        // const { name, avatar } = data
        commit('ADD_ROUTES', asyncRoutes)
        commit('SET_NAME', 'admin')
        // commit('SET_AVATAR', avatar)
        resolve(asyncRoutes)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  // add routes
  addRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      // console.log('获取路由')
      getPcMenu().then((res) => {
        console.log(res)
        commit('ADD_ROUTES', res.data)
        resolve(res.data)
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

