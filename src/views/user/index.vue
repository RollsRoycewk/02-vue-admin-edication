<template>
	<div class="app-container">
		<div class="filter-container" style="display: flex; justify-content: space-between">
			<el-dropdown>
				<el-button type="danger" size="small">
					黑名单设置
					<i class="el-icon-arrow-down el-icon--right"></i>
				</el-button>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item @click.native="changeCommentStatus(true)">禁止评论</el-dropdown-item>
					<el-dropdown-item @click.native="changeAccessStatus(true)">禁止访问</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<div>
				<el-input
					v-model="listQuery.title"
					placeholder="用户名"
					style="width: 200px"
					class="filter-item"
					@keyup.enter.native="handleFilter"
				/>
				<el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
			</div>
		</div>

		<!-- 表格 -->
		<el-table
			v-loading="listLoading"
			:data="list"
			border
			fit
			highlight-current-row
			style="width: 100%"
			ref="multipleTable"
			@selection-change="handleSelectionChange"
		>
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column label="用户" min-width="180px">
				<template slot-scope="{ row }">
					<div style="display: flex; align-items: center">
						<img :src="row.user.avatar" style="width: 50px; height: 50px; margin-right: 10px; border-radius: 100%" />
						<span>{{ row.user.username }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column label="消费总额" width="110px" align="center">
				<template slot-scope="{ row }">
					<span>{{ row.total_consume }}</span>
				</template>
			</el-table-column>
			<el-table-column label="创建时间" width="180px" align="center">
				<template slot-scope="{ row }">
					<span>{{ row.created_time }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
				<template slot-scope="{ row, $index }">
					<el-button type="primary" size="mini" @click="openInfo(row.user.id)">详情</el-button>
					<el-button size="mini" type="success" style="margin-right: 10px">联系用户</el-button>
					<el-dropdown>
						<el-button type="danger" size="mini">
							黑名单设置
							<i class="el-icon-arrow-down el-icon--right"></i>
						</el-button>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item @click.native="changeCommentStatus(row.user.id)">禁止评论</el-dropdown-item>
							<el-dropdown-item @click.native="changeAccessStatus(row.user.id)">禁止访问</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
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
		<info ref="user-info"></info>
	</div>
</template>

<script>
import { fetchList, changeCommentStatus, changeAccessStatus } from '@/api/user';
import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import info from './components/info.vue';

export default {
	created() {
		this.getList();
	},
	components: {
		Pagination,
		info
	},
	data() {
		return {
			listQuery: {
				page: 1,
				limit: 20,
				title: undefined
			},
			listLoading: false,
			list: [],
			total: 0
		};
	},
	methods: {
		getList() {
			this.listLoading = true;
			fetchList(this.listQuery).then((response) => {
				console.log(response);
				this.list = response.data.items;
				this.total = response.data.total;

				// Just to simulate the time of the request
				this.listLoading = false;
				// setTimeout(() => {
				// 	this.listLoading = false;
				// }, 1.5 * 1000);
			});
		},
		handleFilter() {
			this.listQuery.page = 1;
			this.getList();
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
		},
		openInfo(id) {
			this.$refs['user-info'].open(id);
		},
		changeCommentStatus(ids) {
			if (typeof ids == 'boolean' && !this.multipleSelection.length) {
				return this.$message({
					message: '请先选中需要操作的用户',
					type: 'error'
				});
			}
			let id = typeof ids == 'boolean' ? this.multipleSelection.map((item) => item.id) : ids;
			let allText = typeof ids == 'boolean' ? '选中' : '当前';
			this.$confirm('是否要禁止' + allText + '用户评论？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then((action) => {
				this.listLoading = true;
				changeCommentStatus({
					id,
					status: 0
				}).then((res) => {
					this.$message({
						message: '操作成功',
						type: 'success'
					});
					this.$refs.multipleTable.clearSelection();
					this.listLoading = false;
				});
			});
		},
		changeAccessStatus(ids) {
			if (typeof ids == 'boolean' && !this.multipleSelection.length) {
				return this.$message({
					message: '请先选中需要操作的用户',
					type: 'error'
				});
			}
			let id = typeof ids == 'boolean' ? this.multipleSelection.map((item) => item.id) : ids;
			let allText = typeof ids == 'boolean' ? '选中' : '当前';
			this.$confirm('是否要禁止' + allText + '用户访问？', '提示', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				type: 'warning'
			}).then((action) => {
				this.listLoading = true;
				changeAccessStatus({
					id,
					status: 0
				}).then((res) => {
					this.$message({
						message: '操作成功',
						type: 'success'
					});
					this.$refs.multipleTable.clearSelection();
					this.listLoading = false;
				});
			});
		}
	}
};
</script>

<style></style>
