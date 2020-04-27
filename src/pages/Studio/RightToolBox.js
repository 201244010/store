import React, { Component, Fragment } from 'react';
import { Col, Icon, Input, InputNumber, Row, Select, Radio, AutoComplete, Divider, Modal, message } from 'antd';
import { formatMessage } from 'umi/locale';
import { KEY } from '@/constants';
import { SHAPE_TYPES, MAPS, FORMATS } from '@/constants/studio';
import { checkEan8Num, checkEan13Num } from '@/utils/studio';
import * as RegExp from '@/constants/regexp';
import * as styles from './index.less';

const { Option } = Select;
const { Option: AutoOption } = AutoComplete;

const bindFieldsLocaleMap = {
	productSeqNum: formatMessage({id: 'basicData.product.seqNum'}),
	productName: formatMessage({id: 'basicData.product.name'}),
	productSpec: formatMessage({id: 'basicData.product.spec'}),
	productLevel: formatMessage({id: 'basicData.product.level'}),
	productStorageLife: formatMessage({id: 'basicData.product.expireTime'}),
	productBarCode: formatMessage({id: 'basicData.product.barCode'}),
	productAlias: formatMessage({id: 'basicData.product.alias'}),
	productUnit: formatMessage({id: 'basicData.product.unit'}),
	productProductionArea: formatMessage({id: 'basicData.product.area'}),
	productBrand: formatMessage({id: 'basicData.product.brand'}),
	productQrCode: formatMessage({id: 'basicData.product.qrCode'}),
	productPrice: formatMessage({id: 'basicData.product.price'}),
	productPromotePrice: formatMessage({id: 'basicData.product.promotePrice'}),
	productMemberPrice: formatMessage({id: 'basicData.product.memberPrice'}),
	productPicture: formatMessage({id: 'basicData.product.image'}),
	productStatus: formatMessage({id: 'basicData.product.status'}),
	productDescription: formatMessage({id: 'basicData.product.description'}),
	productPromotePriceDescription: formatMessage({id: 'basicData.product.promotePriceDescription'}),
	productMemberPriceDescription: formatMessage({id: 'basicData.product.memberPriceDescription'}),
	productPackSize: formatMessage({id: 'basicData.product.extra.info.packSize'}),
	productStock: formatMessage({id: 'basicData.product.extra.info.stock'}),
	productSafetyStock: formatMessage({id: 'basicData.product.extra.info.safetyStock'}),
	productDailyMeanSales: formatMessage({id: 'basicData.product.extra.info.dailyMeanSales'}),
	productTodaySalesQty: formatMessage({id: 'basicData.product.extra.info.todaySalesQty'}),
	productCumulatedSalesQty: formatMessage({id: 'basicData.product.extra.info.cumulatedSalesQty'}),
	productOnOrderQty: formatMessage({id: 'basicData.product.extra.info.onOrderQty'}),
	productShelfQty: formatMessage({id: 'basicData.product.extra.info.shelfQty'}),
	productShelfCode: formatMessage({id: 'basicData.product.extra.info.shelfCode'}),
	productShelfTier: formatMessage({id: 'basicData.product.extra.info.shelfTier'}),
	productShelfColumn: formatMessage({id: 'basicData.product.extra.info.shelfColumn'}),
	productDisplayLocation: formatMessage({id: 'basicData.product.extra.info.displayLocation'}),
	productSupplierCode: formatMessage({id: 'basicData.product.extra.info.supplierCode'}),
	productSupplierName: formatMessage({id: 'basicData.product.extra.info.supplierName'}),
	productManufacturer: formatMessage({id: 'basicData.product.extra.info.manufacturer'}),
	productManufacturerAddress: formatMessage({id: 'basicData.product.extra.info.manufacturerAddress'}),
	productExpiryDate: formatMessage({id: 'basicData.product.extra.info.expiryDate'}),
	productShelfLife: formatMessage({id: 'basicData.product.extra.info.shelfLife'}),
	productIngredientTable: formatMessage({id: 'basicData.product.extra.info.ingredientTable'}),
	productFreshItemCode: formatMessage({id: 'basicData.product.extra.info.freshItemCode'}),
	productSupervisedBy: formatMessage({id: 'basicData.product.extra.info.supervisedBy'}),
	productSupervisionHotline: formatMessage({id: 'basicData.product.extra.info.supervisionHotline'}),
	productPricingStaff: formatMessage({id: 'basicData.product.extra.info.pricingStaff'}),
	productCategoryLevel1Code: formatMessage({id: 'basicData.product.extra.info.categoryLevel1Code'}),
	productCategoryLevel2Code: formatMessage({id: 'basicData.product.extra.info.categoryLevel2Code'}),
	productCategoryLevel3Code: formatMessage({id: 'basicData.product.extra.info.categoryLevel3Code'}),
	productCategoryLevel4Code: formatMessage({id: 'basicData.product.extra.info.categoryLevel4Code'}),
	productCategoryLevel5Code: formatMessage({id: 'basicData.product.extra.info.categoryLevel5Code'}),
	productCategoryLevel1Name: formatMessage({id: 'basicData.product.extra.info.categoryLevel1Name'}),
	productCategoryLevel2Name: formatMessage({id: 'basicData.product.extra.info.categoryLevel2Name'}),
	productCategoryLevel3Name: formatMessage({id: 'basicData.product.extra.info.categoryLevel3Name'}),
	productCategoryLevel4Name: formatMessage({id: 'basicData.product.extra.info.categoryLevel4Name'}),
	productCategoryLevel5Name: formatMessage({id: 'basicData.product.extra.info.categoryLevel5Name'}),
	productCustomPrice1: formatMessage({id: 'basicData.product.extra.price.customPrice1'}),
	productCustomPrice2: formatMessage({id: 'basicData.product.extra.price.customPrice2'}),
	productCustomPrice3: formatMessage({id: 'basicData.product.extra.price.customPrice3'}),
	productCustomPrice1Description: formatMessage({id: 'basicData.product.extra.price.customPrice1Description'}),
	productCustomPrice2Description: formatMessage({id: 'basicData.product.extra.price.customPrice2Description'}),
	productCustomPrice3Description: formatMessage({id: 'basicData.product.extra.price.customPrice3Description'}),
	productPromoteStartDate: formatMessage({id: 'basicData.product.extra.price.promoteStartDate'}),
	productPromoteEndDate: formatMessage({id: 'basicData.product.extra.price.promoteEndDate'}),
	productMemberPromoteStartDate: formatMessage({id: 'basicData.product.extra.price.memberPromoteStartDate'}),
	productMemberPromoteEndDate: formatMessage({id: 'basicData.product.extra.price.memberPromoteEndDate'}),
	productMemberPoint: formatMessage({id: 'basicData.product.extra.price.memberPoint'}),
	productPromoteReason: formatMessage({id: 'basicData.product.extra.price.promoteReason'}),
	productPromoteFlag: formatMessage({id: 'basicData.product.extra.price.promoteFlag'}),
	productCustomText1: formatMessage({id: 'basicData.product.extra.custom.text1'}),
	productCustomText2: formatMessage({id: 'basicData.product.extra.custom.text2'}),
	productCustomText3: formatMessage({id: 'basicData.product.extra.custom.text3'}),
	productCustomText4: formatMessage({id: 'basicData.product.extra.custom.text4'}),
	productCustomText5: formatMessage({id: 'basicData.product.extra.custom.text5'}),
	productCustomText6: formatMessage({id: 'basicData.product.extra.custom.text6'}),
	productCustomText7: formatMessage({id: 'basicData.product.extra.custom.text7'}),
	productCustomText8: formatMessage({id: 'basicData.product.extra.custom.text8'}),
	productCustomText9: formatMessage({id: 'basicData.product.extra.custom.text9'}),
	productCustomText10: formatMessage({id: 'basicData.product.extra.custom.text10'}),
	productCustomText11: formatMessage({id: 'basicData.product.extra.custom.text11'}),
	productCustomText12: formatMessage({id: 'basicData.product.extra.custom.text12'}),
	productCustomText13: formatMessage({id: 'basicData.product.extra.custom.text13'}),
	productCustomText14: formatMessage({id: 'basicData.product.extra.custom.text14'}),
	productCustomText15: formatMessage({id: 'basicData.product.extra.custom.text15'}),
	productCustomText16: formatMessage({id: 'basicData.product.extra.custom.text16'}),
	productCustomText17: formatMessage({id: 'basicData.product.extra.custom.text17'}),
	productCustomText18: formatMessage({id: 'basicData.product.extra.custom.text18'}),
	productCustomText19: formatMessage({id: 'basicData.product.extra.custom.text19'}),
	productCustomText20: formatMessage({id: 'basicData.product.extra.custom.text20'}),
	productCustomInt1: formatMessage({id: 'basicData.product.extra.custom.integer1'}),
	productCustomInt2: formatMessage({id: 'basicData.product.extra.custom.integer2'}),
	productCustomInt3: formatMessage({id: 'basicData.product.extra.custom.integer3'}),
	productCustomInt4: formatMessage({id: 'basicData.product.extra.custom.integer4'}),
	productCustomInt5: formatMessage({id: 'basicData.product.extra.custom.integer5'}),
	productCustomDec1: formatMessage({id: 'basicData.product.extra.custom.decimal1'}),
	productCustomDec2: formatMessage({id: 'basicData.product.extra.custom.decimal2'}),
	productCustomDec3: formatMessage({id: 'basicData.product.extra.custom.decimal3'}),
	productCustomDec4: formatMessage({id: 'basicData.product.extra.custom.decimal4'}),
	productCustomDec5: formatMessage({id: 'basicData.product.extra.custom.decimal5'}),
	productOthers: formatMessage({id: 'basicData.product.extra.custom.others'}),
};

