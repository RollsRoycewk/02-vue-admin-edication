<template>
	<div class="app-container">
		<div class="filter-container" style="display: flex; justify-content: space-between">
			<el-button class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">
				新增专栏
			</el-button>

			<div>
				<el-select
					v-model="listQuery.status"
					placeholder="商品状态"
					clearable
					style="width: 90px; margin-right: 10px"
					class="filter-item"
				>
					<el-option v-for="(item, k) in statusOptions" :key="k" :label="item" :value="k" />
				</el-select>
				<el-input
					v-model="listQuery.title"
					placeholder="标题"
					style="width: 200px"
					class="filter-item"
					@keyup.enter.native="handleFilter"
				/>

				<el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
					搜 索
				</el-button>
			</div>
		</div>

		<el-table
			:key="tableKey"
			v-loading="listLoading"
			:data="list"
			border
			fit
			highlight-current-row
			style="width: 100%"
			@sort-change="sortChange"
		>
			<el-table-column
				label="ID"
				prop="id"
				sortable="custom"
				align="center"
				width="80"
				:class-name="getSortClass('id')"
			>
				<template slot-scope="{ row }">
					<span>{{ row.id }}</span>
				</template>
			</el-table-column>
			<el-table-column label="专栏内容">
				<template slot-scope="{ row }">
					<div style="display: flex">
						<img :src="row.cover" style="width: 100px; height: 50px; margin-right: 10px" />
						<div style="display: flex; flex-direction: column">
							<span>{{ row.title }}</span>
							<span style="color: red">￥{{ row.price }}</span>
						</div>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="更新状态" width="110px" align="center">
				<template slot-scope="{ row }">
					<span :style="row.isend ? 'color:#333;' : 'color:red;'">{{ row.isend ? '已完结' : '连载中' }}</span>
				</template>
			</el-table-column>
			<el-table-column label="订阅量" width="110px" align="center">
				<template slot-scope="{ row }">
					<span>{{ row.sub_count }}</span>
				</template>
			</el-table-column>
			<el-table-column label="状态" class-name="status-col" width="100">
				<template slot-scope="{ row }">
					<el-tag :type="row.status ? 'success' : 'danger'">
						{{ row.status | statusFilter }}
					</el-tag>
				</template>
			</el-table-column>

			<el-table-column label="创建时间" width="150px" align="center">
				<template slot-scope="{ row }">
					<span>{{ row.create_time }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
				<template slot-scope="{ row, $index }">
					<el-button type="warning" size="mini" @click="openDetail(row)">目录</el-button>
					<el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
					<el-button v-if="row.status == 0" size="mini" type="success" @click="handleModifyStatus(row, 1)">
						上架
					</el-button>
					<el-button v-if="row.status == 1" size="mini" @click="handleModifyStatus(row, 0)">下架</el-button>
					<el-popconfirm title="是否要删除该记录？" @onConfirm="handleDelete(row, $index)" style="margin-left: 10px">
						<el-button v-if="row.status != 'deleted'" size="mini" type="danger" slot="reference">删除</el-button>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>

		<pagination
			v-show="total > 0"
			:total="total"
			:page.sync="listQuery.page"
			:limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<!-- 全屏弹框 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" fullscreen>
			<el-form
				ref="dataForm"
				:rules="rules"
				:model="temp"
				label-position="left"
				label-width="70px"
				style="width: 400px; margin-left: 50px"
			>
				<el-form-item label="标题" prop="title" label-width="100px">
					<el-input v-model="temp.title" />
				</el-form-item>
				<el-form-item label="封面" label-width="100px">
					<el-upload
						action="https://jsonplaceholder.typicode.com/posts/"
						list-type="picture-card"
						:on-preview="handlePictureCardPreview"
						:on-remove="handleUploadRemove"
						:on-success="handleUploadSuccess"
					>
						<i class="el-icon-plus"></i>
					</el-upload>
				</el-form-item>
				<el-form-item label="课程介绍" prop="try" label-width="100px">
					<el-input type="textarea" :rows="3" placeholder="请输入课程介绍" v-model="temp.try">/</el-input>
				</el-form-item>
				<el-form-item label="课程内容" prop="content" label-width="100px">
					<tinymce v-model="temp.content" :height="300" :width="600" />
				</el-form-item>
				<el-form-item label="课程价格" label-width="100px">
					<el-input-number v-model="temp.price" :min="0" label="价格"></el-input-number>
				</el-form-item>
				<el-form-item label="状态" label-width="100px">
					<el-radio-group v-model="temp.status">
						<el-radio :label="0">下架</el-radio>
						<el-radio :label="1">上架</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="更新状态" label-width="100px">
					<el-radio-group v-model="temp.isend">
						<el-radio :label="0">连载中</el-radio>
						<el-radio :label="1">已完结</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">Cancel</el-button>
				<el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateCourse()">Confirm</el-button>
			</div>
		</el-dialog>

		<el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
			<el-table :data="pvData" border fit highlight-current-row style="width: 100%">
				<el-table-column prop="key" label="Channel" />
				<el-table-column prop="pv" label="Pv" />
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import { fetchList } from '@/api/column';

import { createCourse, updateCourse } from '@/api/column';
import waves from '@/directive/waves'; // waves directive
import { parseTime } from '@/utils';
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination

const statusOptions = {
	0: '已下架',
	1: '已上架'
};

import Tinymce from '@/components/Tinymce';
export default {
	name: 'ComplexTable',
	components: { Pagination, Tinymce },
	directives: { waves },
	filters: {
		statusFilter(status) {
			return statusOptions[status];
		}
	},
	data() {
		return {
			tableKey: 0,
			list: null,
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20,
				importance: undefined,
				title: undefined
			},
			// importanceOptions: [1, 2, 3],
			// calendarTypeOptions,
			sortOptions: [
				{ label: 'ID Ascending', key: '+id' },
				{ label: 'ID Descending', key: '-id' }
			],
			statusOptions,
			temp: {
				id: undefined,
				title: '',
				status: 1,
				price: 0,
				try: '',
				content: '',
				cover: '',
				isend: 0
			},
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: '修改',
				create: '新增'
			},
			dialogPvVisible: false,
			pvData: [],
			rules: {
				title: [
					{
						required: true,
						message: '标题不能为空',
						trigger: 'blur'
					}
				],
				try: [
					{
						required: true,
						message: '试看内容不能为空',
						trigger: 'blur'
					}
				],
				content: [
					{
						required: true,
						message: '课程内容不能为空',
						trigger: 'blur'
					}
				]
			},
			dialogImageUrl: '',
			dialogVisible: false,
			downloadLoading: false,
			fileList: [
				{
					name: 'food.mp4',
					url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
				}
			]
		};
	},
	created() {
		this.getList();
	},
	methods: {
		handleRemove(file, fileList) {
			console.log(file, fileList);
		},
		getList() {
			this.listLoading = true;
			fetchList(this.listQuery).then((response) => {
				this.list = response.data.items;
				this.total = response.data.total;

				// Just to simulate the time of the request
				setTimeout(() => {
					this.listLoading = false;
				}, 1.5 * 1000);
			});
		},
		handleFilter() {
			this.listQuery.page = 1;
			this.getList();
		},
		handleModifyStatus(row, status) {
			this.$message({
				message: '操作Success',
				type: 'success'
			});
			row.status = status;
		},
		sortChange(data) {
			const { prop, order } = data;
			if (prop === 'id') {
				this.sortByID(order);
			}
		},
		sortByID(order) {
			if (order === 'ascending') {
				this.listQuery.sort = '+id';
			} else {
				this.listQuery.sort = '-id';
			}
			this.handleFilter();
		},
		resetTemp() {
			this.temp = {
				id: undefined,
				title: '',
				status: 1,
				price: 0,
				try: '',
				content: '',
				cover: '',
				isend: 0
			};
		},
		handleCreate() {
			this.resetTemp();
			this.dialogStatus = 'create';
			this.dialogFormVisible = true;
			this.$nextTick(() => {
				this.$refs['dataForm'].clearValidate();
			});
		},
		createData() {
			this.$refs['dataForm'].validate((valid) => {
				if (valid) {
					this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
					this.temp.author = 'vue-element-admin';
					createCourse(this.temp).then(() => {
						this.list.unshift(this.temp);
						this.dialogFormVisible = false;
						this.$notify({
							title: 'Success',
							message: 'Created Successfully',
							type: 'success',
							duration: 2000
						});
					});
				}
			});
		},
		handleUpdate(row) {
			this.temp = Object.assign({}, row); // copy obj
			this.temp.timestamp = new Date(this.temp.timestamp);
			this.dialogStatus = 'update';
			this.dialogFormVisible = true;
			this.$nextTick(() => {
				this.$refs['dataForm'].clearValidate();
			});
		},
		updateCourse() {
			this.$refs['dataForm'].validate((valid) => {
				if (valid) {
					const tempData = Object.assign({}, this.temp);
					tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
					updateCourse(tempData).then(() => {
						const index = this.list.findIndex((v) => v.id === this.temp.id);
						this.list.splice(index, 1, this.temp);
						this.dialogFormVisible = false;
						this.$notify({
							title: '更新数据成功',
							message: '更新当前数据成功',
							type: 'success',
							duration: 2000
						});
					});
				}
			});
		},
		handleDelete(row, index) {
			this.$notify({
				title: '提示',
				message: '删除成功',
				type: 'success',
				duration: 2000
			});
			this.list.splice(index, 1);
		},
		handleFetchPv(pv) {
			fetchPv(pv).then((response) => {
				this.pvData = response.data.pvData;
				this.dialogPvVisible = true;
			});
		},
		getSortClass: function (key) {
			const sort = this.listQuery.sort;
			return sort === `+${key}` ? 'ascending' : 'descending';
		},
		handleUploadRemove(file, fileList) {
			console.log(file, fileList);
		},
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		handleUploadSuccess(response, file, fileList) {
			console.log(response, file, fileList);
		},
		handleUploadChange(file, fileList) {
			this.fileList = fileList.slice(-3);
		},
		openDetail(row) {
			this.$router.push({ name: 'ColumnDetail', query: { id: row.id } });
		}
	}
};
</script>
