import React, {Component} from 'react';
import {Card, Steps, Form, Upload, Button, Icon, Progress} from 'antd';
import * as styles from './ExcelUpload.less';

const {Step} = Steps;

const formItemLayout = {
	labelCol: {span: 6},
	wrapperCol: {span: 10}
};

@Form.create()
class ExcelUpload extends Component {
	constructor(props) {
		super(props);
		this.state = {
			current: 0,
			fileList: [],
			readLoading: false
		};
	}

	nextStep = () => {
		const {current} = this.state;
		this.setState({
			current: current + 1
		});
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

	beforeUpload = (file) => new Promise((resolve, reject) => {
		if (file.name.indexOf('.xlsx') === -1 && file.name.indexOf('.xls') === -1) {
			reject(new Error('格式不对'));
		}
		this.setState({
			readLoading: true
		});
		this.handleFile(file).then((data) => {
			this.setState({
				readLoading: false
			});
			reject(new Error(data));
		});
	});

	handleChange = info => {
		let fileList = [...info.fileList];

		fileList = fileList.slice(-1);

		this.setState({fileList});
	}

	render() {
		const {current, fileList, readLoading} = this.state;
		const {form: {getFieldDecorator}} = this.props;

		const FirstStep = (
			<Form {...formItemLayout}>
				<Form.Item label="选择文件">
					{getFieldDecorator('upload')(
						<Upload
							{...{
								fileList,
								beforeUpload: this.beforeUpload,
								onChange: this.handleChange
							}}
						>
							<Button>
								<Icon type="upload" /> 选择文件
							</Button>
						</Upload>
					)}
					<a href="javascript: void (0);" className={styles['download-template']}>下载导入模板</a>
				</Form.Item>
				<Form.Item label="导入说明">
					<p className={styles['upload-desc']}>1.仅支持导入.xlsx和.xls的表格文件；</p>
					<p className={styles['upload-desc']}>2.商品分类和商品单位如果不存在将新增；</p>
					<p className={styles['upload-desc']}>3.导入商品编号和已有商品相同时将会更新该商品。</p>
				</Form.Item>
				<Form.Item wrapperCol={{span: 12, offset: 6}}>
					<Button type="primary" onClick={this.nextStep} loading={readLoading}>
						下一步
					</Button>
				</Form.Item>
			</Form>
		);
		const SecondStep = (
			<div className={styles['second-step']}>
				<Progress percent={50} status="active" />
				<p>正在导入商品数据，请耐心等待...</p>
			</div>
		);
		const ThirdStep = (
			<div className={styles['third-step']}>
				<img src={require('@/assets/imgs/success.png')} alt="success" />
				<p className={styles['upload-success']}>500条商品数据导入成功</p>
				<p className={styles['upload-fail']}>1条商品数据导入失败，<a href="javascript: void(0);">下载导入失败结果</a></p>
				<Button type="primary">返回列表</Button>
			</div>
		);

		return (
			<Card bodyStyle={{padding: '60px 120px'}}>
				<Steps current={current}>
					<Step title="上传文件" />
					<Step title="导入数据" />
					<Step title="导入完成" />
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
