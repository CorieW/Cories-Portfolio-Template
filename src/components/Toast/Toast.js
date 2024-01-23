import React from 'react';
import './Toast.scss';
import { useStore } from '../../store';

function Toast() {
    const toast = useStore((state) => state.toast);
    const setToast = useStore((state) => state.setToast);

    if (toast == null) return null;

    return (
        <div id='toast'>
            <div className={toast.type + ' center fade-in'}>
                <span>{toast.message}</span>
                <button onClick={() => setToast(null)}>
                    <i class='fa-solid fa-xmark'></i>
                </button>
            </div>
        </div>
    );
}

export default Toast;
