import React, { Component } from 'react';
import { connect } from "dva";
import SearchResult from './SearchResult';
import * as styles from './index.less';

@connect(
    state => ({
        template: state.template,
    }),
    dispatch => ({
        fetchTemplates: payload => dispatch({ type: 'template/fetchTemplates', payload })
    })
)
class Template extends Component {
    componentDidMount() {
        const {
            fetchTemplates,
        } = this.props;

        fetchTemplates({
            options: {
                current: 1,
                screen_type: -1,
                colour: -1
            },
        });
    }

    render() {
        const {
            fetchTemplates,
            template: {
                loading,
                data,
                pagination
            }
        } = this.props;

        return (
            <div className={styles['content-container']}>
                <SearchResult
                    {
                        ...{
                            loading,
                            data,
                            pagination,
                            fetchTemplates
                        }
                    }
                />
            </div>
        )
    }
}

export default Template;
