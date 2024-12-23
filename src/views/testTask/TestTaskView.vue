<template>
	<div class="main_box">
		<div class="card left_box">
			<!-- 顶部标题 -->
			<div class="title_box">
				<img src="@/assets/icons/repair.png" width="25">
				<div class="name">测试计划</div>
				<el-button @click='addTask' size="small" icon='CirclePlus' plain>添加</el-button>
			</div>
			<!-- 计划列表 -->
			<el-menu :default-active="activaTask.id.toString()" v-if='pstore.taskList.length>0'>
				<el-menu-item @click='selectTask(item)' :index="item.id.toString()" v-for='item in pstore.taskList'
					key="item.id">
					<img src="@/assets/icons/repair.png" width="20" style="margin-right: 10px;">
					<span>{{item.name}}</span>
				</el-menu-item>
			</el-menu>
		</div>
		<div class="card right_box">
			<!-- 测试任务基本信息 -->
			<div class='card'>
				<!-- 右侧内容 -->
				<el-divider content-position="left"><b>基本信息</b></el-divider>
				<el-row :gutter="5" style="margin-bottom: 20px;" v-if="activaTask">
					<el-col :span="16">
						<el-input v-model="activaTask.name" size="small">
							<template #prepend>
								业务流名称
							</template>
							<template #append>
								<el-button @click="saveTask" plain icon="CircleCheck" size="small"
									type="primary">保存</el-button>
							</template>
						</el-input>
					</el-col>
					<el-col :span="8" style="text-align: right;">
						<el-button @click="runTask" plain size="small" type="primary"
							icon="Promotion">运行</el-button>
						<el-button @click="delTask" plain icon="Delete" size="small" type="danger">删除</el-button>
					</el-col>
				</el-row>
			</div>
			<!-- 测试任务中的业务流 -->
			<div class='card' style='margin-top:10px'>
				<el-divider content-position="left"><b>本计划执行的业务流</b></el-divider>
				<el-table :data="scene" row-key="id" style="width: 100%;margin-bottom: 10px;" :show-header="false">
					<el-table-column>
						<template #default="scope">
							<span class="el-icon-s-help"
								style="color: #17abe3;font-weight: bold;font-size: 14px;">{{ '业务流' + (scope.$index+1) + ': ' }}</span>
							<span style="font-weight: bold;font-size: 14px;">{{ scope.row.name }}</span>
						</template>
					</el-table-column>
					<el-table-column width="90px">
						<template #default="scope">
							<el-button plain size="small" type="danger" @click='deltaskTInScene(scope.row.id)'
								icon="Delete">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-button @click="drawer = true" plain icon="Plus" size="small" type="primary">添加测试业务流</el-button>
			</div>
			<!-- 测试任务执行的结果 -->
			<div class='card' style='margin-top:10px'>
				<el-divider content-position="left"><b>执行记录</b></el-divider>
				<el-table :data="records" class="table-style" size="small" border>
					<el-table-column prop="create_time" label="执行时间" min-width="140">
						<template #default="scope">
							{{ tools.rTime(scope.row.create_time) }}
						</template>
					</el-table-column>
					<el-table-column prop="env_name" label="测试环境" min-width="110">
						<template #default="scope">
							<span>{{scope.row.env}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="all" label="总用例" min-width="50">
						<template #default="scope">
							<span v-if="scope.row.status !== '执行中'">{{ scope.row.all }}</span>
						</template>
					</el-table-column>

					<el-table-column label="通过数" min-width="50">
						<template #default="scope">
							<span v-if="scope.row.status !== '执行中'">{{ scope.row.success }}</span>
						</template>
					</el-table-column>
					<el-table-column label="通过率" min-width="80">
						<template #default="scope">
							<span v-if="scope.row.status !== '执行中'">{{ scope.row.pass_rate + '%' }}</span>
						</template>
					</el-table-column>
					<el-table-column label="总耗时" min-width="80">
						<template #default="scope">
							<span v-if="scope.row.status !== '执行中'">{{ scope.row.run_time}}</span>
						</template>
					</el-table-column>
					<el-table-column label="执行人" min-width="80">
						<template #default="scope">
							<span v-if="scope.row.status !== '执行中'">{{ scope.row.tester}}</span>
						</template>
					</el-table-column>
					
					<el-table-column label="测试报告" width="100">
						<template #default="scope">
							<span v-if="scope.row.status === '执行中'">
								<el-tag>{{ scope.row.status }}...</el-tag>
							</span>
							<el-button v-else type="primary" icon="View" plain size="small"
								@click="$router.push({ name: 'report', params: { id: scope.row.id } })">
								报告
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
	</div>

	<!-- 添加测试业务流到测试任务中 -->
	<el-drawer v-model="drawer" direction="rtl" size="20%" :show-close="false">
		<template #header><b>添加测试流程</b></template>
		<div class="select_content">
			<el-table ref="addRef" @selection-change="selectTable" size="small" :data="Scents2()" tooltip-effect="dark"
				style="width: 100%">
				<el-table-column type="selection" min-width="40"></el-table-column>
				<el-table-column prop="name" label="全选" min-width="120"></el-table-column>
			</el-table>
		</div>
		<div style="margin: 10px; text-align: center;">
			<el-tooltip class="item" effect="dark" content="添加选中测试流程到任务中" placement="top-start">
				<el-button @click="addScentToTask" plain type="success" size="small">确认添加</el-button>
			</el-tooltip>
			<el-tooltip class="item" effect="dark" content="清除选中选项" placement="top-start">
				<el-button plain type="warning" size="small" @click="$refs.addRef.clearSelection()">清除选中</el-button>
			</el-tooltip>
			<el-tooltip class="item" effect="dark" content="关闭当前窗口" placement="top-start">
				<el-button plain type="danger" size="small" @click="drawer = false">关闭窗口</el-button>
			</el-tooltip>
		</div>
	</el-drawer>



</template>

<script setup>
	import { ProjectStore } from '@/stores/module/ProStore'
	import {UserStore} from '@/stores/module/UserStore'
	import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
	import { ElLoading } from 'element-plus'
	import CaseEditor from '@/components/CaseEditor.vue'
	import api from '@/api/index'
	import { ref, onMounted } from 'vue'
	import tools from '@/utils/dateTools'
	const pstore = ProjectStore()
	const ustore = UserStore()
	// 选择的测试计划
	let activaTask = ref({
		id: "",
		name: "",
		// scene:[]
	})
	// 测试计划的执行记录
	let records = ref([])
	// 测试计划中的测试业务流
	let scene = ref([])

	// 选择某个测试业务流
	function selectTask(item) {
		activaTask.value = item
		getTaskInfo()
		getTaskRecords()
	}
	// 默认选中第一个为激活的测试计划
	onMounted(() => {
		if (pstore.taskList.length > 0) {
			selectTask(pstore.taskList[0])
		}

	})
	// 添加测试计划
	async function addTask() {
		if (pstore.sceneList.length == 0) {
			ElMessage({
				type: 'error',
				message: '请先创建业务流，再创建测试计划',
				duration: 1000
			});
			return
		}
		const params = {
			project: pstore.pro.id,
			name: "New Plan",
			// scene: [pstore.sceneList[0].id]
			scene: []
		};
		const response = await api.createTask(params);
		if (response.status === 201) {
			ElMessage({
				type: 'success',
				message: '添加成功',
				duration: 1000
			});
			// 更新页面数据
			pstore.getTestTaskList()
			// 选中新创建的业务流
			selectTask(response.data)
		}
	}

	// 获取测试计划中的getTaskScene
	async function getTaskInfo() {
		const response = await api.getTaskInfo(activaTask.value.id)
		if (response.status == 200) {
			scene.value = response.data.scene;
			// console.log("scene.value",scene.value)
			
			let scenes = [];
			scene.value.forEach((item) => {
				if (item.id !== scene.value.id) {
					scenes.push(item.id)
				}
			})
			// console.log("Scenes",scenes)
			activaTask.value.scene = scenes
			// console.log("getTaskInfo:",activaTask.value.id,activaTask.value.scene)
		}
	}
	// 获取测试运行记录
	async function getTaskRecords(id) {
		const response = await api.getAllRecords({ task: activaTask.value.id })
		if (response.status == 200) {
			records.value = response.data
		}
	}
	// 删除测试计划
	async function delTask(id) {
		ElMessageBox.confirm('确定要删除吗?', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			})
			.then(async () => {
				const response = await api.deleteTask(activaTask.value.id);
				if (response.status === 204) {
					ElMessage({
						type: 'success',
						message: '删除成功',
						duration: 1000
					});
					pstore.getTestTaskList()
					selectTask(pstore.taskList[0])
				}
			})
			.catch(() => {
				ElMessage({
					type: 'info',
					message: '取消删除',
					duration: 1000
				});
			});
	}
	// 保存测试计划名
	async function saveTask() {
		const response = await api.updateTask(activaTask.value.id, activaTask.value);
		if (response.status === 200) {
			ElMessage({
				type: 'success',
				message: '保存成功',
				duration: 1000
			});
			pstore.getTestTaskList();
		}
	}
	// 运行测试计划
	async function runTask() {
		// const loadingInstance1 = ElLoading.service({ fullscreen: true ,text:"测试任务执行中..."})
		if (pstore.env) {
			const params = {
				env: pstore.env,
				task: activaTask.value.id,
				tester:ustore.username
			};
			ElMessage({
				type: 'success',
				message: '开始运行!',
				duration: 1000
			});
			const response = await api.runTask(params);
			if (response.status === 200) {
				ElNotification({
					title: '提示',
					message: response.data.msg,
					duration: 1000
				});
			}
		} else {
			ElMessage({
				type: 'warning',
				message: '当前未选中测试环境!',
				duration: 1000
			});
		}
	}
	// 删除测试计划中的业务流
	async function deltaskTInScene(id) {
		let scenes = []
		scene.value.forEach((item) => {
			if (item.id !== id) {
				scenes.push(item.id)
			}
		})
		let params = { ...activaTask.value }
		params.scene = scenes
		const response = await api.updateTask(params.id, params)
		if (response.status === 200) {
			ElMessage({
				type: 'success',
				message: '删除成功',
				duration: 1000
			});
			getTaskInfo();
			
		}
	}


	// 添加的业务流弹框是否显示
	let drawer = ref(false)
	// 添加选中的业务流
	let addScentList = ref([])
	// 可以添加到任务中的业务流
	function Scents2() {
		// 获取任务中没有添加的所有测试业务流
		let newSuites = pstore.sceneList.filter((item, index) => {
			return !scene.value.find(item2 => {
				return item2.id == item.id;
			});
		});
		return newSuites;
	}

	function selectTable(val) {
		// 将选中的测试业务流id保存到addScentList中
		val.forEach((item) => {
			addScentList.value.push(item.id)
		})
	}
	const addRef = ref()
	
	// 添加选中的测试业务流到测试任务中
	async function addScentToTask() {
		let params = { ...activaTask.value }
		// console.log("addScentToTask",activaTask.id,activaTask.value )
		// console.log("addScentList.value",addScentList.value)
		params.scene.push(...addScentList.value)
		addScentList.value = []
		// 发送请求
		const response = await api.updateTask(params.id, params)
		if (response.status === 200) {
			ElMessage({
				type: 'success',
				message: '添加成功',
				duration: 1000
			});
			// 更新页面数据
			getTaskInfo()
			// scene.value = response.data.scene
		}

	}
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
					width: 200px;
					text-align: center;
				}
			}
		}
	}
</style>