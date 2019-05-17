import videoPlayer from './zh-CN/videoPlayer';
import activeDetection from './zh-CN/activeDetection';
import deviceBasicInfo from './zh-CN/deviceBasicInfo';
import basicParams from './zh-CN/basicParams';
import networkSetting from './zh-CN/networkSetting';
import softwareUpdate from './zh-CN/softwareUpdate';
import cloudService from './zh-CN/cloudService';
import faceidLibrary from './zh-CN/faceidLibrary';
import menu from './zh-CN/menu';
import ipcList from './zh-CN/ipcList';
import sdcard from './zh-CN/sdcard';
import common from './zh-CN/common';
import motionList from './zh-CN/motionList';


export default {
	
	...common,
	...faceidLibrary,
	...videoPlayer,
	...deviceBasicInfo,
	...activeDetection,
	...basicParams,
	...networkSetting,
	...softwareUpdate,
	...cloudService,
	...menu,
	...sdcard,
	...ipcList,
	...motionList
};