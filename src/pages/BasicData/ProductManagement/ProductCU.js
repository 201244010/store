import React, { Component } from 'react';
import { Form, Button, Row, Col, Card } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { melt, format, map, shake } from '@konata9/milk-shake';
import moment from 'moment';
import ProductCUBasic from './ProductCU-Basic';
import ProductCUWeight from './ProductCU-Weight';
import ProductCUPrice from './ProductCU-Price';
import { getLocationParam, idDecode } from '@/utils/utils';
import { FORM_ITEM_LAYOUT } from '@/constants/form';
import { ERROR_OK, PRODUCT_SEQ_EXIST } from '@/constants/errorCode';
import * as styles from './ProductManagement.less';

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
	})
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
					format('toCamel')(response.data || {})
				);
				console.log(result);
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
		const { weighInfo } = values;

		let formattedValue = values;

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
							} = values;
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
							} = values;
							if (data && moment.isMoment(usebyDays)) {
								return usebyType === '1'
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
							} = values;

							if (data && moment.isMoment(limitDays)) {
								return limitType === '1'
									? limitDays.format('YYYY-MM-DD')
									: limitDays.format('HH:mm');
							}
							return data;
						},
					},
				])
			);
		}

		formattedValue = shake(formattedValue)(
			format('toCamel'),
			map([
				{ from: 'expireTime', to: 'expireTime', rule: data => data || -1 },
				{ from: 'price', to: 'price', rule: data => data || -1 },
				{ from: 'promotePrice', to: 'promotePrice', rule: data => data || -1 },
				{ from: 'memberPrice', to: 'memberPrice', rule: data => data || -1 },
			])
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
			if (!err) {
				const submitValue = this.formatSubmitValue(values);
				const response = await submitFunction[action]({
					options: {
						...submitValue,
						fromPage,
						productId: id,
					},
				});
				if (response && response.code === PRODUCT_SEQ_EXIST) {
					setFields({
						seq_num: {
							values: values.seq_num,
							errors: [new Error(formatMessage({ id: 'product.seq_num.isExist' }))],
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
		const { productBasicExtra, productPriceExtra, productType } = this.state;
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

					<ProductCUPrice
						{...{
							form,
							productInfo,
							productPriceExtra,
							remove: this.extraInfoRemove,
						}}
					/>

					<Card title={null} bordered={false}>
						<Row>
							<Col span={12}>
								<Form.Item label=" " colon={false}>
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
