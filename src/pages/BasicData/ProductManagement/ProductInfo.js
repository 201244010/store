import React, { Component } from 'react';
import { Button, Card } from 'antd';
import { connect } from 'dva';
import { formatMessage } from 'umi/locale';
import { getLocationParam, idDecode, idEncode } from '@/utils/utils';
import ProductInfoBasic from './ProductInfo-Basic';
import ProductInfoWeight from './ProductInfo-Weight';
import ProductInfoPrice from './ProductInfo-Price';
import ProductInfoExtraCustom from './ProductInfo-ExtraCustom';
import ProductInfoExtraInfo from './ProductInfo-ExtraInfo';
import ProductInfoExtraPrice from './ProductInfo-ExtraPrice';
import * as styles from './ProductManagement.less';

const PRODUCT_BASIC = {
	seqNum: null,
	barCode: null,
	name: null,
	alias: null,
	// 特殊 因为 type 在 GO 中关键字
	type: null,
	unit: null,
	spec: null,
	area: null,
	level: null,
	brand: null,
	expireTime: null,
	qrCode: null,
	status: null,
	description: null,
	promotePriceDescription: null,
	memberPriceDescription: null
};

const PRODUCT_WEIGHT = {
	pluCode: null,
	isDiscount: false,
	isAlterPrice: false,
	isPrintTraceCode: false,
	labelCode: null,
	chargeUnit: null,
	barcodeCode: null,
	productWeigh: null,
	tareCode: null,
	tare: null,
	exttextCode: null,
	exttextNo1: null,
	exttextNo2: null,
	exttextNo3: null,
	exttextNo4: null,
	packDist: null,
	packType: null,
	packDays: null,
	usebyDist: null,
	usebyType: null,
	usebyDays: null,
	limitDist: null,
	limitType: null,
	limitDays: null,
};

const PRODUCT_PRICE = {
	price: null,
	promotePrice: null,
	memberPrice: null,
};

const MESSAGE_PREFIX = {
	product: 'basicData.product',
	weight: 'basicData.weightProduct',
};

@connect(
	state => ({
		product: state.basicDataProduct,
		store: state.store,
		loading: state.loading,
	}),
	dispatch => ({
		getProductDetail: payload =>
			dispatch({ type: 'basicDataProduct/getProductDetail', payload }),
		goToPath: (pathId, urlParams = {}) =>
			dispatch({ type: 'menu/goToPath', payload: { pathId, urlParams } }),
	})
)
class ProductInfo extends Component {
	componentDidMount() {
		const { getProductDetail = {} } = this.props;
		const productId = idDecode(getLocationParam('id'));
		getProductDetail({
			options: {
				product_id: productId,
			},
		});
	}

	toPath = target => {
		const {
			product: {
				productInfo: { id },
			},
			goToPath,
		} = this.props;

		const path = {
			edit: {
				pathId: 'productUpdate',
				urlParams: {
					action: 'edit',
					id: idEncode(id),
					from: 'detail',
				},
			},
			back: {
				pathId: 'productList',
			},
		};

		const { pathId, urlParams = {} } = path[target] || {};

		goToPath(pathId, urlParams);
		// router.push(path[target] || '/');
	};

	formatProductInfo = (productInfo = [], template = {}, type = 'product') => {
		const prefix = MESSAGE_PREFIX[type] || '';
		return Object.keys(template).map(key => ({
			key,
			value: productInfo[key],
			label: `${prefix}.${key}`,
		}));
	};

	render() {
		const {
			loading,
			store: {
				saasBindInfo: { isBind = false },
			},
			product: {
				productInfo = {},
				productInfo: {
					type = 0,
					extra_info: productBasicExtra,
					extra_price_info: productPriceExtra,
				},
			},
		} = this.props;

		const productBasic = this.formatProductInfo(productInfo, PRODUCT_BASIC);

		let productWeight = {};
		if (type === 1 && productInfo.weighInfo) {
			productWeight = this.formatProductInfo(productInfo.weighInfo, PRODUCT_WEIGHT, 'weight');
		}

		const productPrice = this.formatProductInfo(productInfo, PRODUCT_PRICE);

		return (
			<Card bordered={false} loading={loading.effects['basicDataProduct/getProductDetail']}>
				<ProductInfoBasic
					{...{
						productBasic,
						productBasicExtra,
					}}
				/>
				{type === 1 && (
					<ProductInfoWeight
						{...{
							productWeight,
						}}
					/>
				)}
				<ProductInfoPrice
					{...{
						productPrice,
						productPriceExtra,
					}}
				/>
				<ProductInfoExtraInfo
					{...{
						productInfo,
					}}
				/>
				<ProductInfoExtraPrice
					{...{
						productInfo,
					}}
				/>
				<ProductInfoExtraCustom
					{...{
						productInfo,
					}}
				/>
				<div className={styles.footer}>
					{!isBind && (
						<Button
							className={styles.btn}
							type="primary"
							onClick={() => this.toPath('edit')}
						>
							{formatMessage({ id: 'btn.alter' })}
						</Button>
					)}
					<Button className={styles.btn} onClick={() => this.toPath('back')}>
						{formatMessage({ id: 'btn.back' })}
					</Button>
				</div>
			</Card>
		);
	}
}

export default ProductInfo;
