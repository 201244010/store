import React from 'react';

class BusinessLayout extends React.PureComponent {
    render() {
        const { children } = this.props;
        return (
            <div>
                {children}
            </div>
        );
    }
}

export default BusinessLayout;
