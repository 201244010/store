import {customizeFetch} from '@/utils/fetch';
import {getLocationParam} from '@/utils/utils';
import {ERROR_OK} from '@/constants/errorCode';
import {genService} from '@/services/index';

const fetchApi = customizeFetch('esl/api/template');
const genTemplateService = genService(fetchApi);

export default {
	fetchScreenTypes: genTemplateService('getScreenTypeList'),
	fetchTemplates: genTemplateService('getList'),
	fetchColors: genTemplateService('getColourList'),
	fetchBindFields: genTemplateService('getBindableProductFieldList'),
	fetchTemplatesByESLCode: genTemplateService('getNameList'),
	createTemplate: genTemplateService('create'),
	saveAsDraft: genTemplateService('saveAsDraft'),
	uploadImage: genTemplateService('uploadImage'),
	deleteTemplate: genTemplateService('delete'),
	renameTemplate: genTemplateService('rename'),
	applyTemplate: genTemplateService('apply'),
	cloneTemplate: genTemplateService('clone'),
	fetchScreenNameList: genTemplateService('getScreenNameList'),
	fetchTemplateDetail: options => {
		const studioType = getLocationParam('type');
		if (studioType === 'alone') {
			const templateInfo = localStorage.getItem(getLocationParam('id'));
			return Promise.resolve({
				code: ERROR_OK,
				data: {
					template_info: JSON.parse(templateInfo)
				}
			});
		}
		const opts = {
			method: 'POST',
			body: options
		};

		return fetchApi('getInfo', opts).then(response => response.json());
	},
	uploadTemplate: options => {
		const studioType = getLocationParam('type');
		if (studioType === 'alone') {
			const templateInfo = localStorage.getItem(getLocationParam('id'));
			return Promise.resolve({
				code: ERROR_OK,
				data: {
					template_info: JSON.parse(templateInfo)
				}
			});
		}

		const opts = {
			method: 'POST',
			body: options
		};

		return fetchApi('upload', opts).then(response => response.json());
	},
	previewTemplate: genTemplateService('preview'),
};