const fontSizes = [{
	key: 9,
	value: 9
}, {
	key: 10,
	value: 10
}, {
	key: 11,
	value: 11
}, {
	key: 12,
	value: 12
}, {
	key: 14,
	value: 14
}, {
	key: 16,
	value: 16
}, {
	key: 18,
	value: 18
}, {
	key: 20,
	value: 20
}, {
	key: 28,
	value: 28
}, {
	key: 36,
	value: 36
}, {
	key: 48,
	value: 48
}, {
	key: 72,
	value: 72
}];
const BARCODE_LENGTH = {
	ean8: 7,
	ean13: 12,
	code128: 30
};

export default class RightToolBox extends Component {
	constructor(props) {
		super(props);
		this.state = {
			x: 'o',
			y: 'o',
			fontSize: '',
			smallFontSize: '',
			filterValue: ''
		};
	}

	componentDidMount() {
		this.initialValue(this.props);
		document.addEventListener('keydown', this.handleFontSizeEnter);
	}

	componentWillReceiveProps(nextProps) {
		this.initialValue(nextProps);
	}

	componentWillUnmount() {
		const { componentsDetail, selectedShapeName } = this.props;
		const detail = componentsDetail[selectedShapeName];
		document.removeEventListener('keydown', this.handleFontSizeEnter);
		this.handleBlurBindFields(detail.bindField);
	}

	handleFontSizeEnter = (ev) => {
		const { keyCode, target: { className } } = ev;
		if (keyCode === KEY.ENTER && className.includes('ant-select-search__field')) {
		    if (this.autoComplete) {
				this.autoComplete.blur();
			}
			if (this.smallAutoComplete) {
				this.smallAutoComplete.blur();
			}
		}
	};

	initialValue = (props) => {
		const { componentsDetail, selectedShapeName } = props;
		const detail = componentsDetail[selectedShapeName];

		this.setState({
			fontSize: (detail.fontSize || '').toString(),
			smallFontSize: (detail.smallFontSize || '').toString()
		});
	};

	handleDetail = (key, value) => {
		const {
			componentsDetail,
			selectedShapeName,
			updateComponentsDetail,
			deleteSelectedComponent,
			addComponent,
		} = this.props;

		if (key === 'type') {
			// type字段特殊处理，因为修改后name及key均需改变
			const detail = componentsDetail[selectedShapeName];
			const oldNameIndex = detail.name.replace(/[^0-9]/gi, '');
			const newType = `${value}@${detail.type.split('@')[2] || ''}`;
			const smallFontSize = newType.indexOf('normal') > -1 ? detail.fontSize : FORMATS.DEFAULT_PRICE_SMALL_FONT_SIZE;
			deleteSelectedComponent({
				selectedShapeName,
				isStep: false
			});
			addComponent({
				...detail,
				type: newType,
				name: `${newType}${oldNameIndex}`,
				smallFontSize
			});
		} else {
			const newDetail = {
				[key]: value,
			};
			const detail = componentsDetail[selectedShapeName];
			let canUpdate = true;
			if (key === 'bindField' && selectedShapeName.indexOf(SHAPE_TYPES.TEXT) > -1) {
				newDetail.content = bindFieldsLocaleMap[value] || formatMessage({ id: 'studio.action.text.db.click'});
			}
			if (key === 'content' && selectedShapeName.indexOf(SHAPE_TYPES.PRICE) > -1) {
				if (value === '') {
					canUpdate = true;
				} else {
					if (!RegExp.money.test(value) && (!value.endsWith('.') || value.split('.').length > 2)) {
						canUpdate = false;
					}
					const decimal = value.split('.')[1];
					if (decimal && decimal.length > detail.precision) {
						canUpdate = false;
					}
				}
			}
			if (canUpdate) {
				updateComponentsDetail({
					isStep: true,
					[selectedShapeName]: newDetail,
				});
			}
		}
	};

	handleSearchBindFields = (value) => {
		this.setState({
			filterValue: value
		});
	};

