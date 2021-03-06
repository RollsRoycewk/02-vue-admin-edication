import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/* Layout */
import Layout from '@/layout';

/* Router Modules */
import componentsRouter from './modules/components';
import chartsRouter from './modules/charts';
import tableRouter from './modules/table';
import nestedRouter from './modules/nested';

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
	{
		path: '/redirect',
		component: Layout,
		hidden: true,
		children: [
			{
				path: '/redirect/:path(.*)',
				component: () => import('@/views/redirect/index')
			}
		]
	},
	{
		path: '/login',
		component: () => import('@/views/login/index'),
		hidden: true
	},
	{
		path: '/',
		component: () => import('@/views/school/index'),
		hidden: true
	},
	{
		path: '/auth-redirect',
		component: () => import('@/views/login/auth-redirect'),
		hidden: true
	},
	{
		path: '/404',
		component: () => import('@/views/error-page/404'),
		hidden: true
	},
	{
		path: '/401',
		component: () => import('@/views/error-page/401'),
		hidden: true
	},
	{
		path: '/dashboard',
		component: Layout,
		redirect: '/dashboard/index',
		children: [
			{
				path: 'dashboard',
				component: () => import('@/views/dashboard/index'),
				name: 'Dashboard',
				meta: { title: '??????', icon: 'dashboard', affix: true }
			}
		]
	},
	// {
	//   path: "/guide",
	//   component: Layout,
	//   redirect: "/guide/index",
	//   children: [
	//     {
	//       path: "index",
	//       component: () => import("@/views/guide/index"),
	//       name: "Guide",
	//       meta: { title: "Guide", icon: "guide", noCache: true },
	//     },
	//   ],
	// },
	{
		path: '/profile',
		component: Layout,
		redirect: '/profile/index',
		hidden: true,
		children: [
			{
				path: 'index',
				component: () => import('@/views/profile/index'),
				name: 'Profile',
				meta: { title: 'Profile', icon: 'user', noCache: true }
			}
		]
	}
];

