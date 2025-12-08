import React from 'react';
import { Helmet } from 'react-helmet-async';

const MetaData = ({ title = 'Bagify' }) => {
    const safeTitle = typeof title === 'string' ? title : 'Bagify';
    const truncated = safeTitle.length > 10
        ? `${safeTitle.slice(0, 10)}...`
        : safeTitle;

    return (
        <Helmet>
            <title>{truncated}</title>
        </Helmet>
    );
};

export default MetaData;