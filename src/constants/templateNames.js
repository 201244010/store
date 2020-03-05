import { formatMessage } from 'umi/locale';

const templates =  {
	'normal-price-display': '价格显示',
	'out_of_store': '缺货',
	'out-of-store': '缺货',
	'stock-tacking': '盘点',
	'stock_tacking': '盘点',
	'Default_Mode_White': '预置白色闪灯模式',
	'Default_Mode_Blue': '预置蓝色闪灯模式',
	'Default_Mode_Green': '预置绿色闪灯模式',
	'Default_Mode_Red': '预置红色闪灯模式',
	'Default_Mode_Green2': '预置青色闪灯模式',
	'Default_Mode_Purple': '预置紫色闪灯模式',
	'Default_Mode_Yellow': '预置黄色闪灯模式',
	'esl-template-colour-BW': '黑白',
	'esl-template-colour-BWR': '黑白红',
	'esl-screen-2.13': '2.13寸',
	'esl-screen-2.6': '2.6寸',
	'esl-screen-4.2': '4.2寸',
	'esl-screen-7.5': '7.5寸',
	'esl-default-template-BWR-2.13': '2.13寸黑白红模板',
	'esl-default-template-BW-2.6': '2.6寸黑白模板',
	'esl-default-template-BWR-2.6': '2.6寸黑白红模板',
	'esl-default-template-BWR-4.2': '4.2寸黑白红模板',
	'esl-default-template-normal-2.13': '2.13寸正常模板',
	'esl-default-template-promotion-2.13': '2.13寸促销模板',
	'esl-default-template-normal-2.6': '2.6寸正常模板',
	'esl-default-template-promotion-2.6': '2.6寸促销模板',
	'esl-default-template-normal-4.2': '4.2寸正常模板',
	'esl-default-template-promotion-4.2': '4.2寸促销模板',
};

export default function formatedMessage(id) {
	if (id && Object.keys(templates).includes(id)) {
		return formatMessage({id});
	}
	return id;
}
