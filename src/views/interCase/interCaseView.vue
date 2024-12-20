<template>
	<div class=" main_box">
		<div class="card left_box">
			<!-- 标题 -->
			<div class="title_box">
				<img src="@/assets/icons/icon-api-a.png" width="25">
				<div class="name">接口测试</div>
			</div>
			<el-tabs stretch v-model='activaTab'>
				<el-tab-pane label="项目接口" name="api1">
					<!-- 层级菜单 -->
					<el-menu :default-active="activeCase+''">
						<el-sub-menu :index="inter.id.toString()" v-for='inter in pstore.interfaces1' :key='inter.id'>
							<template #title>
								<img src="@/assets/icons/icon-api-a.png" width="20">
								<el-tag v-if='inter.method=="get"' style="margin: 0 5px;" size="small" type="info">GET</el-tag>
								<el-tag v-else-if='inter.method=="post"'  style="margin: 0 5px;" size="small" type="success">POST</el-tag>
								<el-tag v-else-if='inter.method=="patch"' style="margin: 0 5px;" size="small" type="warning">PATCH</el-tag>
								<el-tag v-else-if='inter.method=="put"' style="margin: 0 5px;" size="small" type="">PUT</el-tag>
								<el-tag v-else-if='inter.method=="delete"' style="margin: 0 5px;" size="small" type="danger">DELETE</el-tag>
								<span>{{inter.name}}</span>
							</template>
							<!-- 注意点：el-menu下面的菜单项或者层级菜单的index值必须是唯一的 -->
							<el-menu-item @click='selectCase(_case.id)' :index="_case.id.toString()"
								v-for='_case in inter.cases' key='_case.id' style="height: 35px;line-height: 35px;">
								<img src="@/assets/icons/case.png" width="20">
								<span style="margin: 0 5px;">{{_case.title}}</span>
							</el-menu-item>
							<!-- 添加用例 -->
							<el-menu-item @click='clickAddCase(inter.id)' :index="inter.id+'add'"
								style="height: 35px;line-height: 35px;">
								<img src="@/assets/icons/add-sub.png" width="20">
								<span style="margin: 0 5px;color: #17abe3;">添加用例</span>
							</el-menu-item>
						</el-sub-menu>
					</el-menu>
				</el-tab-pane>
				<el-tab-pane label="第三方接口" name="api2">
					<!-- 层级菜单 -->
					<el-menu :default-active="activeCase+''">
						<el-sub-menu :index="inter.id.toString()" v-for='inter in pstore.interfaces2' :key='inter.id'>
							<template #title>
								<img src="@/assets/icons/icon-api-a.png" width="20">
								<el-tag style="margin: 0 5px;" size="small" type="info">POST</el-tag>
								<span>{{inter.name}}</span>
							</template>
							<!-- 注意点：el-menu下面的菜单项或者层级菜单的index值必须是唯一的 -->
							<el-menu-item @click='selectCase(_case.id)' :index="_case.id+''"
								v-for='_case in inter.cases' key='_case.id' style="height: 35px;line-height: 35px;">
								<img src="@/assets/icons/case.png" width="20">
								<span style="margin: 0 5px;">{{_case.title}}</span>
							</el-menu-item>
							<!-- 添加用例 -->
							<el-menu-item @click='clickAddCase(inter.id)' :index="inter.id+'add'"
								style="height: 35px;line-height: 35px;">
								<img src="@/assets/icons/add-sub.png" width="20">
								<span style="margin: 0 5px;color: #17abe3;">添加用例</span>
							</el-menu-item>
						</el-sub-menu>
					</el-menu>
				</el-tab-pane>
			</el-tabs>
		</div>

		<div class="card right_box">
			<CaseEditor :case_id='activeCase'></CaseEditor>
		</div>

	</div>

	<!-- 添加用例的弹框 -->
	<el-drawer v-model="isShowDrawer">
		<template #header>
			<b>添加用例</b>
		</template>
		<template #default>
			<!-- 添加的表单 -->
			<el-input v-model="newCase.title" />
		</template>
		<template #footer>
			<div style="flex: auto">
				<el-button @click="isShowDrawer=false">取消</el-button>
				<el-button @click='addCase' type="primary">确定</el-button>
			</div>
		</template>
	</el-drawer>

</template>

<script setup>
	import { ProjectStore } from '@/stores/module/ProStore'
	import CaseEditor from '@/components/CaseEditor.vue'
	import { ElNotification } from 'element-plus'
	import api from '@/api/index'
	import { ref, reactive } from 'vue'
	const activaTab = ref('api1')
	const pstore = ProjectStore()
	// 页面选中的用例id
	let activeCase = ref()
	// 选中的用例
	function selectCase(id) {
		activeCase.value = id
	}

	let isShowDrawer = ref(false)
	let newCase = reactive({
		title: "",
		interface: null,
		headers:{"Authorization": "${{token}}"}
	})
	// 点击添加用例
	function clickAddCase(interId) {
		// 显示窗口
		isShowDrawer.value = true
		newCase.interface = interId
	}

	// 发送添加用例的请求
	async function addCase() {
		const response = await api.createCaseApi(newCase)
		if (response.status === 201) {
			// 弹出提示
			ElNotification({
				title: '添加成功',
				type: 'success',
			})
			// 更新页面数据
			await pstore.getInterFaceList()
			// 选中新的用例
			selectCase(response.data.id)
			// 关闭窗口
			isShowDrawer.value = false
		}
	}
</script>

<style lang="scss" scoped>
	.main_box {
		height: calc(100% - 42px);
		display: flex;

		// 左侧样式
		.left_box {
			width: 230px;

			// 左侧标题栏样式
			.title_box {
				width: 100%;
				display: flex;
				height: 40px;
				align-items: center;
				justify-content: center;
				border-bottom: solid 1px #6a6a6a;

				.name {
					font-weight: bold;
					margin-left: 5px;
				}
			}

			.el-menu {
				border: none;
			}
		}

		// 右侧样式
		.right_box {
			flex: 1;
			padding: 10px;
		}
	}
</style>