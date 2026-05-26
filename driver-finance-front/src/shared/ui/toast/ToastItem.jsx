const ToastItem = ({
	toast,
	onRemove,
}) => {
	return (
		<div className={`toast toast-${toast.type}`}>
			<div className="toast-message">
				{toast.message}
			</div>

			<button
				className="toast-close"
				onClick={() => onRemove(toast.id)}
			>
				×
			</button>
		</div>
	);
};

export default ToastItem;