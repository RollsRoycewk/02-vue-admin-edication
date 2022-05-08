<template>
	<div class="app-container">
		<div style="display: flex; justify-content: space-between; padding-bottom: 20px">
			<div>
				<el-button style="margin-left: 10px" type="primary" size="mini" @click="handleCreate">新增题目</el-button>
				<el-button style="margin-left: 10px" type="success" size="mini">导入题目</el-button>
				<el-button style="margin-left: 10px" type="danger" size="mini">批量删除</el-button>
			</div>

			<div>
				<el-select
					size="small"
					v-model="listQuery.type"
					placeholder="题目类型"
					clearable
					style="width: 120px; margin-right: 10px"
					class="filter-item"
				>
					<el-option v-for="(item, k) in typeOptions" :key="k" :label="item" :value="k" />
				</el-select>
				<el-input
					size="small"
					v-model="listQuery.title"
					placeholder="题目标题"
					style="width: 200px; margin-right: 10px"
					class="filter-item"
					@keyup.enter.native="handleFilter"
				/>
				<el-button size="mini" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
					搜索
				</el-button>
			</div>
		</div>

		<!-- 表格 -->
		<el-table v-loading="listLoading" :data="list" border fit highlight-current-row>
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column label="类型" width="110px" align="center">
				<template slot-scope="{ row }">
					<span>{{ row.type | typeFilter }}</span>
				</template>
			</el-table-column>

			<el-table-column label="题目" min-width="180px">
				<template slot-scope="{ row }">
					<div v-html="row.title"></div>
				</template>
			</el-table-column>

			<el-table-column label="操作" align="center" width="230" class-name="fixed-width">
				<template slot-scope="{ row, $index }">
					<el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
					<el-popconfirm title="是否要删除该记录？" @onConfirm="handleDelete(row, $index)" style="margin-left: 10px">
						<el-button v-if="row.status != 'deleted'" size="mini" type="danger" slot="reference">删除</el-button>
					</el-popconfirm>
				</template>
			</el-table-column>
		</el-table>

		<!-- 分页 -->
		<pagination
			v-show="total > 0"
			:total="total"
			:page.sync="listQuery.page"
			:limit.sync="listQuery.limit"
			@pagination="getList"
		/>

		<!-- 弹框 -->
		<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
			<el-form
				ref="dataForm"
				:rules="rules"
				:model="temp"
				label-position="left"
				label-width="100px"
				style="margin-left: 50px"
			>
				<el-form-item label="题目" prop="title">
					<TinymcePlus v-model="temp.title" :width="800" :height="200"></TinymcePlus>
				</el-form-item>

				<el-form-item label="题目类型" prop="type">
					<el-radio-group v-model="temp.type" size="small" @change="handleTypeChange">
						<el-radio-button :label="key" v-for="(val, key) in typeOptions" :key="key">{{ val }}</el-radio-button>
					</el-radio-group>
				</el-form-item>

				<el-form-item label="题目答案">
					<el-table :data="temp.value.options" style="width: 100%" border>
						<el-table-column label="是否答案" width="80" align="center" v-if="temp.type != 'answer'">
							<template slot-scope="{ row, $index }">
								<el-radio
									v-if="temp.type == 'radio' || temp.type == 'trueOrfalse'"
									v-model="temp.value.value"
									:label="$index"
								>
									{{ $index | indexFilter }}
								</el-radio>
								<el-checkbox v-else-if="temp.type == 'checkbox'" v-model="temp.value.value" :label="$index">
									{{ $index | indexFilter }}
								</el-checkbox>
								<span v-else>{{ $index + 1 }}</span>
							</template>
						</el-table-column>

						<el-table-column label="答案">
							<template slot-scope="{ row, $index }">
								<tinymce-plus v-model="temp.value.options[$index]" :width="800" :height="200" />
							</template>
						</el-table-column>

						<el-table-column width="80" align="center" v-if="temp.type != 'answer' && temp.type != 'trueOrfalse'">
							<template slot-scope="{ row, $index }">
								<el-popconfirm title="是否要删除该记录？" @onConfirm="delQuestion($index)">
									<span slot="reference" class="el-icon-delete-solid"></span>
								</el-popconfirm>
							</template>
						</el-table-column>
					</el-table>

					<div
						class="add-questionval"
						@click="addQuestionVal"
						v-if="temp.type != 'answer' && temp.type != 'trueOrfalse'"
					>
						+ 增加一个答案
					</div>
				</el-form-item>

				<el-form-item label="解析">
					<tinymce-plus v-model="temp.title" :width="800" :height="200" />
				</el-form-item>
			</el-form>

			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取消</el-button>
				<el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">提交</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { fetchQuestion, createQuestion, updateQuestion, deleteQuestion } from '@/api/question';

