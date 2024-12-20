<template>
	<div class="tabs_box">
		<el-tabs v-model='$route.path' @tab-click="clickTab" @tab-remove='clickDel' type="card">
			<div v-for='i in ustore.tabs'>
				<el-tab-pane v-if='$route.path !==i.path ' :label="i.name" :name="i.path" closable></el-tab-pane>
				<el-tab-pane v-else :label="i.name" :name="i.path"></el-tab-pane>
			</div>


		</el-tabs>

	</div>
</template>

<script setup>
	import { UserStore } from '@/stores/module/UserStore'
	const ustore = UserStore()
	import { useRouter } from 'vue-router'
	const router = useRouter()

	// 点击选项卡
	function clickTab(ele) {
		router.push(ele.props.name)
	}
	// 点击删除的方法
	function clickDel(item) {
		ustore.deleteTabs(item)
	}
</script>

<style scoped lang="scss">
	.tabs_box {
		height: 40px;
		border-bottom: solid 1px #6a6a6a;
	}
</style>