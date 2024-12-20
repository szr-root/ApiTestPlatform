<template>
	<div class="main_box">
		<div class="card left_box">
			<!-- 顶部标题 -->
			<div class="title_box">
				<img src="@/assets/icons/liucheng.png" width="25">
				<div class="name">测试业务流</div>
				<el-button @click='clickaddScene' size="small" icon='CirclePlus' plain>添加</el-button>
			</div>
			<!-- 环境列表 -->
			<el-menu :default-active="activaScene.id+''">
				<el-menu-item @click='selectScene(item)' :index="item.id.toString()" v-for='item in pstore.sceneList'
					key="item.id">
					<img src="@/assets/icons/liucheng.png" width="20" style="margin-right: 10px;">
					<span>{{item.name}}</span>
				</el-menu-item>
			</el-menu>
		</div>
		<div class="card right_box" >
			<!-- 右侧顶部 -->
			<el-card style="background: none;">
				<el-divider content-position="left">业务流信息</el-divider>
				<div class="name_edit">
					<el-input v-model="activaScene.name" placeholder="Please input">
						<template #prepend>业务流名称</template>
					</el-input>
					<div class="btns">
						<el-button @click='saveScene' type="primary" icon='CopyDocument' plain>保存</el-button>
						<el-button @click='clickRunScene' type="primary" icon='Promotion' plain>运行</el-button>
						<el-button @click='clickScene' type="danger" icon="Delete" plain>删除</el-button>
					</div>
				</div>
			</el-card>
			<!-- 右侧下面部分 -->
			<el-card style="background: none;margin-top: 5px;" id='scent_table'>
				<el-divider content-position="left">业务流中的用例步骤</el-divider>
				<el-table :data="SceneCaseList" style="width: 100%" :show-header='false'>
					<el-table-column label="名称">
						<template #default="scope">
							<div style="display: flex;align-items: center;">
								<img src="@/assets/icons/case.png" width="20" style="margin-right: 5px;">
								<span style="color: #00aaff;font-weight: bold;">步骤{{scope.row.sort}}:</span>
								<span>{{scope.row.icase.title}}</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="操作" width="200">
						<template #default="scope">
							<el-button @click='clickEditCase(scope.row.icase.id)' size="small">编辑</el-button>
							<el-button @click='deleteSceneCase(scope.row.id)' size="small" type="danger">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-button @click="clickAddScent" style="margin-top: 10px;" plain type="primary" icon='Plus'
					size="small">新增步骤</el-button>
			</el-card>
		</div>
	</div>

	<!-- 显示测试结果的抽屉组件 -->
	<el-drawer v-model="isShowRunResult" title="运行结果" size="40%">
		<RunSceneResult :results='runResult'></RunSceneResult>
	</el-drawer>

	<!--显示用例编辑的组件  -->
	<el-drawer v-model="isShowEditCase" title="编辑用例" size="40%">
		<CaseEditor :case_id="editCaseId"></CaseEditor>
	</el-drawer>
	<!-- 新增流程中新增测试步骤的 -->
	<el-drawer v-model="addStepDlg" size="20%">
		<AddTestScent :scene='activaScene' :cases="SceneCaseList" @refresh='getsceneCase(activaScene.id)'>
		</AddTestScent>
	</el-drawer>

</template>

