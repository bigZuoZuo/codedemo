import System from '@src/system';
import request from './request';

// 商业活动项目组域名
const activityDomainMap = {
	banban: {
		development: 'https://dev-activity.iambanban.com',
		production: 'https://api.iambanban.com/_activity',
	},
	partying: {
		// development: "https://dev-activity.iambanban.com",
		development: 'http://test.overseaban.com/_activity',
		production: 'https://api.partying.sg/_activity',
	},
	teammate: {
		development: 'https://dev.iambanban.com/_activity',
		production: 'https://api.imhotplay.com/_activity',
	},
};

// 管理系统组域名
const helpDomainMap = {
	banban: {
		development: 'https://dev.iambanban.com',
		production: 'https://help.iambanban.com',
	},
	partying: {
		development: 'http://test.oversea.com',
		production: 'https://help.partying.sg',
	},
	teammate: {
		development: 'https://dev.iambanban.com',
		production: 'https://help.imhotplay.com',
	},
};

export {};
