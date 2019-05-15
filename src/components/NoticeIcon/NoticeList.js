import React from 'react';
import { Avatar, List } from 'antd';
import { AVATA_IMG } from '@/constants/index';
import classNames from 'classnames';
import styles from './NoticeList.less';

export default function NoticeList({
    data = [],
    onClick,
    onClear,
    title,
    locale,
    emptyText,
    emptyImage,
    onViewMore = null,
    showClear = false,
}) {
    if (data.length === 0) {
        return (
            <div className={styles.notFound}>
                {emptyImage ? <img src={emptyImage} alt="not found" /> : null}
                <div>{emptyText || locale.emptyText}</div>
            </div>
        );
    }
    return (
        <div>
            <List className={styles.list}>
                {data.map((item, i) => {
                    const itemCls = classNames(styles.item, {
                        [styles.read]: item.receive_status,
                    });
                    // eslint-disable-next-line no-nested-ternary
                    const leftIcon = (
                        <Avatar
                            className={styles.avatar}
                            icon={AVATA_IMG[item.level].icon}
                            style={{ color: AVATA_IMG[item.level].color }}
                        />
                    );
                    return (
                        <List.Item
                            className={itemCls}
                            key={item.msg_id || i}
                            onClick={() => onClick(item)}
                        >
                            <List.Item.Meta
                                className={styles.meta}
                                avatar={leftIcon}
                                title={
                                    <div className={styles.title}>
                                        {item.title}
                                        <div className={styles.extra}>{item.extra}</div>
                                    </div>
                                }
                                description={
                                    <div>
                                        {/* <div
                                            className={styles.description}
                                            title={item.description}
                                        >
                                            {item.description}
                                        </div> */}
                                        <div className={styles.datetime}>{item.receive_time}</div>
                                    </div>
                                }
                            />
                        </List.Item>
                    );
                })}
            </List>
            <div className={styles.bottomBar}>
                {showClear ? (
                    <div onClick={onClear}>
                        {locale.clear} {locale[title] || title}
                    </div>
                ) : null}
                <div onClick={onViewMore}>{locale.viewMore}</div>
            </div>
        </div>
    );
}
