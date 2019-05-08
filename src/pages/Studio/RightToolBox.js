import React, {Component, Fragment} from 'react';
import {Col, Icon, Input, Row, Switch, Select, Radio, Slider, InputNumber} from 'antd';
import {SHAPE_TYPES, SIZES} from '@/constants/studio';
import * as styles from './index.less';

export default class RightToolBox extends Component {
    handleDetail = (key, value) => {
        const {
            componentsDetail, selectedShapeName, updateComponentsDetail, deleteSelectedComponent,
            addComponent
        } = this.props;

        if (key !== 'type') {
            updateComponentsDetail({
                [selectedShapeName]: {
                    [key]: value
                }
            });
        } else {
            const detail = componentsDetail[selectedShapeName];
            const oldNameIndex = detail.name.replace(/[^0-9]/ig, '');
            const newName = `${value}${oldNameIndex}`;
            deleteSelectedComponent(selectedShapeName);
            addComponent({
                ...detail,
                type: `${value}@${detail.type.split('@')[2] || ''}`,
                name: newName
            });
        }
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
        if (this.hasSubString(SHAPE_TYPES.VLine) || this.hasSubString(SHAPE_TYPES.HLine)) {
            menuMap.isLine = true;
        }
        if (this.hasSubString(SHAPE_TYPES.IMAGE)) {
            menuMap.isImage = true;
        }
        if (this.hasSubString(SHAPE_TYPES.PRICE)) {
            menuMap.hasBindData = true;
            menuMap.isPrice = true;
        }

        return menuMap;
    };

    hasSubString = (type) => {
        const {selectedShapeName} = this.props;
        return selectedShapeName.indexOf(type) > -1;
    };

