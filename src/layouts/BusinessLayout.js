import React from 'react';

class BusinessLayout extends React.PureComponent {
    render() {
        const { children } = this.props;
        return (
            <div>
                <div>
                    {children}
                </div>
            </div>
        );
    }
}

export default BusinessLayout;
