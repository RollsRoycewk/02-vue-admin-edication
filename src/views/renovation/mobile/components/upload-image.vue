<template>
	<div>
		<el-dialog
			title="上传图片"
			:visible.sync="uploadDialogVisible"
			append-to-body
			:modal-append-to-body="false"
			width="60%"
			@close="onClose"
		>
			<el-upload
				action="/upload/"
				list-type="picture-card"
				:on-preview="handlePictureCardPreview"
				:on-success="handleOnSuccess"
				:on-remove="handleRemove"
				:file-list="fileList"
			>
				<i class="el-icon-plus"></i>
			</el-upload>
		</el-dialog>
		<el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false" append-to-body>
			<img width="100%" :src="dialogImageUrl" alt="" />
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			uploadDialogVisible: false,
			dialogImageUrl: '',
			dialogVisible: false,
			callback: null,
			fileList: []
		};
	},
	methods: {
		handlePictureCardPreview(file) {
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		handleOnSuccess(response, file, fileList) {
			this.callback(response.data);
			this.uploadDialogVisible = false;
		},
		handleRemove() {},
		onClose() {
			this.fileList = [];
		},
		open(callback, url = false) {
			this.callback = callback;
			if (url) {
				this.fileList.push({
					name: url,
					url
				});
			}
			this.uploadDialogVisible = true;
		}
	}
};
</script>

<style></style>
