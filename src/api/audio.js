import request from '@/utils/request';

export function fetchList(query) {
	return request({
		url: '/vue-element-admin/audio/list',
		method: 'get',
		params: query
	});
}

export function createCourse(data) {
	return request({
		url: '/vue-element-admin/audio/create',
		method: 'post',
		data
	});
}

export function updateCourse(data) {
	return request({
		url: '/vue-element-admin/audio/update',
		method: 'post',
		data
	});
}

export function deleteCourse(data) {
	return request({
		url: '/vue-element-admin/audio/delete',
		method: 'post',
		data
	});
}
