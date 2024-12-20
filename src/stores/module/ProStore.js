import { defineStore } from 'pinia'
import api from '@/api/index'

export const ProjectStore = defineStore('proStore', {
	state: () => {
		return {
			pro: {},
			// 测试环境列表
			envList: [],
			// 顶部选中的测试环境
			env: null,
			// 保存接口列表
			interfaces: [],
			// 测试业务流列表
			sceneList: [],
			// 保存测试计划的列表
			taskList: []
		}
	},
	getters: {
		// 项目接口
		interfaces1() {
			return this.interfaces.filter((item) => {
				return item.type == '1'
			})
		},
		// 第三方接口
		interfaces2() {
			return this.interfaces.filter((item) => {
				return item.type == '2'
			})
		},
	},

	actions: {
		// 获取项目下面所以的接口
		async getInterFaceList() {
			const response = await api.getInterFaceListApi(this.pro.id)
			if (response.status === 200) {
				this.interfaces = response.data
			}
		},
		// 获取项目下面所以测测试业务流:getSceneListApi
		async getSceneList() {
			const response = await api.getSceneListApi({ project: this.pro.id })
			if (response.status === 200) {
				this.sceneList = response.data
			}
		},
		// 获取项目下所有的测试计划
		async getTestTaskList() {
			const response = await api.getTaskList({ project: this.pro.id })
			if (response.status === 200) {
				this.taskList = response.data
			}
		}




	},
	persist: true

})