	handleBlurBindFields = (value) => {
		const { updateComponentsDetail, selectedShapeName } = this.props;
		const bindFields = this.getRealBindFields();

		this.setState({
			filterValue: ''
		});
		const newDetail = {
			bindField: bindFields.find(item => item === value || bindFieldsLocaleMap[item] === value) || 'no'
		};

		updateComponentsDetail({
			isStep: true,
			nowShapeName: selectedShapeName,
			[selectedShapeName]: newDetail,
		});
	};

	handleFontSize = (value) => {
		const fontSize = (parseInt(value, 10) || '').toString();

		this.setState({
			fontSize
		});
	};

	updateFontSize = () => {
		const {componentsDetail, selectedShapeName, updateComponentsDetail} = this.props;
		const {fontSize} = this.state;
		const detail = componentsDetail[selectedShapeName];

		updateComponentsDetail({
			isStep: true,
			[selectedShapeName]: {
				fontSize,
				scaleY: Math.max(fontSize / MAPS.containerHeight[detail.type], detail.scaleY)
			},
		});
	};

	handleSmallFontSize = (value) => {
		const smallFontSize = (parseInt(value, 10) || '').toString();

		this.setState({
			smallFontSize
		});
	};

	updateSmallFontSize = () => {
		const {selectedShapeName, updateComponentsDetail} = this.props;
		const {smallFontSize} = this.state;

		updateComponentsDetail({
			isStep: true,
			[selectedShapeName]: {
				smallFontSize
			},
		});
	};

	handleCodec = (value) => {
		const {componentsDetail, selectedShapeName, updateComponentsDetail} = this.props;
		const detail = componentsDetail[selectedShapeName];

		if (!detail.content) {
			updateComponentsDetail({
				isStep: true,
				[selectedShapeName]: {
					codec: value,
				},
			});
			return;
		}
		const image = document.createElement('img');

		try {
			JsBarcode(image, detail.content, {
				format: value,
				height: MAPS.containerHeight[detail.type] * detail.scaleY * detail.zoomScale,
				margin: 0,
				textPosition: 'top',
				fontSize: 0,
				textMargin: 0,
				displayValue: false
			});

			setTimeout(() => {
				updateComponentsDetail({
					isStep: true,
					[selectedShapeName]: {
						codec: value,
						image
					},
				});
			}, 100);
		} catch (e) {
			message.error(`${detail.content}${formatMessage({id: 'studio.error.codec.value.wrong'})}`);
			updateComponentsDetail({
				isStep: true,
				[selectedShapeName]: {
					codec: value,
				},
			});
		}
	};

	handleLineWidth = (detail, value) => {
		const {
			selectedShapeName,
			updateComponentsDetail,
		} = this.props;

		if (detail.type === SHAPE_TYPES.LINE_H) {
			updateComponentsDetail({
				isStep: true,
				[selectedShapeName]: {
					scaleY: value
				},
			});
		} else {
			updateComponentsDetail({
				isStep: true,
				[selectedShapeName]: {
					scaleX: value
				},
			});
		}
	};

	handleLineSpacing = (detail, value) => {
		if ((!value || /^(0|[1-9][0-9]*)$/.test(value))) {
			const {selectedShapeName, updateComponentsDetail} = this.props;
			const newDetail = {
				lineSpacing: value,
			};

			updateComponentsDetail({
				isStep: true,
				[selectedShapeName]: newDetail,
			});
		}
	};

	handlePrecision = (value) => {
		const {
			selectedShapeName,
			updateComponentsDetail,
		} = this.props;
		updateComponentsDetail({
			isStep: true,
			updatePrecision: true,
			[selectedShapeName]: {
				precision: value
			},
		});
	};

	handleBindValue = (value) => {
		const {
			componentsDetail,
			selectedShapeName,
			updateComponentsDetail,
		} = this.props;

		if (selectedShapeName.indexOf(SHAPE_TYPES.CODE_QR) === -1 && value !== '' && !/^[0-9a-zA-Z]+$/.test(value)) {
			return;
		}

		const detail = componentsDetail[selectedShapeName];

		if (value === '') {
			const image = new Image();
			image.src = MAPS.imgPath[detail.type];
			image.onload = () => {
				updateComponentsDetail({
					[selectedShapeName]: {
						content: value,
						image,
						ratio: image.height / image.width,
						height: (detail.width * image.height) / image.width,
					},
				});
			};
			return;
		}

		if (this.hasSubString(SHAPE_TYPES.CODE_QR)) {
			const bb = jQuery(document.createElement('canvas')).qrcode({
				render: 'canvas',
				text: value,
				width: detail.width,
				height: detail.height,
				background: '#ffffff',
				foreground: '#000000'
			});
			const canvas = bb.find('canvas').get(0);
			const image = new Image();
			image.src = canvas.toDataURL();
			image.onload = () => {
				updateComponentsDetail({
					[selectedShapeName]: {
						content: value,
						image,
						ratio: image.height / image.width,
						height: (detail.width * image.height) / image.width,
					},
				});
			};
		}

		const genValue = ['ean8', 'ean13'].includes(detail.codec) && value && value.length === BARCODE_LENGTH[detail.codec] ?
			value + {'ean8': checkEan8Num, 'ean13': checkEan13Num}[detail.codec](value) : value;
		const image = document.createElement('img');

		if (this.hasSubString(SHAPE_TYPES.CODE_H)) {
			try {
				JsBarcode(image, genValue, {
					format: detail.codec,
					height: MAPS.containerHeight[detail.type] * detail.scaleY * detail.zoomScale,
					margin: 0,
					textPosition: 'top',
					fontSize: 0,
					textMargin: 0,
					displayValue: false
				});

				setTimeout(() => {
					updateComponentsDetail({
						[selectedShapeName]: {
							content: value,
							image,
						}
					});
				}, 100);
			} catch (e) {
				updateComponentsDetail({
					[selectedShapeName]: {
						content: value,
					}
				});
			}
		}
		if (this.hasSubString(SHAPE_TYPES.CODE_V)) {
			try {
				JsBarcode(image, genValue, {
					format: detail.codec,
					height: MAPS.containerHeight[detail.type] * detail.scaleY * detail.zoomScale,
					margin: 0,
					textPosition: 'top',
					fontSize: 0,
					textMargin: 0,
					displayValue: false
				});

				setTimeout(() => {
					updateComponentsDetail({
						[selectedShapeName]: {
							content: value,
							image,
						}
					});
				}, 100);
			} catch (e) {
				updateComponentsDetail({
					[selectedShapeName]: {
						content: value,
					}
				});
			}

		}
	};

	handleXY = (detail, key, e) => {
		const { componentsDetail, selectedShapeName, updateComponentsDetail } = this.props;
		const originFix = {};
		Object.keys(componentsDetail).map(detailKey => {
			const componentDetail = componentsDetail[detailKey];
			if (componentDetail.type === SHAPE_TYPES.RECT_FIX) {
				originFix.x = componentDetail.x;
				originFix.y = componentDetail.y;
			}
		});
		const { value } = e.target;
		let toValue = value;
		if (!/^-?\d*$/.test(value)) {
			this.setState({
				[key]: ''
			});
			toValue = 0;
		} else if (value === '' || value === '-') {
			this.setState({
				[key]: value
			});
			toValue = 0;
		} else {
			this.setState({
				[key]: 'o'
			});
		}
		updateComponentsDetail({
			isStep: true,
			[selectedShapeName]: {
				[key]: originFix[key] + parseInt(toValue || 0, 10),
			},
		});
	};

