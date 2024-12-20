<template>
	<div class='pro_page'>
		<div class="pro_box">
			<!-- 顶部内容 -->
			<div class="welcome">
				<span>欢迎使用自动化测试平台</span>
				<el-button icon="CirclePlus" size="small" @click='showDlg'>添加项目</el-button>
			</div>
			<!-- 项目列表（跑马灯） -->

			<div class="pro_list">
				<el-carousel trigger="click" type="card" height='600px'>
					<el-carousel-item v-for="(item,index) in proList" :key="index">
						<!-- 项目卡片 -->
						<div class="pro">
							<div @click='enterProject(item)'>
								<!-- 图片 -->
								<img src="@/assets/images/pro01.png">
								<!-- 名称 -->
								<div class="name">
									{{item.name}}
								</div>
							</div>
							<!-- 按钮 -->
							<div class="btn_box">
								<el-button @click='clickEdit(item)' plain icon='Edit' size="small"></el-button>
								<el-button @click='clickDelete(item.id)' plain icon='Delete' size="small"></el-button>
							</div>
						</div>
					</el-carousel-item>
				</el-carousel>
			</div>

		</div>
	</div>

	<!-- 添加项目的弹框 -->
	<el-dialog v-model="isDlgShow" title="添加项目">
		<el-form :model="fromData" label-width="80">
			<el-form-item label="项目名称">
				<el-input v-model="fromData.name" autocomplete="off" />
			</el-form-item>
			<el-form-item label="负责人">
				<el-input v-model="fromData.leader" autocomplete="off" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="isDlgShow = false">取消</el-button>
				<el-button type="primary" @click="creatPro">确认</el-button>
			</span>
		</template>
	</el-dialog>

	<!-- 修改项目的弹框 -->
	<el-dialog v-model="isUpdateDlgShow" title="编辑项目">
		<el-form :model="fromUpdateData" label-width="80">
			<el-form-item label="项目名称">
				<el-input v-model="fromUpdateData.name" autocomplete="off" />
			</el-form-item>
			<el-form-item label="负责人">
				<el-input v-model="fromUpdateData.leader" autocomplete="off" />
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="isUpdateDlgShow = false">取消</el-button>
				<el-button type="primary" @click="updatePro">确认</el-button>
			</span>
		</template>
	</el-dialog>

</template>

<script setup>
	import api from '@/api/index'
	import { ref, reactive } from 'vue'
	import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
	import {useRouter} from 'vue-router'
	import {ProjectStore} from '@/stores/module/ProStore'
	
	// 创建路由对象
	const router = useRouter()
	
	//=============获取项目列表===============
	let proList = ref([])
	async function getProList() {
		const response = await api.getProListApi()
		if (response.status === 200) {
			proList.value = response.data
		}
	}
	getProList()
	// ===================实现项目添加的功能=================
	let isDlgShow = ref(false)
	let fromData = reactive({
		name: "",
		leader: ""
	})
	// 显示添加窗口
	function showDlg() {
		isDlgShow.value = true
	}
	// 发生请求添加项目
	async function creatPro() {
		const response = await api.createProApi(fromData)
		if (response.status === 201) {
			// 弹出提示
			ElNotification({
				title: '项目创建成功',
				type: 'success',
			})
			// 关闭窗口
			isDlgShow.value = false
			// 刷新页面数据
			getProList()
		}
	}
	// ===========实现项目修改的功能===================
	let isUpdateDlgShow = ref(false)
	let fromUpdateData = ref({
		name: "",
		leader: ""
	})
	// 点击编辑按钮时调用的方法
	function clickEdit(pro) {
		isUpdateDlgShow.value = true
		fromUpdateData.value = { ...pro }
	}
	// 发送请求修改项目信息
	async function updatePro() {
		let pro_id = fromUpdateData.value.id
		const response = await api.editProApi(pro_id, fromUpdateData.value)
		if (response.status === 200) {
			ElNotification({
				title: '项目修改成功',
				type: 'success',
			})
			// 关闭窗口
			isUpdateDlgShow.value = false
			// 刷新页面上的数据
			getProList()
		}
	}
	// ==============实现项目删除的功能=====================
	function clickDelete(pro_id) {
		// 调用后端的接口进行删除
		ElMessageBox.confirm(
				'删除操作不可恢复，请确认是否要删除该项目?',
				'提示', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
			.then(async () => {
				// 调用后端接口进行删除
				const response = await api.deleteProApi(pro_id)
				if (response.status === 204) {
					ElMessage({
						type: 'success',
						message: '已成功删除该项目',
					})
					// 刷新页面数据
					getProList()
				}
			})
			.catch(() => {
				ElMessage({
					type: 'info',
					message: '已取消删除操作',
				})
			})
	}

	// ===============选中并进入项目=======================
	function enterProject(pro){
		const proStore = ProjectStore()
		proStore.pro = pro
		// 跳转到home页面
		router.push({
			name:"home"
		})
		
	}
</script>

<style lang="scss" scoped>
	@import './promanage.scss'
</style>