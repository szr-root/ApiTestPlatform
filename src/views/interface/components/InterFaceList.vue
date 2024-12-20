<template>

	<el-button @click='clickAdd' size="small" type="primary" plain>添加接口</el-button>
	<el-table :data="interface" style="width: 100%">
		<el-table-column prop="name" label="接口名称" width="180" />
		<el-table-column prop="url" label="接口地址" width="200" />
		<el-table-column prop="method" label="请求方法" />
		<el-table-column label="操作">
			<template #default="scope">
				<el-button @click='clickEdit(scope.row)' size="small" icon='Edit' type="primary" plain></el-button>
				<el-button @click='deleteInterFace(scope.row.id)' size="small" icon='Delete' type="danger"
					plain></el-button>
			</template>
		</el-table-column>
	</el-table>


	<!-- 弹框 -->
	<el-drawer v-model="isShowDrawer">
		<template #header>
			<b>{{dlgTitle}}</b>
		</template>
		<template #default>
			<!-- 添加的表单 -->
			<el-form :model="formData">
				<el-form-item label="接口名称">
					<el-input v-model="formData.name" />
				</el-form-item>
				<el-form-item label="接口地址">
					<el-input v-model="formData.url" />
				</el-form-item>
				<el-form-item label="请求方法">
					<el-select style="width: 100%;" v-model="formData.method">
						<el-option label="GET" value="get" />
						<el-option label="POST" value="post" />
						<el-option label="PUT" value="put" />
						<el-option label="PATCH" value="patch" />
						<el-option label="DELETE" value="delete" />
					</el-select>
				</el-form-item>
				<el-form-item label="接口类型">
					<el-select style="width: 100%;" v-model="formData.type">
						<el-option label="项目接口" value="1" />
						<el-option label="第三方接口" value="2" />
					</el-select>
				</el-form-item>
			</el-form>
		</template>
		<template #footer>
			<div style="flex: auto">
				<el-button @click="isShowDrawer=false">取消</el-button>
				<el-button v-if='dlgTitle==="添加接口"' type="primary" @click='addInterface'>确定</el-button>
				<el-button v-else type="primary" @click='updateInterFace'>确定</el-button>
			</div>
		</template>
	</el-drawer>

</template>

<script setup>
	import api from '@/api';
	import { ref, defineProps, reactive } from 'vue'
	import { ElNotification, ElMessageBox } from 'element-plus'
	import { ProjectStore } from '@/stores/module/ProStore'

	const pstore = ProjectStore()

	// 定义组件的porps
	const prop = defineProps({
		interface: {
			type: Array, // 将类型改为 Object
			required: true ,// 如果需要该属性为必需，则设置为 true
			default:[]
		}
	})

	// 是否显示添加接口的窗口
	let isShowDrawer = ref(false)
	let dlgTitle = ref('添加接口')
	let formData = reactive({
		name: "",
		url: "",
		method: "get",
		type: "1",
		project: pstore.pro.id,
	})
	// 点击添加按钮执行
	function clickAdd() {
		dlgTitle.value = '添加接口'
		isShowDrawer.value = true
		formData.name = ''
		formData.url = ''
		formData.method = 'get'
		formData.type = '1'
	}
	// 点击确认添加执行
	async function addInterface() {
		const response = await api.createInterFaceApi(formData)
		if (response.status === 201) {
			// 关闭窗口
			isShowDrawer.value = false
			ElNotification({
				title: '添加成功',
				type: 'success',
			})
		}
		// 刷新页面数据
		pstore.getInterFaceList()
	}
	// 保存当前编辑接口的ID
	let editInterId = null
	// 点击编辑接口
	function clickEdit(item) {
		// 显示编辑框
		dlgTitle.value = '编辑接口'
		isShowDrawer.value = true
		formData.name = item.name
		formData.url = item.url
		formData.method = item.method
		formData.type = item.type
		// 保存当前编辑接口的ID
		editInterId = item.id
	}
	// 编辑完成，调用后端修改接口信息的方法
	async function updateInterFace() {
		const response = await api.editInterFaceApi(editInterId, formData)
		if (response.status === 200) {
			// 关闭窗口
			isShowDrawer.value = false
			ElNotification({
				title: '修改成功',
				type: 'success',
			})
			// 刷新页面数据
			pstore.getInterFaceList()
		}
	}

	// 删除接口的方法
	function deleteInterFace(id) {
		ElMessageBox.confirm(
			'删除操作不可恢复，请确认是否要删除该接口?',
			'提示', {
				confirmButtonText: '确认',
				cancelButtonText: '取消',
				type: 'warning',
			}
		).then(async () => {
			// 调用后端接口进行删除
			const response = await api.deleteInterFaceApi(id)
			if (response.status === 204) {
				ElNotification({
					title: '删除成功',
					type: 'success',
				})
				// 刷新页面数据
				pstore.getInterFaceList()
			}
		}).catch(() => {
			ElMessage({
				type: 'info',
				message: '已取消删除操作',
			})
		})

	}
</script>

<style>
</style>