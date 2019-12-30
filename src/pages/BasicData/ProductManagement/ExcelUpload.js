import React, {Component} from 'react';
import {Card, Steps, Form, Upload, Button, Icon, Progress, message} from 'antd';
import {connect} from 'dva';
import router from 'umi/router';
import { formatMessage } from 'umi/locale';
import { downloadFileByClick } from '@/utils/utils';
import { ERROR_OK } from '@/constants/errorCode';
import * as styles from './ExcelUpload.less';

const {Step} = Steps;

const formItemLayout = {
	labelCol: {span: 6},
	wrapperCol: {span: 10}
};

@connect(
	state => ({
		product: state.basicDataProduct,
	}),
	dispatch => ({
		importByExcel: payload => dispatch({ type: 'basicDataProduct/importByExcel', payload }),
		downloadExcelTemplate: () => dispatch({ type: 'basicDataProduct/downloadExcelTemplate' }),
	})
)
@Form.create()
class ExcelUpload extends Component {
	constructor(props) {
		super(props);
		this.state = {
			current: 0,
			fileList: [],
			disabled: true,
			readLoading: false,
			percent: 50,
			result: {}
		};
	}

	nextStep = async () => {
		const { importByExcel } = this.props;
		this.setState({
			current: 1
		});

		const response = await importByExcel({
			options: {
				file: this.uploadFile ,
			},
		});
		if (response && response.code === ERROR_OK) {
			this.setState({
				percent: 100,
				current: 2,
				result: response.data
			});
		}
	}

	handleFile = (file) => new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = (e) => {
			const data = e.target.result;
			const wb = XLSX.read(data, {type: 'binary'});
			const result = {};
			wb.SheetNames.forEach((sheetName) => {
				const roa = XLSX.utils.sheet_to_json(wb.Sheets[sheetName], {header: 1});
				if (roa.length) result[sheetName] = roa;
			});
			resolve(result);
		};
		reader.onerror = (err) => {
			reject(err);
		};
		reader.readAsBinaryString(file);
	});

	beforeUpload = (file) => {
		if (file.name.indexOf('.xlsx') === -1 && file.name.indexOf('.xls') === -1) {
			message.error(formatMessage({id: 'product.excel.import.error.format'}));
			return false;
		}
		this.setState({
			readLoading: true
		});
		this.handleFile(file).then(() => {
			this.setState({
				disabled: false,
				readLoading: false
			});
		}).catch(() => {
			this.setState({
				readLoading: false
			});
		});

		return false;
	};

	handleChange = async info => {
		let fileList = [...info.fileList];

		fileList = fileList.slice(-1);

		this.setState({fileList});
		this.uploadFile = fileList[0].originFileObj;
	}

	handleDownloadTemplate = async () => {
		const { downloadExcelTemplate } = this.props;

		const response = await downloadExcelTemplate();
		downloadFileByClick(response.data.downloadUrl);
	};

	downloadErrorItems = () => {
		downloadFileByClick(result.download_failed_file_address);
	};

	render() {
		const {current, fileList, disabled, readLoading, percent, result} = this.state;
		const {form: {getFieldDecorator}} = this.props;

		const FirstStep = (
			<Form {...formItemLayout}>
				<Form.Item label={formatMessage({id: 'product.excel.import.placeholder.select'})}>
					{getFieldDecorator('upload')(
						<Upload
							{...{
								fileList,
								beforeUpload: this.beforeUpload,
								onChange: this.handleChange
							}}
						>
							<Button>
								<Icon type="upload" /> {formatMessage({id: 'product.excel.import.placeholder.select'})}
							</Button>
						</Upload>
					)}
					<a href="javascript: void (0);" className={styles['download-template']} onClick={this.handleDownloadTemplate}>{formatMessage({id: 'product.excel.import.tip.download'})}</a>
				</Form.Item>
				<Form.Item label={formatMessage({id: 'product.excel.import.desc.title'})}>
					<p className={styles['upload-desc']}>1.{formatMessage({id: 'product.excel.import.tip.desc1'})}</p>
					<p className={styles['upload-desc']}>2.{formatMessage({id: 'product.excel.import.tip.desc2'})}</p>
					<p className={styles['upload-desc']}>3.{formatMessage({id: 'product.excel.import.tip.desc3'})}</p>
				</Form.Item>
				<Form.Item wrapperCol={{span: 12, offset: 6}}>
					<Button type="primary" onClick={this.nextStep} loading={readLoading} disabled={disabled}>
						{formatMessage({id: 'product.excel.import.btn.next'})}
					</Button>
				</Form.Item>
			</Form>
		);
		const SecondStep = (
			<div className={styles['second-step']}>
				<Progress percent={percent} status="active" />
				<p>{formatMessage({id: 'product.excel.import.loading'})}</p>
			</div>
		);
		const ThirdStep = (
			<div className={styles['third-step']}>
				<img src={require('@/assets/imgs/success.png')} alt="success" />
				<p className={styles['upload-success']}>{result.total_num}{formatMessage({id: 'product.excel.import.result.success'})}</p>
				<p className={styles['upload-fail']}>
					{result.failed_num}{formatMessage({id: 'product.excel.import.result.fail'})}{result.failed_num !== 0 ? <span>，<a href="javascript: void(0);" onClick={this.downloadErrorItems}>{formatMessage({id: 'product.excel.import.result.fail.download'})}</a></span> : null}
				</p>
				<Button type="primary" onClick={() => router.goBack()}>{formatMessage({id: 'product.excel.import.btn.back'})}</Button>
			</div>
		);

		return (
			<Card bodyStyle={{padding: '60px 120px'}}>
				<Steps current={current}>
					<Step title={formatMessage({id: 'product.excel.import.step1'})} />
					<Step title={formatMessage({id: 'product.excel.import.step2'})} />
					<Step title={formatMessage({id: 'product.excel.import.step3'})} />
				</Steps>
				<div style={{marginTop: 60}}>
					{
						current === 0 ?
							FirstStep :
							current === 1 ?
								SecondStep :
								ThirdStep
					}
				</div>
			</Card>
		);
	}
}

export default ExcelUpload;
