import videoPlayer from './zh-CN/videoPlayer';
import activeDetection from './zh-CN/activeDetection';
import deviceBasicInfo from './zh-CN/deviceBasicInfo';
import basicParams from './zh-CN/basicParams';
import networkSetting from './zh-CN/networkSetting';
import ipcManagement from './zh-CN/ipcManagement';
import softwareUpdate from './zh-CN/softwareUpdate';
import cardManagement from './zh-CN/cardManagement';
import cloudService from './zh-CN/cloudService';
import faceidLibrary from './zh-CN/faceidLibrary';
import menu from './zh-CN/menu';
import ipcList from './zh-CN/ipcList';
import sdcard from './zh-CN/sdcard';
import common from './zh-CN/common';
import motionList from './zh-CN/motionList';
import posList from './zh-CN/posList';
import tradeVideos from './zh-CN/tradeVideos';
import live from './zh-CN/live';
import photoManagement from './zh-CN/photoManagement';
import faceLog from './zh-CN/faceLog';
import entryDetail from './zh-CN/entryDetail';
import initialSetting from './zh-CN/initialSetting';
import agreementModal from './zh-CN/agreementModal';

export default {

	...common,
	...faceidLibrary,
	...videoPlayer,
	...ipcManagement,
	...deviceBasicInfo,
	...activeDetection,
	...basicParams,
	...networkSetting,
	...softwareUpdate,
	...cardManagement,
	...cloudService,
	...menu,
	...sdcard,
	...ipcList,
	...motionList,
	...posList,
	...tradeVideos,
	...live,
	...photoManagement,
	...faceLog,
	...entryDetail,
	...initialSetting,
	...agreementModal
};