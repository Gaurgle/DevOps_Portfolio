import React from 'react';

type Props = {
    children: React.ReactNode;
};

const BorderBeam: React.FC<Props> = ({ children }) => {
    return (
        <div className="relative">
            <div
                className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500  to-red-500
        rounded-lg blur-md"
                style={{ zIndex: 1 }}
            ></div>

            {/* Child content container */}
            <div className="relative bg-gray-100 rounded-lg p-1 z-10">{children}</div>
        </div>
    );
};

export default BorderBeam;