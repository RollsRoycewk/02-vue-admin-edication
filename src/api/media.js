import request from '@/utils/request';

export function fetchList(query) {
	return request({
		url: '/vue-element-admin/media/list',
		method: 'get',
		params: query
	});
}

export function createCourse(data) {
	return request({
		url: '/vue-element-admin/media/create',
		method: 'post',
		data
	});
}

export function updateCourse(data) {
	return request({
		url: '/vue-element-admin/media/update',
		method: 'post',
		data
	});
}

export function deleteCourse(data) {
	return request({
		url: '/vue-element-admin/media/delete',
		method: 'post',
		data
	});
}
