import { defineStore } from 'pinia'
import api from '@/api/index'

export const UserStore = defineStore('ustore', {
	state: () => {
		return {
			token: "",
			username: "",
			isCollapse: true,
			// 表示用户是否登录
			isAuthenticated: false,
			// 保存历史访问路由的变量
			tabs: []

		}
	},
	actions: {
		// 保存token的方法
		saveToken(value) {
			this.token = value

		},
		// 保存用户名的方法
		saveUserName(value) {
			this.username = value
		},
		// 保存路由信息到tabs中的方法
		addTabs(route) {
			// 查找该路由地方已经保存
			const res = this.tabs.find((item, index) => {
				return route.path === item.path
			})
			// 如果没有保存，则进行保存
			if (!res) {
				this.tabs.push({
					name: route.meta.name,
					path: route.path
				})
			}
		},
		// 删除tabs中的路由信息
		deleteTabs(path) {
			this.tabs = this.tabs.filter((item) => {
				return item.path !== path
			})
		}

	},
	persist: true

})