import React, { Component } from 'react';
import { Form, Button, Row, Col, Card } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { melt, format, map, shake } from '@konata9/milk-shake';
import moment from 'moment';
import { getLocationParam, idDecode } from '@/utils/utils';
import { FORM_ITEM_LAYOUT } from '@/constants/form';
import { ERROR_OK, PRODUCT_SEQ_EXIST, PRODUCT_PLU_EXIST } from '@/constants/errorCode';
import ProductCUBasic from './ProductCU-Basic';
import ProductCUWeight from './ProductCU-Weight';
// import ProductCUPrice from './ProductCU-Price';
import ExtraInfo from './ProductCU-ExtraInfo';
import ExtraPrice from './ProductCU-ExtraPrice';
import ExtraCustom from './ProductCU-ExtraCustom';
import * as styles from './ProductManagement.less';

const ExtraInfoFields = [
	'packSize',
	'stock',
	'safetyStock',
	'dailyMeanSales',
	'todaySalesQty',
	'cumulatedSalesQty',
	'onOrderQty',
	'shelfQty',
	'shelfCode',
	'shelfTier',
	'shelfColumn',
	'displayLocation',
	'supplierCode',
	'supplierName',
	'manufacturer',
	'manufacturerAddress',
	'expiryDate',
	'storageLife',
	'shelfLife',
	'ingredientTable',
	'freshItemCode',
	'supervisedBy',
	'supervisionHotline',
	'pricingStaff',
	'categoryLevel1Code',
	'categoryLevel2Code',
	'categoryLevel3Code',
	'categoryLevel4Code',
	'categoryLevel5Code',
	'categoryLevel1Name',
	'categoryLevel2Name',
	'categoryLevel3Name',
	'categoryLevel4Name',
	'categoryLevel5Name',
];

const ExtraPriceInfoFields = [
	'customPrice1',
	'customPrice2',
	'customPrice3',
	'customPrice1Description',
	'customPrice2Description',
	'customPrice3Description',
	'promoteDate',
	'memberPromoteDate',
	'memberPoint',
	'promoteReason',
	'promoteFlag',
];

const ExtraCustomInfoFields = [
	'customText1',
	'customText2',
	'customText3',
	'customText4',
	'customText5',
	'customText6',
	'customText7',
	'customText8',
	'customText9',
	'customText10',
	'customText11',
	'customText12',
	'customText13',
	'customText14',
	'customText15',
	'customText16',
	'customText17',
	'customText18',
	'customText19',
	'customText20',
	'customInt1',
	'customInt2',
	'customInt3',
	'customInt4',
	'customInt5',
	'customDec1',
	'customDec2',
	'customDec3',
	'customDec4',
	'customDec5',
	'others',
];

