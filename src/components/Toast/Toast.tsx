import './Toast.scss';

export interface IToast {
    message: string | null;
    type: 'error' | 'success' | 'info';
}

type Props = {
    toast: IToast | null;
    setToast: (message: IToast | null) => void;
};

function Toast(props: Props) {
    const { toast, setToast } = props;

    if (toast == null) return null;

    return (
        <div id='toast'>
            <div className={toast.type + ' center fade-in'}>
                <span>{toast.message}</span>
                <button onClick={() => setToast(null)}>
                    <i className='fa-solid fa-xmark'></i>
                </button>
            </div>
        </div>
    );
}

export default Toast;
