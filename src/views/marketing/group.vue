<template>
	<div class="app-container">
		<div class="filter-container" style="display: flex; justify-content: space-between">
			<el-button class="filter-item" style="margin-left: 10px" type="primary" icon="el-icon-edit" @click="handleCreate">
				创建拼团
			</el-button>
		</div>

		<el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
			<el-table-column label="拼团内容" min-width="180px">
				<template slot-scope="{ row }">
					<div style="display: flex">
						<img :src="row.value.cover" style="width: 100px; height: 50px" />
						<div style="margin-left: 10px">
							<div>{{ row.value.title }}</div>
							<small style="display: block">
								原始价格：
								<span style="color: red">￥{{ row.value.price }}</span>
							</small>
							<small style="display: block">
								拼团价格：
								<span style="color: red">￥{{ row.price }}</span>
							</small>
						</div>
					</div>
				</template>
			</el-table-column>

			<el-table-column label="成团人数" width="100" align="center">
				<template slot-scope="{ row }">
					<span>{{ row.p_num }}</span>
				</template>
			</el-table-column>

			<el-table-column label="拼团状态" width="100" align="center">
				<template slot-scope="{ row }">
					<span :style="row.time_status == '拼团中' ? 'color:red;' : 'color:#bbbbbb;'">{{ row.time_status }}</span>
				</template>
			</el-table-column>

			<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
				<template slot-scope="{ row, $index }">
					<el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
					<el-button size="mini" type="danger" :disabled="row.status == 0" @click="changeStatus(row)">下架</el-button>
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

		<el-dialog :visible.sync="dialogFormVisible" :title="textMap[dialogStatus]">
			<el-form
				ref="dataForm"
				:rules="rules"
				:model="temp"
				label-position="left"
				label-width="90px"
				style="width: 700px; margin-left: 50px"
			>
				<el-form-item label="类型" prop="type">
					<el-select v-model="temp.type">
						<el-option label="课程" value="course"></el-option>
						<el-option label="专栏" value="column"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item :label="temp.type == 'course' ? '关联课程' : '关联专栏'" prop="value">
					<el-button type="primary" size="mini" @click="connectValue">关联</el-button>
					<div v-if="temp.value" style="display: flex">
						<el-card shadow="always">
							<div>
								<img :src="temp.value.cover" />
							</div>
							<div>{{ temp.value.title }}</div>
							<div style="color: red">￥{{ temp.value.price }}</div>
						</el-card>
					</div>
				</el-form-item>

				<el-form-item label="拼团价" prop="price">
					<el-input-number
						v-model="temp.price"
						size="mini"
						:min="0"
						:step="1"
						:controls="true"
						controls-position="both"
					></el-input-number>
				</el-form-item>

				<el-form-item label="拼团人数" prop="p_num">
					<el-input-number
						v-model="temp.p_num"
						size="mini"
						:min="0"
						:step="1"
						:controls="true"
						controls-position="both"
					></el-input-number>
				</el-form-item>

				<el-form-item label="是否开启凑团" prop="auto">
					<el-radio-group v-model="temp.auto">
						<el-radio :label="0">否</el-radio>
						<el-radio :label="1">是</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="拼团时限" prop="expire">
					<el-radio-group v-model="temp.expire">
						<el-radio :label="24">24小时</el-radio>
						<el-radio :label="48">48小时</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="拼团活动开始时间-结束时间">
					<el-date-picker
						v-model="timerange"
						type="datetimerange"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						value-format="yyyy-MM-dd HH:mm:ss"
					></el-date-picker>
				</el-form-item>
			</el-form>

			<div slot="footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">提交</el-button>
			</div>
		</el-dialog>

		<choose-course ref="chooseCourse"></choose-course>
	</div>
</template>

<script>
import ChooseCourse from '@/components/choose-course/choose-course.vue';

import { fetchGroup, createGroup, updateGroup } from '@/api/marketing';

import Pagination from '@/components/Pagination'; // secondary package based on el-pagination

import util from '@/utils/util.js';