	handleWidth = (detail, e) => {
		const { selectedShapeName, updateComponentsDetail } = this.props;
		const newDetail = {
			scaleX: (e.target.value || 0) / MAPS.containerWidth[detail.type],
		};
		if (selectedShapeName.indexOf(SHAPE_TYPES.IMAGE) > -1) {
			newDetail.scaleY = (e.target.value || 0) / MAPS.containerWidth[detail.type];
		}
		updateComponentsDetail({
			isStep: true,
			[selectedShapeName]: newDetail,
		});
	};

	handleHeight = (detail, e) => {
		const { selectedShapeName, updateComponentsDetail } = this.props;
		updateComponentsDetail({
			isStep: true,
			[selectedShapeName]: {
				scaleY: (e.target.value || 0) / MAPS.containerHeight[detail.type],
			},
		});
	};

	handleFontStyle = (detail, style) => {
		const { selectedShapeName, updateComponentsDetail } = this.props;
		const newDetail = {
			[style]: detail[style] === 1 ? 0 : 1
		};

		if (style === 'underline') {
			newDetail.strikethrough = 0;
		}
		if (style === 'strikethrough') {
			newDetail.underline = 0;
		}

		updateComponentsDetail({
			isStep: true,
			[selectedShapeName]: newDetail,
		});
	};

	getMenuMap = () => {
		const menuMap = {};

		if (this.hasSubString(SHAPE_TYPES.TEXT)) {
			menuMap.hasBindData = true;
			menuMap.isText = true;
		}
		if (this.hasSubString(SHAPE_TYPES.RECT)) {
			menuMap.isRect = true;
		}
		if (this.hasSubString(SHAPE_TYPES.LINE_H) || this.hasSubString(SHAPE_TYPES.LINE_V)) {
			menuMap.isLine = true;
		}
		if (this.hasSubString(SHAPE_TYPES.IMAGE)) {
			menuMap.isImage = true;
		}
		if (this.hasSubString(SHAPE_TYPES.PRICE)) {
			menuMap.hasBindData = true;
			menuMap.isPrice = true;
			if (
				this.hasSubString(SHAPE_TYPES.PRICE_SUPER) ||
				this.hasSubString(SHAPE_TYPES.PRICE_SUB)
			) {
				menuMap.isNonNormalPrice = true;
			}
		}
		if (this.hasSubString(SHAPE_TYPES.CODE)) {
			menuMap.hasBindData = true;
			menuMap.isBarOrQrCode = true;
			if (this.hasSubString(SHAPE_TYPES.CODE_V) || this.hasSubString(SHAPE_TYPES.CODE_H)) {
				menuMap.isCode = true;
			}
		}

		return menuMap;
	};

	getRealBindFields = () => {
		const { bindFields } = this.props;
		const { filterValue } = this.state;
		let ret = [];
		if (this.hasSubString(SHAPE_TYPES.PRICE)) {
			ret = bindFields.filter(item => item.indexOf('Price') > -1 && item.toLowerCase().indexOf('description') === -1);
		}
		if (this.hasSubString(SHAPE_TYPES.CODE_V) || this.hasSubString(SHAPE_TYPES.CODE_H)) {
			ret = bindFields.filter(item => item.indexOf('BarCode') > -1);
		}
		if (this.hasSubString(SHAPE_TYPES.CODE_QR)) {
			ret = bindFields.filter(item => item.indexOf('QrCode') > -1);
		}
		if (this.hasSubString(SHAPE_TYPES.TEXT)) {
			ret = bindFields.filter(
				item => item.indexOf('Price') === -1 || item.toLowerCase().indexOf('description') > -1
			);
		}

		return ret.filter(item => item.indexOf(filterValue) > -1 || (bindFieldsLocaleMap[item] || '').indexOf(filterValue) > -1);
	};

	hasSubString = type => {
		const { selectedShapeName } = this.props;
		return selectedShapeName.indexOf(type) > -1;
	};

	hasRed = () => {
		const { templateInfo } = this.props;
		return templateInfo.model_name.toUpperCase().indexOf('R') > -1;
	};

	toUploadFont = () => {
		Modal.confirm({
			title: formatMessage({id: 'studio.upload.font.warning'}),
			content: formatMessage({id: 'studio.upload.font.warning.message'}),
			okText: formatMessage({id: 'btn.confirm'}),
			cancelText: formatMessage({id: 'btn.cancel'}),
			icon: <Icon type="info-circle" />,
			onOk: () => {
				if (this.fileSelect) {
					this.fileSelect.click();
				}
			}
		});
	};

	uploadFont = (file) => {
		const { uploadFont } = this.props;
		// ttf、otf、ttc
		if (!['ttf', 'otf', 'ttc'].includes(file.name.split('.').reverse()[0])) {
			message.warning(formatMessage({id: 'studio.upload.font.accept.file'}));
		} else {
			uploadFont({
				file
			});
		}
	};

