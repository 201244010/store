import React from "react";
import { Col, Row } from "antd";
import { ESL_STATES } from "@/constants";
import { unixSecondToDate, formatEmpty } from "@/utils/utils";
import "./index.less";

const ROW_GUTTER = 16;
const COL_SPAN = 12;

export default function detail(props) {
    const { detailInfo } = props;
    const eslInfo = formatEmpty(detailInfo, "--");
    console.log(eslInfo);

    return (
        <Row gutter={ROW_GUTTER}>
            <Col span={COL_SPAN}>
                <div className="detail-info-item">
                    <span className="detail-info-label">价签ID：</span>
                    <span className="detail-info-content">{eslInfo.esl_code}</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">价签SN：</span>
                    <span className="detail-info-content">{eslInfo.sn}</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">价签型号：</span>
                    <span className="detail-info-content">{eslInfo.model}</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">屏幕尺寸：</span>
                    <span className="detail-info-content">{eslInfo.screen_size}</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">固件版本：</span>
                    <span className="detail-info-content">{eslInfo.status === 0 ? "-" : eslInfo.bin_version}</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">电量：</span>
                    <span className="detail-info-content">{eslInfo.battery}%</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">设备状态：</span>
                    <span className="detail-info-content">{ESL_STATES[eslInfo.status]}</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">最后通信时间：</span>
                    <span className="detail-info-content">{eslInfo.connect_time ? unixSecondToDate(eslInfo.connect_time, "YYYY-MM-DD HH:mm") : "--"}</span>
                </div>
            </Col>
            <Col span={COL_SPAN}>
                <div className="detail-info-item">
                    <span className="detail-info-label">所属门店：</span>
                    <span className="detail-info-content">{eslInfo.shop_name}</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">连接基站名称：</span>
                    <span className="detail-info-content">{eslInfo.ap_name}</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">绑定商品编号：</span>
                    <span className="detail-info-content">{eslInfo.product_seq_num}</span>
                </div>
                <div className="detail-info-item">
                    <span className="detail-info-label">绑定商品名称：</span>
                    <span className="detail-info-content">{eslInfo.product_name}</span>
                </div>
            </Col>
        </Row>
    );
}