export const routesList = [
	{
		path: 'media',
		name: 'Media',
		component: () => import('@/views/course/media')
	},
	{
		path: 'audio',
		name: 'Audio',
		component: () => import('@/views/course/audio')
	},
	{
		path: 'video',
		name: 'Video',
		component: () => import('@/views/course/video')
	},
	{
		path: 'column',
		name: 'Column',
		component: () => import('@/views/course/column')
	},
	{
		path: 'column_detail',
		name: 'ColumnDetail',
		component: () => import('@/views/course/column-detail'),
		meta: {
			activeMenu: '/course/column',
			breadcrumb: false
		}
	},
	{
		path: 'bbs',
		name: 'Bbs',
		component: () => import('@/views/tool/bbs/bbs')
	},
	{
		path: 'bbs_post',
		name: 'BbsPost',
		component: () => import('@/views/tool/bbs/post')
	},
	{
		path: 'question',
		name: 'Question',
		component: () => import('@/views/tool/question')
	},
	{
		path: 'testpaper',
		name: 'Testpaper',
		component: () => import('@/views/tool/testpaper/index')
	},
	{
		path: 'testpaper_form',
		name: 'TestpaperForm',
		component: () => import('@/views/tool/testpaper/form')
	},
	{
		path: 'testpaper_test',
		name: 'TestpaperTest',
		component: () => import('@/views/tool/testpaper/test')
	},
	{
		path: 'book',
		name: 'Book',
		component: () => import('@/views/tool/book/index')
	},
	{
		path: 'book_detail',
		name: 'BookDetail',
		component: () => import('@/views/tool/book/detail')
	},
	{
		path: 'user',
		name: 'User',
		component: () => import('@/views/user/index')
	},
	{
		path: 'order',
		name: 'Order',
		component: () => import('@/views/pay/order')
	},
	{
		path: 'assets',
		name: 'Assets',
		component: () => import('@/views/pay/assets')
	},
	{
		path: 'payment',
		name: 'Payment',
		component: () => import('@/views/pay/payment')
	},
	{
		path: 'group',
		name: 'Group',
		component: () => import('@/views/marketing/group')
	},
	{
		path: 'flashsale',
		name: 'Flashsale',
		component: () => import('@/views/marketing/flashsale')
	},
	{
		path: 'coupon',
		name: 'Coupon',
		component: () => import('@/views/marketing/coupon')
	},
	{
		path: 'setting_index',
		name: 'SettingIndex',
		component: () => import('@/views/setting/index')
	},
	{
		path: 'staffs',
		name: 'Staffs',
		component: () => import('@/views/setting/staffs')
	},
	{
		path: 'role',
		name: 'Role',
		component: () => import('@/views/setting/role')
	},
	{
		path: 'mobile_index',
		name: 'MobileIndex',
		component: () => import('@/views/renovation/mobile/index')
	},
	{
		path: 'mobile_edit',
		name: 'MobileEdit',
		component: () => import('@/views/renovation/mobile/edit')
	},
	{
		path: 'pc_index',
		name: 'PcIndex',
		component: () => import('@/views/renovation/pc/index')
	},
	{
		path: 'pc_edit',
		name: 'PcEdit',
		component: () => import('@/views/renovation/pc/edit')
	}
];

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
	{
		path: '/course',
		component: Layout,
		redirect: '/course/media',
		name: 'Course',
		alwaysShow: true,
		meta: {
			title: '??????',
			icon: 'excel',
			roles: ['admin', 'editor']
		},
		children: [
			{
				path: 'media',
				name: 'Media',
				component: () => import('@/views/course/media'),
				meta: {
					title: '??????'
				}
			},
			{
				// hidden: true,
				path: 'audio',
				name: 'Audio',
				component: () => import('@/views/course/audio'),
				meta: {
					title: '??????'
				}
			},
			{
				path: 'video',
				name: 'Video',
				component: () => import('@/views/course/video'),
				meta: {
					title: '??????'
				}
			},
			{
				path: 'column',
				name: 'Column',
				component: () => import('@/views/course/column'),
				meta: {
					title: '??????'
				}
			},
			{
				hidden: true,
				path: 'column-detail',
				name: 'ColumnDetail',
				component: () => import('@/views/course/column-detail'),
				meta: {
					title: '????????????'
				}
			}
		]
	},
	{
		path: '/user',
		component: Layout,
		meta: {
			title: '??????',
			icon: 'user'
		},
		redirect: '/user',
		children: [
			{
				path: 'user',
				name: 'User',
				component: () => import('@/views/user'),
				meta: {
					title: '??????'
				}
			}
		]
	},
	{
		path: '/pay',
		component: Layout,
		meta: {
			title: '??????',
			icon: 'education'
		},
		redirect: '/order',
		children: [
			{
				path: 'order',
				name: 'Order',
				component: () => import('@/views/pay/order'),
				meta: {
					title: '????????????'
				}
			},
			{
				path: 'assets',
				name: 'Assets',
				component: () => import('@/views/pay/assets'),
				meta: {
					title: '????????????'
				}
			},
			{
				path: 'payment',
				name: 'Payment',
				component: () => import('@/views/pay/payment'),
				meta: {
					title: '????????????'
				}
			}
		]
	},
	{
		path: '/renovation',
		component: Layout,
		meta: {
			title: '?????????',
			icon: 'education'
		},
		redirect: '/mobile/index',
		children: [
			{
				path: 'mobile_index',
				name: 'MobileIndex',
				component: () => import('@/views/renovation/mobile/index'),
				meta: {
					title: '?????????'
				}
			},
			{
				path: 'mobile_edit',
				name: 'MobileEdit',
				hidden: true,
				component: () => import('@/views/renovation/mobile/edit'),
				meta: {
					title: '???????????????'
				}
			},
			{
				path: 'pc_index',
				name: 'PcIndex',
				component: () => import('@/views/renovation/pc/index'),
				meta: {
					title: 'PC???'
				}
			},
			{
				path: 'pc_edit',
				name: 'PcEdit',
				hidden: true,
				component: () => import('@/views/renovation/pc/edit'),
				meta: {
					title: 'PC?????????'
				}
			}
		]
	},
	{
		path: '/marketing',
		component: Layout,
		meta: {
			title: '??????',
			icon: 'education'
		},
		redirect: '/marketing/group',
		children: [
			{
				path: 'group',
				name: 'Group',
				component: () => import('@/views/marketing/group'),
				meta: { title: '??????' }
			},
			{
				path: 'flashsale',
				name: 'Flashsale',
				component: () => import('@/views/marketing/flashsale'),
				meta: { title: '??????' }
			},
			{
				path: 'coupon',
				name: 'Coupon',
				component: () => import('@/views/marketing/coupon'),
				meta: { title: '?????????' }
			}
		]
	},
	{
		path: '/tool',
		component: Layout,
		meta: {
			title: '??????',
			icon: 'education'
		},
		redirect: '/bbs',
		children: [
			{
				path: 'bbs',
				name: 'Bbs',
				component: () => import('@/views/tool/bbs/bbs'),
				meta: {
					title: '?????????'
				}
			},
			{
				path: 'bbs_post',
				name: 'BbsPost',
				hidden: true,
				component: () => import('@/views/tool/bbs/post'),
				meta: {
					title: '????????????'
				}
			},
			{
				path: 'question',
				name: 'Question',
				component: () => import('@/views/tool/question'),
				meta: {
					title: '??????'
				}
			},
			{
				path: 'testpaper',
				name: 'Testpaper',
				component: () => import('@/views/tool/testpaper/index'),
				meta: {
					title: '??????'
				}
			},
			{
				path: 'testpaper_form',
				name: 'TestpaperForm',
				hidden: true,
				component: () => import('@/views/tool/testpaper/form'),
				meta: { title: '??????' }
			},
			{
				path: 'testpaper_test',
				name: 'TestpaperTest',
				hidden: true,
				component: () => import('@/views/tool/testpaper/test'),
				meta: { title: '????????????' }
			},
			{
				path: 'book',
				name: 'Book',
				component: () => import('@/views/tool/book/index'),
				meta: { title: '?????????' }
			},
			{
				path: 'book_detail',
				hidden: true,
				name: 'BookDetail',
				component: () => import('@/views/tool/book/detail'),
				meta: {
					title: '???????????????'
				}
			}
		]
	},
	{
		path: '/setting',
		component: Layout,
		meta: {
			title: '??????',
			icon: 'education'
		},
		redirect: '/setting_index',
		children: [
			{
				path: 'setting_index',
				name: 'SettingIndex',
				component: () => import('@/views/setting/index'),
				meta: {
					title: '????????????'
				}
			},
			{
				path: 'staffs',
				name: 'Staffs',
				component: () => import('@/views/setting/staffs'),
				meta: {
					title: '????????????'
				}
			},
			{
				path: 'role',
				name: 'Role',
				component: () => import('@/views/setting/role'),
				meta: {
					title: '????????????'
				}
			}
		]
	},
	//   path: "/permission",
	//   component: Layout,
	//   redirect: "/permission/page",
	//   alwaysShow: true, // will always show the root menu
	//   name: "Permission",
	//   meta: {
	//     title: "Permission",
	//     icon: "lock",
	//     roles: ["admin", "editor"], // you can set roles in root nav
	//   },
	//   children: [
	//     {
	//       path: "page",
	//       component: () => import("@/views/permission/page"),
	//       name: "PagePermission",
	//       meta: {
	//         title: "Page Permission",
	//         roles: ["admin"], // or you can only set roles in sub nav
	//       },
	//     },
	//     {
	//       path: "directive",
	//       component: () => import("@/views/permission/directive"),
	//       name: "DirectivePermission",
	//       meta: {
	//         title: "Directive Permission",
	//         // if do not set roles, means: this page does not require permission
	//       },
	//     },
	//     {
	//       path: "role",
	//       component: () => import("@/views/permission/role"),
	//       name: "RolePermission",
	//       meta: {
	//         title: "Role Permission",
	//         roles: ["admin"],
	//       },
	//     },
	//   ],
	// },

	// {
	//   path: "/icon",
	//   component: Layout,
	//   children: [
	//     {
	//       path: "index",
	//       component: () => import("@/views/icons/index"),
	//       name: "Icons",
	//       meta: { title: "Icons", icon: "icon", noCache: true },
	//     },
	//   ],
	// },

	/** when your routing map is too long, you can split it into small modules **/
	// componentsRouter,
	// chartsRouter,
	// nestedRouter,
	// tableRouter,

	// {
	//   path: "/example",
	//   component: Layout,
	//   redirect: "/example/list",
	//   name: "Example",
	//   meta: {
	//     title: "Example",
	//     icon: "el-icon-s-help",
	//   },
	//   children: [
	//     {
	//       path: "create",
	//       component: () => import("@/views/example/create"),
	//       name: "CreateArticle",
	//       meta: { title: "Create Article", icon: "edit" },
	//     },
	//     {
	//       path: "edit/:id(\\d+)",
	//       component: () => import("@/views/example/edit"),
	//       name: "EditArticle",
	//       meta: {
	//         title: "Edit Article",
	//         noCache: true,
	//         activeMenu: "/example/list",
	//       },
	//       hidden: true,
	//     },
	//     {
	//       path: "list",
	//       component: () => import("@/views/example/list"),
	//       name: "ArticleList",
	//       meta: { title: "Article List", icon: "list" },
	//     },
	//   ],
	// },

	// {
	//   path: "/tab",
	//   component: Layout,
	//   children: [
	//     {
	//       path: "index",
	//       component: () => import("@/views/tab/index"),
	//       name: "Tab",
	//       meta: { title: "Tab", icon: "tab" },
	//     },
	//   ],
	// },

	// {
	//   path: "/error",
	//   component: Layout,
	//   redirect: "noRedirect",
	//   name: "ErrorPages",
	//   meta: {
	//     title: "Error Pages",
	//     icon: "404",
	//   },
	//   children: [
	//     {
	//       path: "401",
	//       component: () => import("@/views/error-page/401"),
	//       name: "Page401",
	//       meta: { title: "401", noCache: true },
	//     },
	//     {
	//       path: "404",
	//       component: () => import("@/views/error-page/404"),
	//       name: "Page404",
	//       meta: { title: "404", noCache: true },
	//     },
	//   ],
	// },

	// {
	//   path: "/error-log",
	//   component: Layout,
	//   children: [
	//     {
	//       path: "log",
	//       component: () => import("@/views/error-log/index"),
	//       name: "ErrorLog",
	//       meta: { title: "Error Log", icon: "bug" },
	//     },
	//   ],
	// },

	// {
	//   path: "/excel",
	//   component: Layout,
	//   redirect: "/excel/export-excel",
	//   name: "Excel",
	//   meta: {
	//     title: "Excel",
	//     icon: "excel",
	//   },
	//   children: [
	//     {
	//       path: "export-excel",
	//       component: () => import("@/views/excel/export-excel"),
	//       name: "ExportExcel",
	//       meta: { title: "Export Excel" },
	//     },
	//     {
	//       path: "export-selected-excel",
	//       component: () => import("@/views/excel/select-excel"),
	//       name: "SelectExcel",
	//       meta: { title: "Export Selected" },
	//     },
	//     {
	//       path: "export-merge-header",
	//       component: () => import("@/views/excel/merge-header"),
	//       name: "MergeHeader",
	//       meta: { title: "Merge Header" },
	//     },
	//     {
	//       path: "upload-excel",
	//       component: () => import("@/views/excel/upload-excel"),
	//       name: "UploadExcel",
	//       meta: { title: "Upload Excel" },
	//     },
	//   ],
	// },

	// {
	//   path: "/zip",
	//   component: Layout,
	//   redirect: "/zip/download",
	//   alwaysShow: true,
	//   name: "Zip",
	//   meta: { title: "Zip", icon: "zip" },
	//   children: [
	//     {
	//       path: "download",
	//       component: () => import("@/views/zip/index"),
	//       name: "ExportZip",
	//       meta: { title: "Export Zip" },
	//     },
	//   ],
	// },

	// {
	//   path: "/pdf",
	//   component: Layout,
	//   redirect: "/pdf/index",
	//   children: [
	//     {
	//       path: "index",
	//       component: () => import("@/views/pdf/index"),
	//       name: "PDF",
	//       meta: { title: "PDF", icon: "pdf" },
	//     },
	//   ],
	// },
	// {
	//   path: "/pdf/download",
	//   component: () => import("@/views/pdf/download"),
	//   hidden: true,
	// },

	// {
	//   path: "/theme",
	//   component: Layout,
	//   children: [
	//     {
	//       path: "index",
	//       component: () => import("@/views/theme/index"),
	//       name: "Theme",
	//       meta: { title: "Theme", icon: "theme" },
	//     },
	//   ],
	// },

	// {
	//   path: "/clipboard",
	//   component: Layout,
	//   children: [
	//     {
	//       path: "index",
	//       component: () => import("@/views/clipboard/index"),
	//       name: "ClipboardDemo",
	//       meta: { title: "Clipboard", icon: "clipboard" },
	//     },
	//   ],
	// },

	// {
	//   path: "external-link",
	//   component: Layout,
	//   children: [
	//     {
	//       path: "https://github.com/PanJiaChen/vue-element-admin",
	//       meta: { title: "External Link", icon: "link" },
	//     },
	//   ],
	// },

	// 404 page must be placed at the end !!!
	{ path: '*', redirect: '/404', hidden: true }
];

const createRouter = () =>
	new Router({
		// mode: 'history', // require service support
		scrollBehavior: () => ({ y: 0 }),
		routes: constantRoutes
	});

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
	const newRouter = createRouter();
	router.matcher = newRouter.matcher; // reset router
}

export default router;
