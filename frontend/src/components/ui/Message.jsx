import React from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const Message = ({ variant = 'info', children, onClose }) => {
    // Define styles based on variant
    const getVariantStyles = () => {
        switch (variant) {
            case 'success':
                return {
                    container: 'bg-green-50 border border-green-200 text-green-800',
                    icon: 'text-green-500',
                    closeButton: 'text-green-500 hover:text-green-700'
                };
            case 'danger':
            case 'error':
                return {
                    container: 'bg-red-50 border border-red-200 text-red-800',
                    icon: 'text-red-500',
                    closeButton: 'text-red-500 hover:text-red-700'
                };
            case 'warning':
                return {
                    container: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
                    icon: 'text-yellow-500',
                    closeButton: 'text-yellow-500 hover:text-yellow-700'
                };
            case 'info':
            default:
                return {
                    container: 'bg-blue-50 border border-blue-200 text-blue-800',
                    icon: 'text-blue-500',
                    closeButton: 'text-blue-500 hover:text-blue-700'
                };
        }
    };

    const getVariantIcon = () => {
        switch (variant) {
            case 'success':
                return <CheckCircle size={20} className="text-green-500" />;
            case 'danger':
            case 'error':
                return <AlertCircle size={20} className="text-red-500" />;
            case 'warning':
                return <AlertTriangle size={20} className="text-yellow-500" />;
            case 'info':
            default:
                return <Info size={20} className="text-blue-500" />;
        }
    };

    const styles = getVariantStyles();

    return (
        <div className={`rounded-lg p-4 mb-6 ${styles.container} relative`}>
            <div className="flex items-start">
                <div className={`flex-shrink-0 mr-3 ${styles.icon}`}>
                    {getVariantIcon()}
                </div>
                <div className="flex-1">
                    <p className="text-sm font-medium">{children}</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className={`flex-shrink-0 ml-4 ${styles.closeButton} transition-colors`}
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Message;