<script setup>
	import { ProjectStore } from '@/stores/module/ProStore'
	import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
	import RunSceneResult from './components/RunSceneResult.vue'
	import AddTestScent from './components/AddTestScent.vue'
	import CaseEditor from '@/components/CaseEditor.vue'
	import api from '@/api/index'
	import { ref, onMounted } from 'vue'
	import { ElLoading } from 'element-plus'
	const pstore = ProjectStore()

	

	// 选择的测试业务流id
	let activaScene = ref({
		id: "",
		name: ""
	})
	// 选中用例中的测试业务流列表
	let SceneCaseList = ref([])

	// 生命周期函数（数据挂载之后执行）
	onMounted(() => {
		if (pstore.sceneList.length > 0) {
			selectScene(pstore.sceneList[0])
		}
	})
	// 选择某个测试业务流
	function selectScene(item) {
		activaScene.value = item
		getsceneCase(item.id)
	}
	
	// 添加测试业务流
	async function clickaddScene() {
		const response = await api.createSceneApi({
			project: pstore.pro.id,
			name: "New业务流"
		})
		if (response.status === 201) {
			// 提示成功
			ElNotification({
				title: '测试业务流创建成功',
				type: 'success',
			})
			// 刷新页面数据
			pstore.getSceneList()
			// 选中新建的测试业务流
			activaScene.value = response.data
			getsceneCase()
		}
	}

	// 获取测试业务流中的测试用例
	async function getsceneCase() {
		const response = await api.getSceneCaseListApi(activaScene.value.id)
		if (response.status === 200) {
			SceneCaseList.value = response.data
		}
	}

	// 删除测试业务流
	function clickScene() {
		ElMessageBox.confirm(
				'此操作不可恢复，确认要删除该测试业务流?',
				'警告', {
					confirmButtonText: '确认',
					cancelButtonText: '取消',
					type: 'warning',
				}
			)
			.then(async () => {
				const response = await api.deleteSceneApi(activaScene.value.id)
				if (response.status === 204) {
					// 提示
					ElNotification({
						title: '删除成功',
						type: 'success',
					})
					// 刷新页面数据
					pstore.getSceneList()

					// 从新选中一个激活的业务流
					if (pstore.sceneList.length > 0) {
						selectScene(pstore.sceneList[0])
					}


				}
			})
	}
	
	// 保存测试业务流
	async function saveScene(){
		const response = await api.updateSceneApi(activaScene.value.id,activaScene.value)
		if (response.status === 200) {
			// 提示
			ElNotification({
				title: '保存成功',
				type: 'success',
			})
			// 刷新页面数据
			pstore.getSceneList()		
		}
	}

	// 保存测试场景运行的结果
	const runResult = ref([])
	// 是否显示测试运行结果的组件
	const isShowRunResult = ref(false)
	// 运行测试业务流
	async function clickRunScene() {
		const loadingInstance1 = ElLoading.service({ fullscreen: true ,text:"执行用例中"})
		if (pstore.env) {
			const params = {
				env: pstore.env,
				scene: activaScene.value.id
			}
			const response = await api.runTestSceneApi(params)
			if (response.status === 200) {
				ElNotification({
					title: '运行完成',
					type: 'success',
				})
				runResult.value = response.data
				isShowRunResult.value = true
			}
		} else {
			ElMessage.error('请先选择测试环境！')
		}
		loadingInstance1.close()
	}

	// =========编辑业务流中的用例============
	let isShowEditCase = ref(false)
	let editCaseId = ref()

	function clickEditCase(id) {
		console.log(id)
		editCaseId.value = id
		isShowEditCase.value = true

	}
	// ===删除测试业务流中的用例==========
	async function deleteSceneCase(id) {
		const response = await api.deleteCaseFormScene(id)
		if (response.status === 204) {
			ElNotification({
				title: '删除成功',
				type: 'success',
			})
			// 刷新页面数据
			getsceneCase()
		}
	}
	// 新增步骤到测试流程的窗口是否可见
	let addStepDlg = ref(false)
	// ============点击新增===========================
	function clickAddScent() {
		addStepDlg.value = true
	}

	// ===========步骤拖拽排序===============
	import Sortable from 'sortablejs';
	// 拖动套件中的用例顺序
	function initSort() {
		// 选择表格
		const tbody = document.querySelector('#scent_table .el-table__body-wrapper tbody');
		Sortable.create(tbody, {
			onEnd({ newIndex, oldIndex }) {
				// console.log(SceneCaseList.value.toString())
				let currRow = SceneCaseList.value.splice(oldIndex, 1)[0];
				SceneCaseList.value.splice(newIndex, 0, currRow);
				// 修改后端用例数据的顺序
				updateScentOrder();
			}
		});
	}
	// 调用接口修改后端顺序
	async function updateScentOrder() {
		// 修改caseList中的order字段
		let params= []
		SceneCaseList.value.forEach((item, index, array) => {
			params.push({
				id:item.id,
				sort:index+1,
			})
		});
		
		// 发送请求后端修改用例顺序
		const response = await api.SceneCaseSortApi(params);
		if (response.status === 200) {
			ElNotification({
				type: 'success',
				message: '调整排序成功',
				duration: 500
			});
		}
		SceneCaseList.value =[]
		getsceneCase()

		
	}

	// 初始化排序组件
	onMounted(() => {
		initSort()
	})
</script>

<style lang="scss" scoped>
	.main_box {
		height: calc(100% - 42px);
		display: flex;

		// 左侧样式
		.left_box {
			width: 200px;

			.title_box {
				display: flex;
				height: 40px;
				align-items: center;
				justify-content: center;
				border-bottom: solid 1px #6a6a6a;

				.name {
					font-weight: bold;
					font-size: 18px;
					margin: 0 10px;
				}
			}

			.el-menu {
				border: none;

				.el-menu-item {
					height: 35px;
					line-height: 35px;
				}
			}


		}

		// 右侧样式
		.right_box {
			flex: 1;
			padding: 10px;

			.name_edit {
				display: flex;

				.btns {
					width: 400px;
					text-align: center;
				}
			}
		}
	}
</style>