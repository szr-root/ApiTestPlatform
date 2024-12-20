<template>
	<router-view />
</template>

<script setup>
	import api from '@/api/index'
	import { UserStore } from '@/stores/module/UserStore'
	// 定时校验token是否有效
	setInterval(async () => {
		// 校验用户的token是否有效
		const uStore = UserStore()
		const response = await api.verifyTokenApi({
			'token': uStore.token
		})
		if (response.status !== 200) {
			uStore.isAuthenticated = true
		} else {
			uStore.isAuthenticated = false
		}

	}, 1000 * 60 * 60 * 24)
</script>


<style lang="scss">






</style>