	render() {
		const { componentsDetail, selectedShapeName, updateMask, fontList } = this.props;
		const { x, y, fontSize, smallFontSize } = this.state;
		const menuMap = this.getMenuMap();
		const detail = componentsDetail[selectedShapeName];
		const originFix = {};
		Object.keys(componentsDetail).map(key => {
			const componentDetail = componentsDetail[key];
			if (componentDetail.type === SHAPE_TYPES.RECT_FIX) {
				originFix.x = componentDetail.x;
				originFix.y = componentDetail.y;
			}
		});
		const realWidth = detail.scaleX ? Math.round(MAPS.containerWidth[detail.type] * detail.scaleX) : '';
		const realHeight = detail.scaleY ? Math.round(MAPS.containerHeight[detail.type] * detail.scaleY) : '';

		const disabled = [SHAPE_TYPES.RECT_FIX].includes(detail.type);
		const widthDisabled = disabled || [SHAPE_TYPES.LINE_V, SHAPE_TYPES.CODE_H].includes(detail.type);
		const heightDisabled = disabled || [SHAPE_TYPES.IMAGE, SHAPE_TYPES.LINE_H, SHAPE_TYPES.CODE_V].includes(detail.type);
		const hasRed = this.hasRed();
		const bindFields = this.getRealBindFields();

		return (
			<Fragment>
				{menuMap.hasBindData ? (
					<div className={styles['tool-box-block']}>
						<h4>{formatMessage({ id: 'studio.tool.title.bind.field' })}</h4>
						<AutoComplete
							placeholder={formatMessage({ id: 'studio.placeholder.bind.field' })}
							style={{ width: 220 }}
							value={detail.bindField}
							dataSource={
								[
									<Option key="no" value="no">
										{formatMessage({ id: 'basicData.product.not.bind' })}
									</Option>,
									...(bindFields.map(field =>
										<AutoOption key={field} value={field}>
											{bindFieldsLocaleMap[field]}
										</AutoOption>
									))
								]

							}
							onChange={value => {
								this.handleDetail('bindField', value);
							}}
							onSearch={value => {
								this.handleSearchBindFields(value);
							}}
							onBlur={value => {
								this.handleBlurBindFields(value);
							}}
						/>
					</div>
				) : null}
				<div className={styles['tool-box-block']}>
					<Row gutter={20} style={{ marginBottom: 10 }}>
						<Col span={12}>
							<Input
								style={{ width: 100 }}
								addonAfter={<span>X</span>}
								value={(x === '-' || x === '') ? x : Math.round(detail.x - originFix.x)}
								onChange={e => {
									this.handleXY(detail, 'x', e);
								}}
								disabled={disabled}
							/>
						</Col>
						<Col span={12}>
							<Input
								style={{ width: 100 }}
								addonAfter={<span>Y</span>}
								value={(y === '-' || y === '') ? y : Math.round(detail.y - originFix.y)}
								onChange={e => {
									this.handleXY(detail, 'y', e);
								}}
								disabled={disabled}
							/>
						</Col>
					</Row>
					<Row gutter={20} style={{ marginBottom: 10 }}>
						<Col span={12}>
							<Input
								style={{ width: 100 }}
								addonAfter={
									<span>{formatMessage({ id: 'studio.tool.label.width' })}</span>
								}
								value={realWidth}
								onChange={e => {
									this.handleWidth(detail, e);
								}}
								disabled={widthDisabled}
							/>
						</Col>
						<Col span={12}>
							<Input
								style={{ width: 100 }}
								addonAfter={
									<span>{formatMessage({ id: 'studio.tool.label.height' })}</span>
								}
								value={realHeight}
								onChange={e => {
									this.handleHeight(detail, e);
								}}
								disabled={heightDisabled}
							/>
						</Col>
					</Row>
				</div>
				{menuMap.isRect ? (
					<div className={styles['tool-box-block']}>
						<h4>{formatMessage({ id: 'studio.tool.title.style' })}</h4>
						<Row style={{ marginBottom: 10 }} gutter={20}>
							<Col span={24}>
								{formatMessage({ id: 'studio.tool.title.fill.color' })}
							</Col>
							<Col span={24}>
								<Radio.Group
									style={{ width: '100%' }}
									value={detail.backgroundColor}
									onChange={e => {
										this.handleDetail('backgroundColor', e.target.value);
									}}
								>
									<Radio.Button
										style={{ width: hasRed ? '33.33%' : '50%' }}
										value="black"
									>
										{formatMessage({ id: 'studio.tool.label.black' })}
									</Radio.Button>
									<Radio.Button
										style={{ width: hasRed ? '33.33%' : '50%' }}
										value="white"
									>
										{formatMessage({ id: 'studio.tool.label.white' })}
									</Radio.Button>
									{hasRed ? (
										<Radio.Button style={{ width: '33.33%' }} value="red">
											{formatMessage({ id: 'studio.tool.label.red' })}
										</Radio.Button>
									) : null}
								</Radio.Group>
							</Col>
						</Row>
						<Row style={{ marginBottom: 10 }} gutter={20}>
							<Col span={24}>
								{formatMessage({ id: 'studio.tool.label.stroke.width' })}
							</Col>
							<Col span={24}>
								<Radio.Group
									style={{ width: '100%' }}
									value={detail.strokeWidth}
									onChange={e => {
										this.handleDetail('strokeWidth', parseInt(e.target.value, 10));
									}}
								>
									<Radio.Button style={{ width: '25%' }} value={0}>
										0px
									</Radio.Button>
									<Radio.Button style={{ width: '25%' }} value={1}>
										1px
									</Radio.Button>
									<Radio.Button style={{ width: '25%' }} value={3}>
										3px
									</Radio.Button>
									<Radio.Button style={{ width: '25%' }} value={5}>
										5px
									</Radio.Button>
								</Radio.Group>
							</Col>
						</Row>
						<Row style={{ marginBottom: 10 }} gutter={20}>
							<Col span={24}>
								{formatMessage({ id: 'studio.tool.label.stroke.color' })}
							</Col>
							<Col span={24}>
								<Radio.Group
									style={{ width: '100%' }}
									value={detail.strokeColor}
									onChange={e => {
										this.handleDetail('strokeColor', e.target.value);
									}}
								>
									<Radio.Button style={{ width: hasRed ? '33.33%' : '50%' }} value="black">
										{formatMessage({ id: 'studio.tool.label.black' })}
									</Radio.Button>
									<Radio.Button style={{ width: hasRed ? '33.33%' : '50%' }} value="white">
										{formatMessage({ id: 'studio.tool.label.white' })}
									</Radio.Button>
									{
										hasRed ?
											<Radio.Button style={{ width: '33.33%' }} value="red">
												{formatMessage({ id: 'studio.tool.label.red' })}
											</Radio.Button> :
											null
									}
								</Radio.Group>
							</Col>
						</Row>
						{/*
							<Row style={{ marginBottom: 10 }} gutter={20}>
								<Col span={24}>圆角直径</Col>
								<Col span={16}>
									<Slider
										min={0}
										max={SIZES.DEFAULT_RECT_WIDTH / 2}
										value={detail.cornerRadius}
										onChange={value => {
											this.handleDetail('cornerRadius', value);
										}}
									/>
								</Col>
								<Col span={8}>
									<InputNumber
										style={{ width: '100%' }}
										min={0}
										max={SIZES.DEFAULT_RECT_WIDTH / 2}
										value={detail.cornerRadius}
										onChange={value => {
											this.handleDetail('cornerRadius', value);
										}}
									/>
								</Col>
							</Row>
						*/}
					</div>
				) : null}
				{menuMap.isText ? (
					<div className={styles['tool-box-block']}>
						<h4>{formatMessage({ id: 'studio.tool.title.text' })}</h4>
						<Row style={{ marginBottom: 10 }}>
							<Col span={24}>
								<Input
									placeholder={formatMessage({id: 'studio.tool.label.text.content'})}
									value={detail.content}
									onChange={e => {
										this.handleDetail('content', e.target.value);
									}}
								/>
							</Col>
						</Row>
						<Row style={{ marginBottom: 10 }}>
							<Col span={4}>
								<span className={styles.title}>
									{formatMessage({ id: 'studio.tool.label.font.family' })}
								</span>
							</Col>
							<Col span={20}>
								<div
									onMouseDown={(e) => {
										e.preventDefault();
										return false;
									}}
								>
									<Select
										style={{ width: '100%' }}
										value={detail.fontFamily}
										onChange={value => {
											this.handleDetail('fontFamily', value);
										}}
										dropdownRender={menu => (
											<div>
												{menu}
												<Divider style={{ margin: 0 }} />
												<a style={{ padding: '8px', display: 'block' }} onClick={this.toUploadFont}>
													{formatMessage({id: 'studio.upload.font'})}
												</a>
											</div>
										)}
									>
										<Option value="Zfull-GB">Zfull-GB</Option>
										<Option value="Alibaba Sans">Alibaba Sans</Option>
										{
											fontList.map(
												font => <Option key={font.font_id} value={font.name.split('.')[0]}>{font.name.split('.')[0]}</Option>
											)
										}
									</Select>
								</div>
							</Col>
						</Row>
						<Row style={{ marginBottom: 10 }}>
							<Col span={4}>
								<span className={styles.title}>
									{formatMessage({ id: 'studio.tool.label.font.size' })}
								</span>
							</Col>
							<Col span={20}>
								<AutoComplete
									ref={(autoComplete) => {this.autoComplete = autoComplete;}}
									style={{ width: '100%' }}
									dataSource={fontSizes.map(size => size.key.toString())}
									placeholder={formatMessage({
										id: 'studio.tool.label.font.size',
									})}
									defaultActiveFirstOption={false}
									value={fontSize}
									onFocus={() => updateMask(true)}
									onChange={value => {
										this.handleFontSize(value);
									}}
									onBlur={() => {
										this.updateFontSize();
										setTimeout(() => {
											updateMask(false);
										}, 20);
									}}
								/>
							</Col>
						</Row>
						<Row style={{ marginBottom: 10 }}>
							<Col span={4}>
								<span className={styles.title}>
									{formatMessage({ id: 'studio.tool.label.line.spacing' })}
								</span>
							</Col>
							<Col span={20}>
								<InputNumber
									style={{ width: '100%' }}
									placeholder={formatMessage({ id: 'studio.tool.label.line.spacing' })}
									min={detail.fontSize}
									value={detail.lineSpacing}
									onChange={value => {
										this.handleLineSpacing(detail, value);
									}}
								/>
							</Col>
						</Row>
						<Row style={{ marginBottom: 10 }} gutter={20}>
							<Col span={8} className={`${styles.formatter} ${detail.bold ? `${styles.active}` : ''}`}>
								<Icon type="bold" onClick={() => {this.handleFontStyle(detail, 'bold');}} />
							</Col>
							{/* <Col span={6} className={`${styles.formatter} ${detail.italic ? `${styles.active}` : ''}`}> */}
							{/* <Icon type="italic" onClick={() => {this.handleFontStyle(detail, 'italic');}} /> */}
							{/* </Col> */}
							<Col span={8} className={`${styles.formatter} ${detail.underline ? `${styles.active}` : ''}`}>
								<Icon type="underline" onClick={() => {this.handleFontStyle(detail, 'underline');}} />
							</Col>
							<Col span={8} className={`${styles.formatter} ${detail.strikethrough ? `${styles.active}` : ''}`}>
								<Icon type="strikethrough" onClick={() => {this.handleFontStyle(detail, 'strikethrough');}} />
							</Col>
						</Row>
						<Row style={{ marginBottom: 10 }} gutter={20}>
							<Col span={24}>
								{formatMessage({ id: 'studio.tool.label.font.color' })}
							</Col>
							<Col span={24}>
								<Radio.Group
									style={{ width: '100%' }}
									value={detail.fontColor}
									onChange={e => {
										this.handleDetail('fontColor', e.target.value);
									}}
								>
									<Radio.Button
										style={{ width: hasRed ? '33.33%' : '50%' }}
										value="black"
									>
										{formatMessage({ id: 'studio.tool.label.black' })}
									</Radio.Button>
									<Radio.Button
										style={{ width: hasRed ? '33.33%' : '50%' }}
										value="white"
									>
										{formatMessage({ id: 'studio.tool.label.white' })}
									</Radio.Button>
									{hasRed ? (
										<Radio.Button style={{ width: '33.33%' }} value="red">
											{formatMessage({ id: 'studio.tool.label.red' })}
										</Radio.Button>
									) : null}
								</Radio.Group>
							</Col>
						</Row>
						<Row style={{ marginBottom: 10 }} gutter={20}>
							<Col span={24}>
								{formatMessage({ id: 'studio.tool.title.bg.color' })}
							</Col>
							<Col span={24}>
								<Radio.Group
									style={{ width: '100%' }}
									value={detail.backgroundColor}
									onChange={e => {
										this.handleDetail('backgroundColor', e.target.value);
									}}
								>
									<Radio.Button
										style={{ width: hasRed ? '25%' : '33.33%' }}
										value="opacity"
									>
										{formatMessage({ id: 'studio.tool.label.opacity' })}
									</Radio.Button>
									<Radio.Button
										style={{ width: hasRed ? '25%' : '33.33%' }}
										value="black"
									>
										{formatMessage({ id: 'studio.tool.label.black' })}
									</Radio.Button>
									<Radio.Button
										style={{ width: hasRed ? '25%' : '33.33%' }}
										value="white"
									>
										{formatMessage({ id: 'studio.tool.label.white' })}
									</Radio.Button>
									{hasRed ? (
										<Radio.Button style={{ width: '25%' }} value="red">
											{formatMessage({ id: 'studio.tool.label.red' })}
										</Radio.Button>
									) : null}
								</Radio.Group>
							</Col>
						</Row>
						<Row style={{ marginBottom: 10 }} gutter={20}>
							<Col span={24}>{formatMessage({ id: 'studio.tool.title.align' })}</Col>
							<Col span={24}>
								<Radio.Group
									style={{ width: '100%' }}
									value={detail.align}
									onChange={e => {
										this.handleDetail('align', e.target.value);
									}}
								>
									<Radio.Button style={{ width: '33.33%' }} value="left">
										<Icon type="align-left" />
									</Radio.Button>
									<Radio.Button style={{ width: '33.33%' }} value="center">
										<Icon type="align-center" />
									</Radio.Button>
									<Radio.Button style={{ width: '33.33%' }} value="right">
										<Icon type="align-right" />
									</Radio.Button>
								</Radio.Group>
							</Col>
						</Row>
						{/*
								<Row style={{ marginBottom: 10 }} gutter={40}>
									<Col span={16}>自动对齐宽度</Col>
									<Col span={8}>
										<Switch defaultChecked />
									</Col>
								</Row>
								*/}
					</div>
				) : null}
				{menuMap.isLine ? (
					<div className={styles['tool-box-block']}>
						<h4>{formatMessage({ id: 'studio.tool.title.style' })}</h4>
						<Row style={{ marginBottom: 10 }} gutter={20}>
							<Col span={24}>{formatMessage({ id: 'studio.tool.title.color' })}</Col>
							<Col span={24}>
								<Radio.Group
									style={{ width: '100%' }}
									value={detail.backgroundColor}
									onChange={e => {
										this.handleDetail('backgroundColor', e.target.value);
									}}
								>
									<Radio.Button style={{ width: '33.33%' }} value="black">
										{formatMessage({ id: 'studio.tool.label.black' })}
									</Radio.Button>
									<Radio.Button style={{ width: '33.33%' }} value="white">
										{formatMessage({ id: 'studio.tool.label.white' })}
									</Radio.Button>
									<Radio.Button style={{ width: '33.33%' }} value="red">
										{formatMessage({ id: 'studio.tool.label.red' })}
									</Radio.Button>
								</Radio.Group>
							</Col>
						</Row>
						<Row style={{ marginBottom: 10 }} gutter={20}>
							<Col span={24}>
								{formatMessage({ id: 'studio.tool.label.stroke.width' })}
							</Col>
							<Col span={24}>
								<Radio.Group
									style={{ width: '100%' }}
									value={
										detail.type === SHAPE_TYPES.LINE_H ?
											MAPS.containerHeight[detail.type] * detail.scaleY :
											MAPS.containerWidth[detail.type] * detail.scaleX
									}
									onChange={e => {
										this.handleLineWidth(detail, e.target.value);
									}}
								>
									<Radio.Button style={{ width: '33.33%' }} value={1}>
										1px
									</Radio.Button>
									<Radio.Button style={{ width: '33.33%' }} value={3}>
										3px
									</Radio.Button>
									<Radio.Button style={{ width: '33.33%' }} value={5}>
										5px
									</Radio.Button>
								</Radio.Group>
							</Col>
						</Row>
					</div>
				) : null}
				{menuMap.isPrice ? (
					<div className={styles['tool-box-block']}>
						<h4>{formatMessage({ id: 'studio.tool.title.style' })}</h4>
						<Row style={{ marginBottom: 10 }}>
							<Col span={24}>
								<Input
									style={{ width: '100%' }}
									placeholder={formatMessage({ id: 'studio.price.component' })}
									value={detail.content}
									onChange={e => {
										this.handleDetail('content', e.target.value);
									}}
								/>
							</Col>
						</Row>
						<Row style={{ marginBottom: 10 }}>
							<Col span={4}>
								<span className={styles.title}>
									{formatMessage({ id: 'studio.tool.label.font.family' })}
								</span>
							</Col>
							<Col span={20}>
								<div
									onMouseDown={(e) => {
										e.preventDefault();
										return false;
									}}
								>
									<Select
										style={{ width: '100%' }}
										value={detail.fontFamily}
										onChange={value => {
											this.handleDetail('fontFamily', value);
										}}
										dropdownRender={menu => (
											<div>
												{menu}
												<Divider style={{ margin: 0 }} />
												<a style={{ padding: '8px', display: 'block' }} onClick={this.toUploadFont}>
													{formatMessage({id: 'studio.upload.font'})}
												</a>
											</div>
										)}
									>
										<Option value="Zfull-GB">Zfull-GB</Option>
										<Option value="Alibaba Sans">Alibaba Sans</Option>
										{
											fontList.map(
												font => <Option key={font.font_id} value={font.name.split('.')[0]}>{font.name.split('.')[0]}</Option>
											)
										}
									</Select>
								</div>
							</Col>
						</Row>
						<Row style={{ marginBottom: 10 }} gutter={10}>
							{menuMap.isNonNormalPrice ? (
								<Fragment>
									<Col span={12}>
										<Row>
											<Col span={24}>
												<span className={styles.title}>
													{formatMessage({
														id: 'studio.tool.label.font.size.int',
													})}
												</span>
											</Col>
											<Col span={24}>
												<AutoComplete
													ref={(autoComplete) => {this.autoComplete = autoComplete;}}
													style={{ width: '100%' }}
													dataSource={fontSizes.map(size => size.key.toString())}
													placeholder={formatMessage({
														id: 'studio.tool.label.font.size',
													})}
													defaultActiveFirstOption={false}
													value={fontSize}
													onFocus={() => updateMask(true)}
													onChange={value => {
														this.handleFontSize(value);
													}}
													onBlur={() => {
														this.updateFontSize();
														setTimeout(() => {
															updateMask(false);
														}, 20);
													}}
												/>
											</Col>
										</Row>
									</Col>
									<Col span={12}>
										<Row>
											<Col span={24}>
												<span className={styles.title}>
													{formatMessage({
														id: 'studio.tool.label.font.size.small',
													})}
												</span>
											</Col>
											<Col span={24}>
												<AutoComplete
													ref={(autoComplete) => {this.smallAutoComplete = autoComplete;}}
													style={{ width: '100%' }}
													dataSource={fontSizes.filter(size => size.value < detail.fontSize).map(size => size.key.toString())}
													placeholder={formatMessage({
														id: 'studio.tool.label.font.size',
													})}
													defaultActiveFirstOption={false}
													value={smallFontSize}
													onFocus={() => updateMask(true)}
													onChange={value => {
														this.handleSmallFontSize(value);
													}}
													onBlur={() => {
														this.updateSmallFontSize();
														setTimeout(() => {
															updateMask(false);
														}, 20);
													}}
												/>
											</Col>
										</Row>
									</Col>
								</Fragment>
							) : (
								<Fragment>
									<Col span={4}>
										<span className={styles.title}>
											{formatMessage({ id: 'studio.tool.label.font.size' })}
										</span>
									</Col>
									<Col span={20}>
										<AutoComplete
											ref={(autoComplete) => {this.autoComplete = autoComplete;}}
											style={{ width: '100%' }}
											dataSource={fontSizes.map(size => size.key.toString())}
											placeholder={formatMessage({
												id: 'studio.tool.label.font.size',
											})}
											defaultActiveFirstOption={false}
											value={fontSize}
											onFocus={() => updateMask(true)}
											onChange={value => {
												this.handleFontSize(value);
											}}
											onBlur={() => {
												this.updateFontSize();
												setTimeout(() => {
													updateMask(false);
												}, 20);
											}}
										/>
									</Col>
								</Fragment>
							)}
						</Row>
						<Row style={{ marginBottom: 10 }} gutter={20}>
							<Col span={8} className={`${styles.formatter} ${detail.bold ? `${styles.active}` : ''}`}>
								<Icon type="bold" onClick={() => {this.handleFontStyle(detail, 'bold');}} />
							</Col>
							{/* <Col span={6} className={`${styles.formatter} ${detail.italic ? `${styles.active}` : ''}`}> */}
							{/* <Icon type="italic" onClick={() => {this.handleFontStyle(detail, 'italic');}} /> */}
							{/* </Col> */}
							<Col span={8} className={`${styles.formatter} ${detail.underline ? `${styles.active}` : ''}`}>
								<Icon type="underline" onClick={() => {this.handleFontStyle(detail, 'underline');}} />
							</Col>
							<Col span={8} className={`${styles.formatter} ${detail.strikethrough ? `${styles.active}` : ''}`}>
								<Icon type="strikethrough" onClick={() => {this.handleFontStyle(detail, 'strikethrough');}} />
							</Col>
						</Row>
						<Row style={{ marginBottom: 10 }} gutter={20}>
							<Col span={24}>
								{formatMessage({ id: 'studio.tool.label.font.color' })}
							</Col>
							<Col span={24}>
								<Radio.Group
									style={{ width: '100%' }}
									value={detail.fontColor}
									onChange={e => {
										this.handleDetail('fontColor', e.target.value);
									}}
								>
									<Radio.Button
										style={{ width: hasRed ? '33.33%' : '50%' }}
										value="black"
									>
										{formatMessage({ id: 'studio.tool.label.black' })}
									</Radio.Button>
									<Radio.Button
										style={{ width: hasRed ? '33.33%' : '50%' }}
										value="white"
									>
										{formatMessage({ id: 'studio.tool.label.white' })}
									</Radio.Button>
									{hasRed ? (
										<Radio.Button style={{ width: '33.33%' }} value="red">
											{formatMessage({ id: 'studio.tool.label.red' })}
										</Radio.Button>
									) : null}
								</Radio.Group>
							</Col>
						</Row>
						<Row style={{ marginBottom: 10 }} gutter={20}>
							<Col span={24}>
								{formatMessage({ id: 'studio.tool.title.bg.color' })}
							</Col>
							<Col span={24}>
								<Radio.Group
									style={{ width: '100%' }}
									value={detail.backgroundColor}
									onChange={e => {
										this.handleDetail('backgroundColor', e.target.value);
									}}
								>
									<Radio.Button
										style={{ width: hasRed ? '25%' : '33.33%' }}
										value="opacity"
									>
										{formatMessage({ id: 'studio.tool.label.opacity' })}
									</Radio.Button>
									<Radio.Button
										style={{ width: hasRed ? '25%' : '33.33%' }}
										value="black"
									>
										{formatMessage({ id: 'studio.tool.label.black' })}
									</Radio.Button>
									<Radio.Button
										style={{ width: hasRed ? '25%' : '33.33%' }}
										value="white"
									>
										{formatMessage({ id: 'studio.tool.label.white' })}
									</Radio.Button>
									{hasRed ? (
										<Radio.Button style={{ width: '25%' }} value="red">
											{formatMessage({ id: 'studio.tool.label.red' })}
										</Radio.Button>
									) : null}
								</Radio.Group>
							</Col>
						</Row>
						{
							detail.precision ?
								<Row style={{ marginBottom: 10 }} gutter={20}>
									<Col span={24}>
										{formatMessage({ id: 'studio.tool.label.small.type' })}
									</Col>
									<Col span={24}>
										<Radio.Group
											style={{ width: '100%' }}
											value={`${detail.type.split('@')[0]}@${detail.type.split('@')[1]}`}
											onChange={e => {
												this.handleDetail('type', e.target.value);
											}}
										>
											<Radio.Button style={{ width: '33.33%' }} value="price@normal">
												<span style={{ fontSize: 16 }}>99.{detail.precision === 1 ? '0' : '00'}</span>
											</Radio.Button>
											<Radio.Button style={{ width: '33.33%' }} value="price@sup">
												<span style={{ fontSize: 16 }}>
													99.<sup>{detail.precision === 1 ? '0' : '00'}</sup>
												</span>
											</Radio.Button>
											<Radio.Button style={{ width: '33.33%' }} value="price@sub">
												<span style={{ fontSize: 16 }}>
													99.<sub>{detail.precision === 1 ? '0' : '00'}</sub>
												</span>
											</Radio.Button>
										</Radio.Group>
									</Col>
								</Row> :
								null
						}
						<Row style={{marginBottom: 10}} gutter={20}>
							<Col span={24}>
								{formatMessage({ id: 'studio.tool.title.precision' })}
							</Col>
							<Col span={24}>
								<Radio.Group
									style={{width: '100%'}}
									value={detail.precision}
									onChange={(e) => {this.handlePrecision(e.target.value);}}
								>
									<Radio.Button style={{width: '33.33%'}} value={0}>
										0
									</Radio.Button>
									<Radio.Button style={{width: '33.33%'}} value={1}>
										1
									</Radio.Button>
									<Radio.Button style={{width: '33.33%'}} value={2}>
										2
									</Radio.Button>
								</Radio.Group>
							</Col>
						</Row>
						<Row style={{ marginBottom: 10 }} gutter={20}>
							<Col span={24}>{formatMessage({ id: 'studio.tool.title.align' })}</Col>
							<Col span={24}>
								<Radio.Group
									style={{ width: '100%' }}
									value={detail.align}
									onChange={e => {
										this.handleDetail('align', e.target.value);
									}}
								>
									<Radio.Button style={{ width: '33.33%' }} value="left">
										<Icon type="align-left" />
									</Radio.Button>
									<Radio.Button style={{ width: '33.33%' }} value="center">
										<Icon type="align-center" />
									</Radio.Button>
									<Radio.Button style={{ width: '33.33%' }} value="right">
										<Icon type="align-right" />
									</Radio.Button>
								</Radio.Group>
							</Col>
						</Row>
					</div>
				) : null}
				{menuMap.isBarOrQrCode ? (
					<div className={styles['tool-box-block']}>
						<h4>{formatMessage({ id: 'studio.tool.title.style' })}</h4>
						{
							menuMap.isCode ?
								<>
									<Row style={{ marginBottom: 10 }} gutter={20}>
										<Col span={24}>{formatMessage({ id: 'studio.tool.title.bind.value' })}</Col>
										<Col span={24}>
											<Input
												placeholder={formatMessage({ id: 'studio.placeholder.bind.value' })}
												value={detail.content}
												style={{ width: '100%' }}
												maxLength={BARCODE_LENGTH[detail.codec]}
												onChange={e => {
													this.handleBindValue(e.target.value);
												}}
											/>
										</Col>
									</Row>
									<Row style={{ marginBottom: 10 }} gutter={20}>
										<Col span={24}>{formatMessage({ id: 'studio.tool.label.codec' })}</Col>
										<Col span={24}>
											<Select
												style={{ width: '100%' }}
												value={detail.codec}
												onChange={value => {
													this.handleCodec(value);
												}}
											>
												<Option value="ean8">ean8</Option>
												<Option value="ean13">ean13</Option>
												<Option value="code128">code128</Option>
											</Select>
										</Col>
									</Row>
								</> :
								<Row style={{ marginBottom: 10 }} gutter={20}>
									<Col span={24}>{formatMessage({ id: 'studio.tool.title.qr.bind.value' })}</Col>
									<Col span={24}>
										<Input
											placeholder={formatMessage({ id: 'studio.placeholder.bind.value' })}
											value={detail.content}
											style={{ width: '100%' }}
											maxLength={200}
											onChange={e => {
												this.handleBindValue(e.target.value);
											}}
										/>
									</Col>
								</Row>
						}
					</div>
				) : null}
				<input
					type="file"
					ref={(fileSelect) => {this.fileSelect = fileSelect;}}
					style={{display: 'none'}}
					onChange={(e) => {
						this.uploadFont(e.target.files[0]);
					}}
				/>
			</Fragment>
		);
	}
}