let timeStatusOptions = {
	0: '未开始',
	1: '拼团中',
	2: '已结束',
	3: '已下架'
};

export default {
	components: { Pagination, ChooseCourse },
	data() {
		return {
			listLoading: false,
			list: [],
			listQuery: {
				page: 1,
				limit: 20
			},
			total: 0,
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: '修改',
				create: '新增'
			},
			temp: {
				id: undefined,
				type: 'course',
				// 关联课程/专栏
				value: null,
				price: 0.0,
				p_num: 2,
				auto: 1,
				expire: 24,
				start_time: '',
				end_time: ''
			},
			rules: {
				type: [
					{
						required: true,
						message: '类型不能为空',
						trigger: 'change'
					}
				],
				// 关联课程/专栏
				value: [
					{
						required: true,
						message: '关联课程/专栏不能为空',
						trigger: 'blur'
					}
				],
				price: [
					{
						required: true,
						message: '拼团价不能为空',
						trigger: 'blur'
					}
				],
				p_num: [
					{
						required: true,
						message: '拼团人数不能为空',
						trigger: 'blur'
					}
				],
				expire: [
					{
						required: true,
						message: '拼团时限不能为空',
						trigger: 'blur'
					}
				]
			}
		};
	},
	computed: {
		timerange: {
			get() {
				return [this.temp.start_time, this.temp.end_time];
			},
			set(val) {
				this.temp.start_time = val[0];
				this.temp.end_time = val[1];
			}
		}
	},
	created() {
		this.getList();
	},
	methods: {
		resetTemp() {
			this.temp = {
				id: undefined,
				type: 'course',
				// 关联课程/专栏
				value: null,
				price: 0.0,
				p_num: 2,
				auto: 1,
				expire: 24,
				start_time: '',
				end_time: ''
			};
		},
		updateData() {
			this.$refs['dataForm'].validate((valid) => {
				if (valid) {
					const tempData = Object.assign({}, this.temp);
					updateGroup(tempData).then(() => {
						this.dialogFormVisible = false;
						this.$notify({
							title: '成功',
							message: '修改成功',
							type: 'success',
							duration: 2000
						});
					});
				}
			});
		},
		createData() {
			this.$refs['dataForm'].validate((valid) => {
				if (this.temp.start_time == '' || this.temp.end_time == '') {
					return this.$message({
						message: '活动时间不能为空',
						type: 'warning'
					});
				}
				if (valid) {
					createGroup(this.temp).then(() => {
						this.dialogFormVisible = false;
						this.$notify({
							title: '成功',
							message: '创建成功',
							type: 'success',
							duration: 2000
						});
						this.getList();
					});
				}
			});
		},
		// 关联课程/专栏
		connectValue() {
			this.$refs.chooseCourse.open((val) => {
				let item = val[0];
				this.temp.value = {
					id: item.id,
					title: item.title,
					cover: item.cover,
					price: item.price
				};
				this.$refs.dataForm.clearValidate();
			}, 1);
		},
		// 下架
		changeStatus(row) {
			this.$confirm('是否要下架该活动？', '提示', {
				confirmButtonText: '下架',
				cancelButtonText: '取消',
				type: 'warning'
			}).then((action) => {
				row.status = 0;
				row.time_status = '已下架';
				this.$message({
					message: '下架成功',
					type: 'success'
				});
			});
		},
		handleCreate() {
			this.resetTemp();
			this.dialogStatus = 'create';
			this.dialogFormVisible = true;
			this.$nextTick(() => {
				this.$refs['dataForm'].clearValidate();
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
		getList() {
			this.listLoading = true;
			fetchGroup(this.listQuery).then((response) => {
				console.log(response);
				this.list = response.data.items.map((item) => {
					let k = util.formatGroupStatus(item);
					item.time_status = timeStatusOptions[k];
					return item;
				});
				this.total = response.data.total;

				// Just to simulate the time of the request
				setTimeout(() => {
					this.listLoading = false;
				}, 1.5 * 1000);
			});
		}
	}
};
</script>

<style></style>
