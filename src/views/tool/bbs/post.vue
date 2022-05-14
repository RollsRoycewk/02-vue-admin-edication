<template>
	<div class="app-container">
		<div class="filter-container" style="display: flex; justify-content: space-between">
			<el-button class="filter-item" style="margin-left: 10px" type="primary" @click="backToList">
				返回社区列表
			</el-button>
		</div>

		<el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
			<el-table-column label="帖子内容" min-width="180px">
				<template slot-scope="{ row }">
					<el-tag type="danger" size="normal" v-if="row.is_top">置顶</el-tag>
					<div v-for="(item, index) in row.content" :key="index">
						<p v-html="item.text"></p>
						<el-image
							v-for="(img, imgI) in item.images"
							:key="imgI"
							:src="img"
							:lazy="true"
							style="max-width: 30%; margin-right: 10px"
						></el-image>
					</div>
				</template>
			</el-table-column>

			<el-table-column label="用户" width="110px" align="center">
				<template slot-scope="{ row }">
					<span>{{ row.user.nickname || row.user.username }}</span>
				</template>
			</el-table-column>

			<el-table-column label="创建时间" width="150px" align="center">
				<template slot-scope="{ row }">
					<span>{{ row.created_time }}</span>
				</template>
			</el-table-column>

			<el-table-column label="点赞数" class-name="status-col" width="100">
				<template slot-scope="{ row }">
					{{ row.support_count }}
				</template>
			</el-table-column>

			<el-table-column label="评论数" class-name="status-col" width="100">
				<template slot-scope="{ row }">
					{{ row.comment_count }}
				</template>
			</el-table-column>

			<el-table-column label="操作" align="center" width="280" class-name="small-padding fixed-width">
				<template slot-scope="{ row, $index }">
					<el-button type="primary" size="mini" @click="openComment(row)">查看回复</el-button>
					<el-button size="mini" :type="row.is_top ? 'default' : 'success'" @click="handleIsTop(row)">
						{{ row.is_top ? '取消置顶' : '置顶' }}
					</el-button>

					<el-button size="mini" type="danger" @click="handleDelete(row, $index)">删除</el-button>
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

		<comment ref="comment"></comment>
	</div>
</template>

<script>
let id = 0;
import { fetchPostList, deletePost } from '@/api/bbs';

import Pagination from '@/components/Pagination'; // secondary package based on el-pagination
import comment from './components/comment';

export default {
	components: { Pagination, comment },
	data() {
		return {
			listLoading: false,
			list: [],
			total: 0,
			listQuery: {
				page: 1,
				limit: 20
			}
		};
	},
	methods: {
		backToList() {
			this.$router.go(-1);
		},
		getList() {
			this.listLoading = true;
			fetchPostList(this.listQuery).then((response) => {
				this.list = response.data.items;
				this.total = response.data.total;

				// Just to simulate the time of the request
				setTimeout(() => {
					this.listLoading = false;
				}, 1.5 * 1000);
			});
		},
		handleDelete(row, index) {
			this.$confirm('是否要删除该社区', '提示', {
				confirmButtonText: '删除',
				cancelButtonText: '取消',
				type: 'warning'
			}).then((action) => {
				deletePost(row).then((response) => {
					this.$notify({
						title: '提示',
						message: '删除成功',
						type: 'success',
						duration: 2000
					});
					this.list.splice(index, 1);
				});
			});
		},
		handleIsTop(row) {
			this.$message({
				message: '操作Success',
				type: 'success'
			});
			row.is_top = row.is_top == 1 ? 0 : 1;
		},
		openComment(row) {
			this.$refs.comment.open(row.id);
		}
	},
	created() {
		this.getList();
	}
};
</script>

<style lang="scss" scoped></style>
