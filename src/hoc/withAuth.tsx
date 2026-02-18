import React from 'react';

const withAuth = (Component: React.ComponentType) => {
    return (props: any) => {
        return <Component {...props} />;
    };
};

export default withAuth;