    render() {
        const {componentsDetail, selectedShapeName} = this.props;
        const menuMap = this.getMenuMap();
        const detail = componentsDetail[selectedShapeName];

        return (
            <Fragment>
                {
                    menuMap.hasBindData ?
                        <div className={styles["tool-box-block"]}>
                            <h4>绑定数据</h4>
                            <Select defaultValue="price" style={{width: 220}}>
                                <Select.Option value="price">价格</Select.Option>
                                <Select.Option value="size">大小</Select.Option>
                                <Select.Option value="place">产地</Select.Option>
                            </Select>
                        </div> :
                        null
                }
                <div className={styles["tool-box-block"]}>
                    <Row gutter={20} style={{marginBottom: 10}}>
                        <Col span={12}>
                            <Input
                                style={{width: 100}}
                                addonAfter={<span>X</span>}
                                value={detail.x.toFixed()}
                                onChange={(e) => {this.handleDetail('x', parseInt(e.target.value, 10))}}
                            />
                        </Col>
                        <Col span={12}>
                            <Input
                                style={{width: 100}}
                                addonAfter={<span>Y</span>}
                                value={detail.y.toFixed()}
                                onChange={(e) => {this.handleDetail('y', parseInt(e.target.value, 10))}}
                            />
                        </Col>
                    </Row>
                    <Row gutter={20} style={{marginBottom: 10}}>
                        <Col span={12}>
                            <Input
                                style={{width: 100}}
                                addonAfter={<span>宽</span>}
                                value={Math.round(detail.width * detail.scaleX)}
                                onChange={(e) => {this.handleDetail('width', e.target.value / detail.scaleX)}}
                            />
                        </Col>
                        <Col span={12}>
                            <Input
                                style={{width: 100}}
                                addonAfter={<span>高</span>}
                                value={Math.round(detail.height * detail.scaleY)}
                                onChange={(e) => {this.handleDetail('height', e.target.value / detail.scaleY)}}
                            />
                        </Col>
                    </Row>
                    {
                        /*
                        <Row gutter={20}>
                            <Col span={12}>
                                <Input style={{width: 100}} addonAfter={<Icon type="undo"/>}/>
                            </Col>
                            <Col span={12}/>
                        </Row>
                        */
                    }
                </div>
                {
                    menuMap.isRect ?
                        <div className={styles["tool-box-block"]}>
                            <h4>样式</h4>
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={24}>
                                    填充颜色
                                </Col>
                                <Col span={24}>
                                    <Radio.Group
                                        style={{width: '100%'}}
                                        value={detail.fill}
                                        onChange={(e) => {this.handleDetail('fill', e.target.value)}}
                                    >
                                        <Radio.Button style={{width: '33.33%'}} value="black">黑</Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="white">白</Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="red">红</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={24}>
                                    边框宽度
                                </Col>
                                <Col span={24}>
                                    <Radio.Group
                                        style={{width: '100%'}}
                                        value={detail.strokeWidth}
                                        onChange={(e) => {this.handleDetail('strokeWidth', parseInt(e.target.value, 10))}}
                                    >
                                        <Radio.Button style={{width: '25%'}} value={0}>无</Radio.Button>
                                        <Radio.Button style={{width: '25%'}} value={1}>1px</Radio.Button>
                                        <Radio.Button style={{width: '25%'}} value={3}>3px</Radio.Button>
                                        <Radio.Button style={{width: '25%'}} value={5}>5px</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={24}>
                                    边框颜色
                                </Col>
                                <Col span={24}>
                                    <Radio.Group
                                        style={{width: '100%'}}
                                        value={detail.stroke}
                                        onChange={(e) => {this.handleDetail('stroke', e.target.value)}}
                                    >
                                        <Radio.Button style={{width: '33.33%'}} value="black">黑</Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="white">白</Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="red">红</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={24}>
                                    圆角直径
                                </Col>
                                <Col span={16}>
                                    <Slider
                                        min={0}
                                        max={SIZES.DEFAULT_RECT_WIDTH / 2}
                                        value={detail.cornerRadius}
                                        onChange={(value) => {this.handleDetail('cornerRadius', value)}}
                                    />
                                </Col>
                                <Col span={8}>
                                    <InputNumber
                                        style={{width: '100%'}}
                                        min={0}
                                        max={SIZES.DEFAULT_RECT_WIDTH / 2}
                                        value={detail.cornerRadius}
                                        onChange={(value) => {this.handleDetail('cornerRadius', value)}}
                                    />
                                </Col>
                            </Row>
                        </div> :
                        null
                }
                {
                    menuMap.isText ?
                        <div className={styles["tool-box-block"]}>
                            <h4>文本</h4>
                            <Row style={{marginBottom: 10}}>
                                <Col span={24}>
                                    <Input
                                        placeholder="文本内容"
                                        value={detail.text}
                                        onChange={(e) => {this.handleDetail('text', e.target.value)}}
                                    />
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}}>
                                <Col span={4}>
                                    <span className={styles.title}>字体</span>
                                </Col>
                                <Col span={20}>
                                    <Select
                                        style={{width: '100%'}}
                                        value={detail.fontFamily}
                                        onChange={(value) => {this.handleDetail('fontFamily', value)}}
                                    >
                                        <Select.Option value="Zfull-GB">Zfull-GB</Select.Option>
                                        <Select.Option value="Arial">Arial</Select.Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}}>
                                <Col span={4}>
                                    <span className={styles.title}>字号</span>
                                </Col>
                                <Col span={7}>
                                    <InputNumber
                                        style={{width: '100%'}}
                                        placeholder="字号"
                                        value={detail.fontSize}
                                        onChange={(value) => {this.handleDetail('fontSize', value)}}
                                    />
                                </Col>
                                <Col span={2} />
                                <Col span={4}>
                                    <span className={styles.title}>间距</span>
                                </Col>
                                <Col span={7}>
                                    <InputNumber
                                        style={{width: '100%'}}
                                        placeholder="间距"
                                        value={detail.letterSpacing}
                                        onChange={(value) => {this.handleDetail('letterSpacing', value)}}
                                    />
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={6} className={`${styles.formatter} ${detail.fontStyle === 'bold' ? `${styles.active}` : ''}`}>
                                    <Icon
                                        type="bold"
                                        onClick={() => {this.handleDetail('fontStyle', detail.fontStyle === 'bold' ? 'normal' : 'bold')}}
                                    />
                                </Col>
                                <Col span={6} className={`${styles.formatter} ${detail.fontStyle === 'italic' ? `${styles.active}` : ''}`}>
                                    <Icon
                                        type="italic"
                                        onClick={() => {this.handleDetail('fontStyle', detail.fontStyle === 'italic' ? 'normal' : 'italic')}}
                                    />
                                </Col>
                                <Col span={6} className={`${styles.formatter} ${detail.textDecoration === 'underline' ? `${styles.active}` : ''}`}>
                                    <Icon
                                        type="underline"
                                        onClick={() => {this.handleDetail('textDecoration', detail.fontStyle === 'underline' ? 'normal' : 'underline')}}
                                    />
                                </Col>
                                <Col span={6} className={`${styles.formatter} ${detail.textDecoration === 'line-through' ? `${styles.active}` : ''}`}>
                                    <Icon
                                        type="strikethrough"
                                        onClick={() => {this.handleDetail('textDecoration', detail.fontStyle === 'line-through' ? 'normal' : 'line-through')}}
                                    />
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={24}>
                                    字体颜色
                                </Col>
                                <Col span={24}>
                                    <Radio.Group
                                        style={{width: '100%'}}
                                        value={detail.fill}
                                        onChange={(e) => {this.handleDetail('fill', e.target.value)}}
                                    >
                                        <Radio.Button style={{width: '33.33%'}} value="black">黑</Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="white">白</Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="red">红</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={24}>
                                    背景颜色
                                </Col>
                                <Col span={24}>
                                    <Radio.Group
                                        style={{width: '100%'}}
                                        value={detail.textBg}
                                        onChange={(e) => {this.handleDetail('textBg', e.target.value)}}
                                    >
                                        <Radio.Button style={{width: '25%'}} value="opacity">透</Radio.Button>
                                        <Radio.Button style={{width: '25%'}} value="black">黑</Radio.Button>
                                        <Radio.Button style={{width: '25%'}} value="white">白</Radio.Button>
                                        <Radio.Button style={{width: '25%'}} value="red">红</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={24}>
                                    对齐
                                </Col>
                                <Col span={24}>
                                    <Radio.Group
                                        style={{width: '100%'}}
                                        value={detail.align}
                                        onChange={(e) => {this.handleDetail('align', e.target.value)}}
                                    >
                                        <Radio.Button style={{width: '33.33%'}} value="left">
                                            <Icon type="align-left" />
                                        </Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="center">
                                            <Icon type="align-center" />
                                        </Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="right">
                                            <Icon type="align-right" />
                                        </Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}} gutter={40}>
                                <Col span={16}>
                                    自动对齐宽度
                                </Col>
                                <Col span={8}>
                                    <Switch defaultChecked />
                                </Col>
                            </Row>
                        </div> :
                        null
                }
                {
                    menuMap.isLine ?
                        <div className={styles["tool-box-block"]}>
                            <h4>样式</h4>
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={24}>
                                    颜色
                                </Col>
                                <Col span={24}>
                                    <Radio.Group
                                        style={{width: '100%'}}
                                        value={detail.stroke}
                                        onChange={(e) => {this.handleDetail('stroke', e.target.value)}}
                                    >
                                        <Radio.Button style={{width: '33.33%'}} value="black">黑</Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="white">白</Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="red">红</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={24}>
                                    宽度
                                </Col>
                                <Col span={24}>
                                    <Radio.Group
                                        style={{width: '100%'}}
                                        value={detail.strokeWidth}
                                        onChange={(e) => {this.handleDetail('strokeWidth', e.target.value)}}
                                    >
                                        <Radio.Button style={{width: '33.33%'}} value={1}>1px</Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value={3}>3px</Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value={5}>5px</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                        </div> :
                        null
                }
                {
                    menuMap.isImage ?
                        <div className={styles["tool-box-block"]}>
                            <h4>样式</h4>
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={24}>
                                    颜色
                                </Col>
                                <Col span={24}>
                                    <Radio.Group style={{width: '100%'}} value="black">
                                        <Radio.Button style={{width: '33.33%'}} value="black">黑</Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="white">白</Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="red">红</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                        </div> :
                        null
                }
                {
                    menuMap.isPrice ?
                        <div className={styles["tool-box-block"]}>
                            <h4>样式</h4>
                            <Row style={{marginBottom: 10}}>
                                <Col span={24}>
                                    <Input
                                        placeholder="价格"
                                        value={detail.text}
                                        onChange={(e) => {this.handleDetail('text', e.target.value)}}
                                    />
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}}>
                                <Col span={4}>
                                    <span className={styles.title}>字体</span>
                                </Col>
                                <Col span={20}>
                                    <Select
                                        style={{width: '100%'}}
                                        value={detail.fontFamily}
                                        onChange={(value) => {this.handleDetail('fontFamily', value)}}
                                    >
                                        <Select.Option value="Zfull-GB">Zfull-GB</Select.Option>
                                        <Select.Option value="Arial">Arial</Select.Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}} gutter={10}>
                                <Col span={12}>
                                    <Row>
                                        <Col span={24}>
                                            <span className={styles.title}>整数字号</span>
                                        </Col>
                                        <Col span={24}>
                                            <InputNumber
                                                style={{width: '100%'}}
                                                placeholder="整数字号"
                                                value={detail.fontSize}
                                                onChange={(value) => {this.handleDetail('fontSize', value)}}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <Row>
                                        <Col span={24}>
                                            <span className={styles.title}>小数字号</span>
                                        </Col>
                                        <Col span={24}>
                                            <InputNumber
                                                style={{width: '100%'}}
                                                placeholder="小数字号"
                                                value={detail.smallFontSize}
                                                onChange={(value) => {this.handleDetail('smallFontSize', value)}}
                                            />
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={6} className={`${styles.formatter} ${detail.fontStyle === 'bold' ? `${styles.active}` : ''}`}>
                                    <Icon
                                        type="bold"
                                        onClick={() => {this.handleDetail('fontStyle', detail.fontStyle === 'bold' ? 'normal' : 'bold')}}
                                    />
                                </Col>
                                <Col span={6} className={`${styles.formatter} ${detail.fontStyle === 'italic' ? `${styles.active}` : ''}`}>
                                    <Icon
                                        type="italic"
                                        onClick={() => {this.handleDetail('fontStyle', detail.fontStyle === 'italic' ? 'normal' : 'italic')}}
                                    />
                                </Col>
                                <Col span={6} className={`${styles.formatter} ${detail.textDecoration === 'underline' ? `${styles.active}` : ''}`}>
                                    <Icon
                                        type="underline"
                                        onClick={() => {this.handleDetail('textDecoration', detail.fontStyle === 'underline' ? 'normal' : 'underline')}}
                                    />
                                </Col>
                                <Col span={6} className={`${styles.formatter} ${detail.textDecoration === 'line-through' ? `${styles.active}` : ''}`}>
                                    <Icon
                                        type="strikethrough"
                                        onClick={() => {this.handleDetail('textDecoration', detail.fontStyle === 'line-through' ? 'normal' : 'line-through')}}
                                    />
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={24}>
                                    字体颜色
                                </Col>
                                <Col span={24}>
                                    <Radio.Group
                                        style={{width: '100%'}}
                                        value={detail.fill}
                                        onChange={(e) => {this.handleDetail('fill', e.target.value)}}
                                    >
                                        <Radio.Button style={{width: '33.33%'}} value="black">黑</Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="white">白</Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="red">红</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={24}>
                                    背景颜色
                                </Col>
                                <Col span={24}>
                                    <Radio.Group
                                        style={{width: '100%'}}
                                        value={detail.textBg}
                                        onChange={(e) => {this.handleDetail('textBg', e.target.value)}}
                                    >
                                        <Radio.Button style={{width: '25%'}} value="opacity">透</Radio.Button>
                                        <Radio.Button style={{width: '25%'}} value="black">黑</Radio.Button>
                                        <Radio.Button style={{width: '25%'}} value="white">白</Radio.Button>
                                        <Radio.Button style={{width: '25%'}} value="red">红</Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={24}>
                                    小数显示类型
                                </Col>
                                <Col span={24}>
                                    <Radio.Group
                                        style={{width: '100%'}}
                                        value={`${detail.type.split('@')[0]}@${detail.type.split('@')[1]}`}
                                        onChange={(e) => {this.handleDetail('type', e.target.value)}}
                                    >
                                        <Radio.Button style={{width: '33.33%'}} value="PRICE@NORMAL">
                                            <span style={{fontSize: 16}}>99.00</span>
                                        </Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="PRICE@SUPER">
                                            <span style={{fontSize: 16}}>99.<sup>00</sup></span>
                                        </Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="PRICE@SUB">
                                            <span style={{fontSize: 16}}>99.<sub>00</sub></span>
                                        </Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={24}>
                                    小数位数
                                </Col>
                                <Col span={24}>
                                    <Radio.Group
                                        style={{width: '100%'}}
                                        value={detail.align}
                                        onChange={(e) => {this.handleDetail('align', e.target.value)}}
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
                            <Row style={{marginBottom: 10}} gutter={20}>
                                <Col span={24}>
                                    对齐
                                </Col>
                                <Col span={24}>
                                    <Radio.Group
                                        style={{width: '100%'}}
                                        value={detail.align}
                                        onChange={(e) => {this.handleDetail('align', e.target.value)}}
                                    >
                                        <Radio.Button style={{width: '33.33%'}} value="left">
                                            <Icon type="align-left" />
                                        </Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="center">
                                            <Icon type="align-center" />
                                        </Radio.Button>
                                        <Radio.Button style={{width: '33.33%'}} value="right">
                                            <Icon type="align-right" />
                                        </Radio.Button>
                                    </Radio.Group>
                                </Col>
                            </Row>
                        </div> :
                        null
                }
            </Fragment>
        )
    }
}