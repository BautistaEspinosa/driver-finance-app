import ToastItem from "./ToastItem";

import "./toast.css";

const ToastContainer = ({
	toasts,
	onRemove,
}) => {
	return (
		<div className="toast-container">
			{toasts.map((toast) => (
				<ToastItem
					key={toast.id}
					toast={toast}
					onRemove={onRemove}
				/>
			))}
		</div>
	);
};

export default ToastContainer;