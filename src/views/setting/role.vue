<template>
	<div class="app-container">
		<el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
			<el-table-column label="角色KEY" min-width="180px">
				<template slot-scope="{ row }">
					{{ row.role_id }}
				</template>
			</el-table-column>
			<el-table-column label="角色名称" class-name="status-col" width="100">
				<template slot-scope="{ row }">
					{{ row.name }}
				</template>
			</el-table-column>
			<el-table-column label="角色描述" width="150px" align="center">
				<template slot-scope="{ row }">
					<span>{{ row.desc }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
				<template slot-scope="{ row, $index }">
					<el-button type="primary" size="mini" @click="openSetRoles(row)">查看权限</el-button>
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

		<el-dialog title="查看权限" :visible.sync="rolesVisible">
			<el-form ref="dataForm" label-position="left" label-width="70px" style="margin-left: 50px">
				<el-form-item label="角色名称">超级管理员</el-form-item>
				<el-form-item label="菜单">
					<el-tree :data="data" :props="defaultProps"></el-tree>
				</el-form-item>
				<el-form-item label="权限">
					<el-tree :data="data" :props="defaultProps"></el-tree>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
import { fetchRole } from '@/api/user';

// import waves from '@/directive/waves'; // waves directive
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination

export default {
	name: 'ComplexTable',
	components: {
		Pagination
	},
	// directives: {
	// 	waves
	// },
	data() {
		return {
			data: [
				{
					label: '一级 1',
					children: [
						{
							label: '二级 1-1',
							children: [
								{
									label: '三级 1-1-1'
								}
							]
						}
					]
				},
				{
					label: '一级 2',
					children: [
						{
							label: '二级 2-1',
							children: [
								{
									label: '三级 2-1-1'
								}
							]
						},
						{
							label: '二级 2-2',
							children: [
								{
									label: '三级 2-2-1'
								}
							]
						}
					]
				},
				{
					label: '一级 3',
					children: [
						{
							label: '二级 3-1',
							children: [
								{
									label: '三级 3-1-1'
								}
							]
						},
						{
							label: '二级 3-2',
							children: [
								{
									label: '三级 3-2-1'
								}
							]
						}
					]
				}
			],
			defaultProps: {
				children: 'children',
				label: 'label'
			},

			roles: [
				{
					id: 1,
					name: '超级管理员'
				},
				{
					id: 2,
					name: '运营'
				}
			],
			roleTemp: {
				role_ids: []
			},
			rolesVisible: false,

			tableKey: 0,
			list: null,
			total: 0,
			listLoading: true,
			listQuery: {
				page: 1,
				limit: 20
			}
		};
	},
	created() {
		this.getList();
	},
	methods: {
		openSetRoles(row) {
			this.rolesVisible = true;
		},
		handleSetRoles() {
			this.rolesVisible = false;
		},
		getList() {
			console.log('完243534');
			this.listLoading = true;
			fetchRole(this.listQuery).then((response) => {
				console.log('sadsadaf', response);
				this.list = response.data.items;
				this.total = response.data.total;

				this.listLoading = false;
			});
		}
	}
};
</script>
