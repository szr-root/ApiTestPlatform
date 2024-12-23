<template>
	<el-row :gutter="40">
		<el-col :span="15">
			<el-row v-for="(item, index) in params" :key="index" :gutter="5" style="margin-top: 5px;">
				<el-col :span="5"><el-input size="small" v-model="item[0]" placeholder="参数名" clearable /></el-col>
				<el-col :span="4">
					<el-select @change="seleType($event, index)" v-model="paramsType[index]" placeholder="参数类型"
						size="small" style="width: 100%;">
						<el-option label="Text" value="text" />
						<el-option label="File" value="file" />
					</el-select>
				</el-col>
				<el-col :span="11">
					<!-- 文字输入框 -->
					<el-input v-if="paramsType[index] == 'text'" v-model="item[1]" placeholder="参数值" size="small"
						clearable />
					<el-select v-else @change="seleFile($event, index)" v-model="item[1][0]" size="small"
						placeholder="选择已有文件" style="width: 100%;">
						<el-option v-for="item in files" :label="item.info[0]" :value="item.info[0]" />
					</el-select>
				</el-col>
				<el-col :span="4"><el-button icon="Delete" @click="params.splice(index, 1)" size="small"
						type="danger" plain></el-button></el-col>
			</el-row>
			<el-button style="margin-top: 10px;" icon="Plus" @click="params.push(['', ''])" size="small"
				type="primary" plain></el-button>
		</el-col>
		<el-col :span="9">
			<el-card>
				<el-upload class="upload-demo" :action="api.uploadApi.url" :headers="updateHead()" :show-file-list="false"
					:on-success="uploadSuccess" :on-error="uploadError" name="file">
					<el-button type="primary" plain size="small">上传文件</el-button>
				</el-upload>
				<el-table :data="files" style="width: 100%" size="small" height="200px">
					<el-table-column label="已有文件">
						<template #default="scope">
							<el-tag type="success" @click="viewfile( scope.row.info[0] )">{{ scope.row.info[0] }}</el-tag>
						</template>
						
					</el-table-column>
					<el-table-column label="文件类型">
						<template #default="scope">
							<el-tag type="info">{{ scope.row.info[2] }}</el-tag>
						</template>
					</el-table-column>
				</el-table>
				<div><iframe ref="mediaIframe" style="width: 100%; height: 300px;"></iframe></div>
				
			</el-card>
		</el-col>
	</el-row>
</template>

<script setup>
	import axios from 'axios'
	import api from '@/api/index'
	import { UserStore } from '@/stores/module/UserStore'
	import { ElNotification, ElMessageBox,ElMessage } from 'element-plus'
	const ustore = UserStore()
	function updateHead() {
		return {
			Authorization: 'Bearer ' + ustore.token
		};
	}
	
	
</script>


<script>
	export default {
		data() {
			return {
				// 编辑的参数
				params: [],
				// 文件列表
				files: [],
				// 参数类型列表
				paramsType: []
			};
		},
		props: {
			modelValue: {
				type: Array,
				default: [
					['', '']
				]
			}
		},
		emits: ['update:modelValue'],
		methods: {
			viewfile(name){
				console.log(axios.defaults.baseURL)
				const url = this.getImageOrVideoUrl(name);
					this.$refs.mediaIframe.src = url;
			},
			getImageOrVideoUrl(name) {
			      // 获取图片或视频的 URL
			      return axios.defaults.baseURL + `/files/${name}`; // 替换为实际的 URL
			},
			// 修改参数类型
			seleType(val, index) {
				if (val === 'file') {
					this.params[index][1] = ['', '', ''];
				} else {
					this.params[index][1] = '';
				}
			},
			// 修改参数值
			seleFile(val, index) {
				// 当前选中的文件
				const sFile = this.files.find(item => {
					return item.info[0] === val;
				});
				// 修改文件
				this.params[index][1] = [...sFile.info];
				console.log(this.params);
			},
			// 文件上传成功
			uploadSuccess(response) {
				ElMessage({
					type: 'success',
					message: '文件上传成功!',
					duration: 2000
				});
				this.getAllfile();
			},
			// 文件上传失败
			uploadError(error) {
				ElMessage({
					type: 'error',
					message: error,
					duration: 2000
				});
			},
			// 获取文件列表
			async getAllfile() {
				// 获取文件列表
				const response = await api.getFiles();
				if (response.status === 200) {
					this.files = response.data;
				}
			},
			// 获取参数的类型
			getParamsType() {
				// 获取参数类型
				this.paramsType = [];
				this.params.forEach(item => {
					if (typeof item[1] === 'string') {
						this.paramsType.push('text');
					} else {
						this.paramsType.push('file');
					}
				});
			}
		},
		created() {
			if (this.modelValue.length > 0) {
				this.params = this.modelValue;
			} else {
				this.params = [
					['', '']
				];
			}
			this.getAllfile();
			this.getParamsType();
		},
		watch: {
			'params.length': function(val) {
				this.getParamsType();
			},
			params: {
				deep: true,
				handler: function(value) {
					this.$emit('update:modelValue', value);
				}
			},
			modelValue: {
				deep: true,
				handler: function(value) {
					this.params = value;
				}
			}
		}
	};
</script>

<style></style>