import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import TinymcePlus from '@/components/TinymcePlus';

const typeOptions = {
	radio: '单选题',
	checkbox: '多选题',
	trueOrfalse: '判断题',
	answer: '问答题',
	completion: '填空题'
};
const indexOptions = {
	0: 'A',
	1: 'B',
	2: 'C',
	3: 'D',
	4: 'E',
	5: 'F',
	6: 'G',
	7: 'H',
	8: 'I',
	9: 'J'
};

const valueOptions = {
	radio: {
		value: 0,
		options: ['选项1', '选项2']
	},
	checkbox: {
		value: [],
		options: ['选项1', '选项2', '选项3']
	},
	trueOrfalse: {
		value: 0,
		options: ['正确', '错误']
	},
	answer: {
		options: ['答案内容']
	},
	completion: {
		options: ['填空1', '填空2']
	}
};

export default {
	components: {
		Pagination,
		TinymcePlus
	},
	data() {
		return {
			dialogFormVisible: false,
			dialogStatus: '',
			textMap: {
				update: '修改',
				create: '新增'
			},
			typeOptions,
			list: null,
			total: 0,
			listLoading: false,
			listQuery: {
				page: 1,
				limit: 20,
				type: undefined,
				title: undefined
			},
			multipleSelection: [],
			rules: {
				title: [
					{
						required: true,
						message: '题目标题不能为空',
						trigger: 'blur'
					}
				],
				type: [
					{
						required: true,
						message: '题目类型不能为空',
						trigger: 'change'
					}
				]
			},
			temp: {
				id: undefined,
				title: '',
				type: 'radio',
				value: {
					value: 0,
					options: ['选项1', '选项2']
				},
				remark: ''
			}
		};
	},
	filters: {
		typeFilter(type) {
			return typeOptions[type];
		},
		indexFilter(index) {
			return indexOptions[index];
		}
	},
	created() {
		this.getList();
	},
	methods: {
		addQuestionVal() {
			this.temp.value.options.push('');
		},
		delQuestion(index) {
			this.temp.value.options.splice(index, 1);
		},
		handleTypeChange(type) {
			this.temp.value = JSON.parse(JSON.stringify(valueOptions[type]));
		},
		updateData() {
			this.$refs['dataForm'].validate((valid) => {
				if (valid) {
					const tempData = Object.assign({}, this.temp);
					tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
					updateQuestion(tempData).then(() => {
						const index = this.list.findIndex((v) => v.id === this.temp.id);
						this.list.splice(index, 1, this.temp);
						this.dialogFormVisible = false;
						this.$notify({
							title: 'Success',
							message: 'Update Successfully',
							type: 'success',
							duration: 2000
						});
					});
				}
			});
		},
		createData() {
			this.$refs['dataForm'].validate((valid) => {
				if (valid) {
					this.temp.id = parseInt(Math.random() * 100) + 1024; // mock a id
					this.temp.author = 'vue-element-admin';
					createQuestion(this.temp).then(() => {
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
		handleCreate() {
			// this.resetTemp();
			this.dialogStatus = 'create';
			this.dialogFormVisible = true;
			// this.$nextTick(() => {
			//   this.$refs["dataForm"].clearValidate();
			// });
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		handleFilter() {},
		getList() {
			this.listLoading = true;
			fetchQuestion(this.listQuery).then((response) => {
				console.log(response);
				this.list = response.data.items;
				this.total = response.data.total;

				// Just to simulate the time of the request
				setTimeout(() => {
					this.listLoading = false;
				}, 1.5 * 1000);
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
		handleDelete(row, index) {
			deleteQuestion(row).then((response) => {
				this.$notify({
					title: '提示',
					message: '删除成功',
					type: 'success',
					duration: 2000
				});
				this.list.splice(index, 1);
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.add-questionval {
	text-align: center;
	padding: 10px;
	border: 1px dotted;
	cursor: pointer;
	color: #1890ff;
}
.add-questionval:hover {
	background-color: #fffde7;
}
</style>
