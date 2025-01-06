import axios from 'axios'
import { UserStore } from '@/stores/module/UserStore'
import { ElNotification ,ElMessage} from 'element-plus'
// =========进行基本的配置===============
// 后端接口的域名设置
// axios.defaults.baseURL = 'http://127.0.0.1:8000'
axios.defaults.baseURL = 'http://192.168.31.203:8000'
// axios.defaults.baseURL = 'http://139.159.205.158:18899'
// 请求成功还是失败的状态码范围
axios.defaults.validateStatus = function(status) {
	return true
}

axios.defaults.withCredentials = true

// 请求拦截器
axios.interceptors.request.use(function(config) {
	// 在发送请求之前做些什么
	if (config.url !== '/api/users/login/') {
		// 在请求配置中添加token
		const ustore = UserStore()
		const token = ustore.token
		config.headers.Authorization = 'Bearer ' + token
	}
	// console.log(config)
	return config;
}, function(error) {
	// 对请求错误做些什么
	return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function(response) {
	
	if (response.status === 200) return response
	if (response.status === 201) return response
	if (response.status === 204) return response
	// 异常响应状态码的处理
	// 判断响应状态码是否为401,并且不是登录接口
	if (response.status === 401) {
		if(response.config.url!='/api/users/login/')
		{
			// console.log('401')
			ElNotification({
				title: '请求失败',
				message: 'token已过期或者未传递过去，您无权限访问接口:' + response.config.url,
				type: 'error',
			})
			router.push({name: 'login'})
		}
	
	} else if (response.status === 400) {
		ElMessage({
			message: response.data,
			type: 'warning',
			duration: 1000
		});
	} else if (response.status === 500) {
		ElMessage({
			message: '【code:5000】服务端异常！',
			type: 'warning',
			duration: 1000
		});
	} else {
		// 其他的响应状态码提示
		ElMessage({
			message: response.data.detail,
			type: 'warning',
			duration: 1000
		});
	}
	return response;
});

// 后端请求的接口
export default {
	// 登录接口
	loginApi(params) {
		return axios.post('/api/users/login/', params)
	},
	// 校验token是否有效
	verifyTokenApi(params) {
		return axios.post('api/users/token/verify/', params)
	},
	// 获取项目列表的接口
	getProListApi() {
		return axios.get('/api/testPro/projects/')
	},
	// 添加项目
	createProApi(params) {
		return axios.post('/api/testPro/projects/', params)
	},
	// 删除项目
	deleteProApi(id) {
		return axios.delete(`/api/testPro/projects/${id}/`)
	},
	// 编辑项目的接口
	editProApi(id, params) {
		return axios.patch(`/api/testPro/projects/${id}/`, params)
	},
	// 获取单个项目详细信息
	getProInfoApi(id) {
		return axios.get(`/api/testPro/projects/${id}/`)
	},

	// 获取测试环境列表
	getEvnListApi(pro_id) {
		return axios.get('/api/testPro/envs/', {
			params: {
				project: pro_id
			}
		})
	},
	// 添加测试环境
	addEvnApi(params) {
		return axios.post('/api/testPro/envs/', params)
	},
	// 修改测试环境
	updateEvnApi(env_id, params) {
		return axios.patch(`/api/testPro/envs/${env_id}/`, params)
	},
	// 删除测试环境
	deleteEnvApi(env_id) {
		return axios.delete(`/api/testPro/envs/${env_id}/`)
	},


	// 添加接口
	createInterFaceApi(params) {
		return axios.post('/api/TestInterFace/interfaces/', params)
	},
	// 获取接口列表
	getInterFaceListApi(pro_id) {
		return axios.get('/api/TestInterFace/interfaces/', {
			params: {
				project: pro_id
			}
		})
	},
	// 编辑接口
	editInterFaceApi(id, params) {
		return axios.patch(`/api/TestInterFace/interfaces/${id}/`, params)
	},
	// 删除接口
	deleteInterFaceApi(id) {
		return axios.delete(`/api/TestInterFace/interfaces/${id}/`)
	},
	// ==========接口用例运行==========
	runInterFaceCaseApi(params) {
		return axios.post('/api/TestInterFace/cases/run/', params)
	},
	// 获取用例详情的接口
	getCaseInfoAPi(id) {
		return axios.get(`/api/TestInterFace/cases/${id}/`)
	},
	// 添加测试用例
	createCaseApi(params) {
		return axios.post('/api/TestInterFace/cases/', params)
	},
	// 修改用例
	updateCaseApi(id, params) {
		return axios.patch(`/api/TestInterFace/cases/${id}/`, params)
	},
	// 删除用例
	deleteCaseApi(id) {
		return axios.delete(`/api/TestInterFace/cases/${id}/`)
	},

	// ==================测试业务流相关的接口===================
	// 获取测试业务流列表 ``/api/testFlow/scenes/``
	getSceneListApi(params) {
		return axios.get(`/api/testFlow/scenes/`, {
			params: params
		})
	},
	// 添加测试业务流
	createSceneApi(params) {
		return axios.post(`/api/testFlow/scenes/`, params)
	},
	// 删除测试业务流
	deleteSceneApi(scene_id) {
		return axios.delete(`/api/testFlow/scenes/${scene_id}/`)
	},
	updateSceneApi(scene_id, param) {
		return axios.patch(`/api/testFlow/scenes/${scene_id}/`, param)
	},

	// 运行测试业务流
	runTestSceneApi(params) {
		return axios.post('/api/testFlow/scenes/run/', params)
	},

	// 获取业务流中的所有用例 /api/testFlow/icases/
	getSceneCaseListApi(sceneId) {
		return axios.get(`/api/testFlow/icases/`, {
			params: {
				scene: sceneId
			}
		})
	},
	// 往业务流中添加用例(步骤)
	addCaseToSceneApi(params) {
		return axios.post('/api/testFlow/icases/', params)
	},

	// 删除业务流中的用例(步骤)
	deleteCaseFormScene(id) {
		return axios.delete(`/api/testFlow/icases/${id}/`)
	},
	// 修改业务流中用例执行的顺序
	SceneCaseSortApi(params) {
		return axios.patch('/api/testFlow/icases/order/', params)
	},


	//获取所有测试运行记录的接口
	getAllRecords(params) {
		return axios.get('/api/testTask/records/', {
			params: params
		})
	},
	getRecordsInfo(id) {
		return axios.get(`/api/testTask/records/${id}/`)
	},
	// 测试计划(任务)相关接口的接口
	// 获取任务(计划)列表
	getTaskList(proId) {
		return axios.get('/api/testTask/tasks/', {
			params: proId
		})
	},

	// 创建测试任务(计划)
	createTask(params) {
		return axios.post(`/api/testTask/tasks/`, params)
	},
	// 修改测试任务(计划)
	updateTask(id, params) {
		return axios.patch(`/api/testTask/tasks/${id}/`, params)
	},
	// 删除测试任务(计划)
	deleteTask(id) {
		return axios.delete(`/api/testTask/tasks/${id}/`)
	},
	// 获取单个测试任务(计划)
	getTaskInfo(id) {
		return axios.get(`/api/testTask/tasks/${id}/`)
	},
	// 运行测试计划
	runTask(params) {
		return axios.post(`/api/testTask/tasks/run/`, params)
	},
	// 获取测试报告数据
	getTaskReport(recordsId) {
		return axios.get(`/api/testTask/report/${recordsId}/`)
	},
	// ========定时任务相关接口====
	//获取定时任务列表
	getCrons(projectId) {
		return axios.get(`/api/crontab/cronjob/`, {
			params: {
				project: projectId
			}
		})
	},
	// 删除定时任务
	delCron(id) {
		return axios.delete(`/api/crontab/cronjob/${id}/`)
	},
	// 添加定时任务
	createCron(params) {
		return axios.post(`/api/crontab/cronjob/`, params)
	},
	// 修改定时任务
	updateCron(id, params) {
		return axios.patch(`/api/crontab/cronjob/${id}/`, params)
	},
	//bug管理相关的接口
	//=====================bug管理======================
	// 获取所有bug
	getBugs(params) {
		return axios.get(`/api/bug/bugs/`, {
			params: params
		})
	},
	// 提交bug记录
	createBugs(params) {
		return axios.post(`/api/bug/bugs/`, params)
	},
	// 修改bug状态
	updateBug(id, params) {
		return axios.patch(`/api/bug/bugs/${id}/`, params)
	},
	// 查看bug详情
	getBugInfo(id) {
		return axios.get(`/api/bug/bugs/${id}/`)
	},
	// 文件管理
	// 上传文件接口信息
	uploadApi: {
		url: axios.defaults.baseURL + `/api/testPro/files/`,

	},
	// 获取文件列表
	getFiles() {
		return axios.get(`/api/testPro/files/`)
	},
	// 删除文件
	deleteFile(id) {
		return axios.delete(`/api/testPro/file/${id}/`)
	},
	
	//发送飞书结果
	sendFeishu(params){
		return axios.post(`/api/sendfeishu/`,params)
	},
	
	//查看资源文件
	getfile(name){
		return axios.get(`/files/${name}`)
	},
	
	// 测试工具--添加通话记录
	addCall(params){
		return axios.post(`/api/add_call/`,params)
	}
	












}