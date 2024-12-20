<template #default>
	<el-tabs>
		<el-tab-pane label="项目接口">
			<el-scrollbar height="calc(100vh - 200px)">
				<el-tree ref="treeM1" :data="interfaces1" show-checkbox :props="addTreeProps" node-key="id"
					default-expand-all highlight-current>
					<template #default="{ node, data }">
						<span class="custom-tree-node">
							<div v-if="data.name">
								<img src="@/assets/icons/icon-api-a.png" height="20">
								<b style="color:#00aaff ;">{{ data.name }}</b>
							</div>
							<div v-if="data.title">
								<img src="@/assets/icons/case.png" height="20">
								<span>: {{ data.title }}</span>
							</div>
						</span>
					</template>
				</el-tree>
			</el-scrollbar>
		</el-tab-pane>
		<el-tab-pane label="第三方接口" name="second">
			<el-scrollbar height="calc(100vh - 200px)">
				<el-tree ref="treeM2" :data="interfaces2" show-checkbox :props="addTreeProps" node-key="id"
					default-expand-all :expand-on-click-node="false">
					<template #default="{ node, data }">
						<span class="custom-tree-node">
							<div v-if="data.name">
								<b style="color:#00aaff ;">
									<img src="@/assets/icons/icon-api-a.png" height="20">
									{{ data.name }}
								</b>
							</div>
							<div v-if="data.title">
								<b style="color:#00aaff ;">
									<img src="@/assets/icons/case.png" height="20">
									用例
								</b>
								<span>: {{ data.title }}</span>
							</div>
						</span>
					</template>
				</el-tree>
			</el-scrollbar>
		</el-tab-pane>
	</el-tabs>
	<div class="add-btns">
		<el-tooltip class="item" effect="dark" content="将选择的用例,加入到测试的业务流中" placement="top-start">
			<el-button type="primary" size="small" @click="addToScent('add')" plain>确认添加</el-button>
		</el-tooltip>
	</div>

</template>

<script setup>
	import api from '@/api/index'
	import { ref, reactive, defineProps, defineEmits } from 'vue'
	import { ProjectStore } from '@/stores/module/ProStore'
	import { storeToRefs } from 'pinia'
	import { ElNotification } from 'element-plus'

	const proStore = ProjectStore()
	const proStoreRef = storeToRefs(proStore)
	const interfaces1 = proStoreRef.interfaces1
	const interfaces2 = proStoreRef.interfaces2
	// 定义props
	const prop = defineProps(['cases','scene'])
	// 定义事件
	const emit = defineEmits('refresh')
	// 树形数据子元素的字段
	const addTreeProps = {
		children: 'cases'
	}
	// 树形控件的应用
	const treeM1 = ref({})
	const treeM2 = ref({})

	function getcheckedCase() {
		console.log(treeM1)
		const Nodes1 = treeM1.value.getCheckedNodes();
		const Nodes2 = treeM2.value.getCheckedNodes();
		const Nodes = [...Nodes1, ...Nodes2];
		// 过滤出选中的用例
		const result = Nodes.filter(function(item, index) {
			return item.title;
		});
		return result;
	}
	// 添加接口用例到业务流程中
	async function addToScent() {
		const checkedCase = getcheckedCase();

		let order_s = prop.cases.length;
		for (let value of checkedCase) {
			let item = { ...value };
			order_s += 1;
			const response = await api.addCaseToSceneApi({ icase: item.id, scene: prop.scene.id, sort: order_s });
			if (response.status === 201) {
				ElNotification({
					type: 'success',
					title: '成功',
					message: `用例-${item.title}-添加成功`,
					duration: 2000
				});
				emit('refresh')

			} else {
				ElNotification({
					title: '失败',
					message: `用例-${item.title}-添加失败`,
					type: 'warning',
					duration: 2000
				});
			}
		}
		proStore.getInterFaceList();
	}
</script>

<style scoped>
	.add-btns {
		text-align: center;
		margin-top: 20px;
	}
</style>