@connect(
	state => ({
		loading: state.loading,
		product: state.basicDataProduct,
	}),
	dispatch => ({
		getProductDetail: payload =>
			dispatch({ type: 'basicDataProduct/getProductDetail', payload }),
		createProduct: payload => dispatch({ type: 'basicDataProduct/createProduct', payload }),
		updateProduct: payload => dispatch({ type: 'basicDataProduct/updateProduct', payload }),
		clearState: () => dispatch({ type: 'basicDataProduct/clearState' }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	}),
)
@Form.create()
class ProductCU extends Component {
	constructor(props) {
		super(props);
		this.state = {
			productBasicExtra: [],
			productPriceExtra: [],
			productType: 0,
		};
	}

	async componentDidMount() {
		const { getProductDetail, clearState } = this.props;
		const [action = 'create', id = ''] = [getLocationParam('action'), getLocationParam('id')];
		if (action === 'create') {
			clearState();
		} else if (action === 'edit') {
			const productId = idDecode(id);
			const response = await getProductDetail({
				options: { productId },
			});
			if (response && response.code === ERROR_OK) {
				const result = map([{ from: 'Type', to: 'type' }])(
					format('toCamel')(response.data || {}),
				);
				// console.log(result);
				this.setState({
					productType: result.type || 0,
					productBasicExtra: result.extraInfo,
					productPriceExtra: result.extraPriceInfo,
				});
			}
		}
	}

	extraInfoRemove = (index, type) => {
		const { productBasicExtra, productPriceExtra } = this.state;
		let [editInfo, field] = [[], 'productBasicExtra'];
		if (type === 'info') {
			editInfo = [...productBasicExtra];
			field = 'productBasicExtra';
		} else {
			editInfo = [...productPriceExtra];
			field = 'productPriceExtra';
		}
		editInfo.splice(index, 1);
		this.setState({
			[field]: editInfo,
		});
	};

	productTypeChange = value => {
		this.setState({
			productType: value,
		});
	};

	formatSubmitValue = values => {
		let formattedValue = {
			...values,
		};
		const { weighInfo } = formattedValue;

		if (weighInfo) {
			formattedValue = shake(formattedValue)(
				format('toCamel'),
				melt([
					{
						target: 'weighInfo.exttextNo',
						rule: (data, params) => {
							if (data) {
								Object.keys(data).forEach((key, index) => {
									params.weighInfo[`exttextNo${index + 1}`] = data[key];
								});
							}
							return {};
						},
					},
				]),
				map([
					{
						from: 'weighInfo.isDiscount',
						to: 'weighInfo.isDiscount',
						rule: data => (data ? 1 : 0),
					},
					{
						from: 'weighInfo.isAlterPrice',
						to: 'weighInfo.isAlterPrice',
						rule: data => (data ? 1 : 0),
					},
					{
						from: 'weighInfo.isPrintTraceCode',
						to: 'weighInfo.isPrintTraceCode',
						rule: data => (data ? 1 : 0),
					},
					{
						from: 'weighInfo.packDist',
						to: 'weighInfo.packDist',
						rule: data => (data ? 1 : 0),
					},
					{
						from: 'weighInfo.packDays',
						to: 'weighInfo.packDays',
						rule: data => {
							const {
								weighInfo: { packDays },
							} = formattedValue;
							if (data && moment.isMoment(packDays)) {
								return packDays.format('YYYY-MM-DD');
							}
							return data;
						},
					},
					{
						from: 'weighInfo.usebyDist',
						to: 'weighInfo.usebyDist',
						rule: data => (data ? 1 : 0),
					},
					{
						from: 'weighInfo.usebyDays',
						to: 'weighInfo.usebyDays',
						rule: data => {
							const {
								weighInfo: { usebyType, usebyDays },
							} = formattedValue;
							if (data && moment.isMoment(usebyDays)) {
								return usebyType === '2'
									? usebyDays.format('YYYY-MM-DD')
									: usebyDays.format('HH:mm');
							}
							return data;
						},
					},
					{
						from: 'weighInfo.limitDist',
						to: 'weighInfo.limitDist',
						rule: data => (data ? 1 : 0),
					},
					{
						from: 'weighInfo.limitDays',
						to: 'weighInfo.limitDays',
						rule: data => {
							const {
								weighInfo: { limitType, limitDays },
							} = formattedValue;

							if (data && moment.isMoment(limitDays)) {
								return limitType === '2'
									? limitDays.format('YYYY-MM-DD')
									: limitDays.format('HH:mm');
							}
							return data;
						},
					},
				]),
			);
		}

		formattedValue = shake(formattedValue)(
			format('toCamel'),
			map([
				{ from: 'expireTime', to: 'expireTime', rule: data => data || -1 },
				{ from: 'price', to: 'price', rule: data => data || -1 },
				{ from: 'promotePrice', to: 'promotePrice', rule: data => data || -1 },
				{ from: 'memberPrice', to: 'memberPrice', rule: data => data || -1 },
			]),
		);

		return formattedValue;
	};

	onSubmit = () => {
		const {
			createProduct,
			updateProduct,
			product: {
				productInfo: { id = null },
			},
		} = this.props;
		const [action = '', fromPage = 'list'] = [
			getLocationParam('action'),
			getLocationParam('from'),
		];
		const submitFunction = {
			create: createProduct,
			edit: updateProduct,
		};
		const {
			form: { validateFields, setFields },
		} = this.props;
		validateFields(async (err, values) => {
			// console.log(values);
			if (!err) {
				const submitValue = this.formatSubmitValue(values);
				submitValue.extraInfo = {};
				ExtraInfoFields.forEach(field => {
					if (field === 'expiryDate') {
						submitValue.extraInfo[field] = values[field] ? values[field].unix() : undefined;
					} else if(field === 'packSize' || field === 'stock' || field === 'safetyStock' || field === 'dailyMeanSales' || field === 'todaySalesQty' || field === 'cumulatedSalesQty' || field === 'onOrderQty' || field === 'shelfQty' || field === 'shelfLife') {
						submitValue.extraInfo[field] = submitValue[field]? submitValue[field]: -1;
					} else {
						submitValue.extraInfo[field] = submitValue[field];

					}
				});
				submitValue.extraPriceInfo = {};
				ExtraPriceInfoFields.forEach(field => {
					if (field === 'promoteDate') {
						submitValue.extraPriceInfo.promoteStartDate = values[field][0] ? values[field][0].unix() : undefined;
						submitValue.extraPriceInfo.promoteEndDate = values[field][1] ? values[field][1].unix() : undefined;
					} else if (field === 'memberPromoteDate') {
						submitValue.extraPriceInfo.memberPromoteStartDate = values[field][0] ? values[field][0].unix() : undefined;
						submitValue.extraPriceInfo.memberPromoteEndDate = values[field][1] ? values[field][1].unix() : undefined;
					}else if(field === 'customPrice1' || field === 'customPrice2' || field === 'customPrice3' || field === 'memberPoint' || field === 'promoteFlag') {
						submitValue.extraPriceInfo[field] = submitValue[field]? submitValue[field]: -1;
					} else {
						submitValue.extraPriceInfo[field] = submitValue[field];
					}
				});
				submitValue.extraCustomInfo = {};
				ExtraCustomInfoFields.forEach(field => {
					if (field === 'customInt1' || field === 'customInt2' || field === 'customInt3' || field === 'customInt4' || field === 'customInt5' || field === 'customDec1' || field === 'customDec2' || field === 'customDec3' || field === 'customDec4' || field === 'customDec5') {
						submitValue.extraCustomInfo[field] = submitValue[field]? submitValue[field]: -1;
					} else {

						submitValue.extraCustomInfo[field] = submitValue[field];
					}
				});
				const response = await submitFunction[action]({
					options: {
						...submitValue,
						fromPage,
						productId: id,
					},
				});
				if (response && response.code === PRODUCT_SEQ_EXIST) {
					setFields({
						seqNum: {
							values: values.seqNum,
							errors: [new Error(formatMessage({ id: 'product.seq_num.isExist' }))],
						},
					});
				} else if (response && response.code === PRODUCT_PLU_EXIST) {
					setFields({
						'weighInfo.pluCode': {
							values: values['weighInfo.pluCode'],
							errors: [
								new Error(
									formatMessage({
										id: 'basicData.weightProduct.pluCode.exist',
									}),
								),
							],
						},
					});
				}
			}
		});
	};

	goBack = () => {
		const { goToPath } = this.props;
		const from = getLocationParam('from');
		const id = getLocationParam('id');

		const path = {
			detail: {
				pathId: 'productInfo',
				urlParams: { id },
			},
			list: { pathId: 'productList', urlParams: {} },
		};

		const { pathId, urlParams = {} } = path[from] || {};
		goToPath(pathId, urlParams);

		// router.push(path[from] || path.list);
	};

	render() {
		const { productBasicExtra, productType } = this.state;
		const {
			form,
			product: { productInfo },
			loading,
		} = this.props;
		const action = getLocationParam('action');

		return (
			<Card
				className={styles['content-container']}
				loading={loading.effects['basicDataProduct/getProductDetail']}
				style={{marginBottom: 80}}
			>
				<Form
					{...{
						...FORM_ITEM_LAYOUT,
					}}
				>
					<ProductCUBasic
						{...{
							form,
							productInfo,
							productBasicExtra,
							remove: this.extraInfoRemove,
							onSelectChange: this.productTypeChange,
						}}
					/>

					{productType === 1 && <ProductCUWeight {...{ form, productInfo, action }} />}

					{/* <ProductCUPrice */}
					{/* {...{ */}
					{/* form, */}
					{/* productInfo, */}
					{/* productPriceExtra, */}
					{/* remove: this.extraInfoRemove, */}
					{/* }} */}
					{/* /> */}
					<ExtraInfo
						{...{
							form,
							productInfo,
						}}
					/>
					<ExtraPrice
						{...{
							form,
							productInfo,
						}}
					/>
					<ExtraCustom
						{...{
							form,
							productInfo,
						}}
					/>
					<Card
						title={null}
						bordered={false}
						style={{position: 'fixed', left: 0, bottom: 0, right: 0}}
						bodyStyle={{padding: 0}}
					>
						<Row>
							<Col span={4} offset={19}>
								<Form.Item label=" " colon={false} style={{marginTop: 12, marginBottom: 12}}>
									<Button
										type="primary"
										onClick={this.onSubmit}
										loading={
											loading.effects['basicDataProduct/createProduct'] ||
											loading.effects['basicDataProduct/updateProduct']
										}
									>
										{action === 'create'
											? formatMessage({ id: 'btn.create' })
											: formatMessage({ id: 'btn.save' })}
									</Button>
									<Button style={{ marginLeft: '20px' }} onClick={this.goBack}>
										{formatMessage({ id: 'btn.cancel' })}
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Card>
				</Form>
			</Card>
		);
	}
}

export default ProductCU;
