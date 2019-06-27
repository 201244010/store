import React, { Component } from 'react';
import { Form, Button, Row, Col, Card } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import ProductCUBasic from './ProductCU-Basic';
import ProductCUWeight from './ProductCU-Weight';
import ProductCUPrice from './ProductCU-Price';
import { getLocationParam, idDecode } from '@/utils/utils';
import { FORM_ITEM_LAYOUT } from '@/constants/form';
import { ERROR_OK, PRODUCT_SEQ_EXIST } from '@/constants/errorCode';
import * as styles from './ProductManagement.less';

@connect(
	state => ({
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
				options: { product_id: productId },
			});
			if (response && response.code === ERROR_OK) {
				const result = response.data || {};
				this.setState({
					productBasicExtra: result.extra_info,
					productPriceExtra: result.extra_price_info,
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
			console.log(values);
			if (!err) {
				const response = await submitFunction[action]({
					options: {
						...values,
						fromPage,
						product_id: id,
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
		} = this.props;
		const action = getLocationParam('action');

		return (
			<Card className={styles['content-container']}>
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

					{productType === 1 ? <ProductCUWeight {...{ form }} /> : <></>}

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
									<Button type="primary" onClick={this.onSubmit}>
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
