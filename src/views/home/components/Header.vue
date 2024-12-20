<template>
	<div class="head_box">
		<!-- 左侧内容 -->
		<div class="left_box">
			<!-- 图标 -->
			<el-icon size="28" @click="switchCollapse">
				<Expand v-if='ustore.isCollapse' />
				<Fold v-else />
			</el-icon>
			<!-- 显示时间 -->
			<div class="time_info">
				{{nTime}}
			</div>

			<!-- 选择框 -->
			<el-select v-model="env" placeholder="请选择测试环境">
				<el-option v-for='item in evnList' :key="item.id" :label="item.name" :value="item.id" />
			</el-select>

		</div>

		<!-- 中间内容 -->
		<div class="center_box">自动化测试平台</div>

		<!-- 右侧内容 -->
		<div class="right_box">
			<!-- 页面全屏展示 -->
			<el-icon size="30" @click='screenFull.toggle()'>
				<Rank />
			</el-icon>
			<!-- 头像展示区域 -->

			<el-dropdown>
				<span class="el-dropdown-link">
					<img src="@/assets/images/avatar02.png">
				</span>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item @click='selectPro'>选择项目</el-dropdown-item>
						<el-dropdown-item @click='logout'>退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>



		</div>
	</div>



</template>

<script setup>
	import { useRouter } from 'vue-router'
	import { UserStore } from '@/stores/module/UserStore'
	import { ElNotification } from 'element-plus'
	import { ref } from 'vue'
	const ustore = UserStore()

	// =============修改菜单折叠的值====================
	function switchCollapse() {
		ustore.isCollapse = !ustore.isCollapse
	}

	// ==============顶部实时时间的显示=============
	let nTime = ref()

	function getNowTime() {
		let nowTime = new Date()
		let y = nowTime.getFullYear()
		let m = nowTime.getMonth() + 1
		let d = nowTime.getDate()
		let H = nowTime.getHours()
		let M = nowTime.getMinutes()
		let S = nowTime.getSeconds()
		if (H < 10) {
			H = '0' + H
		}
		if (S < 10) {
			S = '0' + S
		}
		if (M < 10) {
			M = '0' + M
		}
		return `${y}年${m}月${d}日${H}:${M}:${S}`
	}
	setInterval(() => {
		nTime.value = getNowTime()
	}, 1000)

	// =====================测试环境的管理(后面再写)=======================
	import { ProjectStore } from '@/stores/module/ProStore'
	import { storeToRefs } from 'pinia'
	const pstore = ProjectStore()
	const pstoreRef = storeToRefs(pstore)
	const evnList = pstoreRef.envList
	let env = pstoreRef.env
	
	
	// =========================选择项目 和退出登录===========================
	const router = useRouter()

	function selectPro() {
		// 跳转到项目管理页面，
		router.push({
			name: "pro_manage"
		})
	}

	function logout() {
		// 跳转到登录页面，清空登录的用户信息和pinia的数据
		router.push({
			name: "login"
		})
		ElNotification({
			title: '已为您注销登录',
			type: 'success',
		})
		// 清除token
		ustore.token = ''
		// 修改登录的状态
		ustore.isAuthenticated = false

	}
	// ==========================页面全屏展示=========================
	import screenFull from 'screenfull'
</script>

<style scoped lang="scss">
	.head_box {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: url('@/assets/images/header-line.png');
		background-repeat: no-repeat;
		background-size: cover;
		height: 55px;

		// 左侧内容的样式
		.left_box {
			flex: 1;
			display: flex;
			align-items: center;
			height: 55px;

			.time_info {
				color: #00aaff;
				font-weight: bold;
				margin-right: 10px;
			}

			.el-icon {
				margin: 0 10px;
			}
		}

		// 中间部分样式
		.center_box {
			background: url('@/assets/images/header-center-bg.png');
			background-repeat: no-repeat;
			background-size: cover;
			height: 50px;
			width: 550px;
			line-height: 50px;
			text-align: center;
			font-weight: bold;
			font-size: 22px;
			color: #00aaff;
		}

		// 右侧样式
		.right_box {
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: right;
			padding-right: 20px;

			img {
				padding-left: 10px;
				width: 40px;
				height: 40px;
			}
		}

	}
</style>