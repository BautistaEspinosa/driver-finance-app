import {
	createContext,
	useCallback,
	useMemo,
	useState,
} from "react";

import ToastContainer from "./ToastContainer";

import { TOAST_TYPES } from "./toastTypes";

export const ToastContext = createContext(null);

const ToastProvider = ({ children }) => {
	const [toasts, setToasts] = useState([]);

	const removeToast = useCallback((id) => {
		setToasts((prev) => prev.filter((toast) => toast.id !== id));
	}, []);

	const addToast = useCallback((type, message) => {
		const id = crypto.randomUUID();

		const toast = {
			id,
			type,
			message,
		};

		setToasts((prev) => [...prev, toast]);

		setTimeout(() => {
			removeToast(id);
		}, 3500);
	}, [removeToast]);

	const success = useCallback((message) => {
		addToast(TOAST_TYPES.SUCCESS, message);
	}, [addToast]);

	const error = useCallback((message) => {
		addToast(TOAST_TYPES.ERROR, message);
	}, [addToast]);

	const warning = useCallback((message) => {
		addToast(TOAST_TYPES.WARNING, message);
	}, [addToast]);

	const info = useCallback((message) => {
		addToast(TOAST_TYPES.INFO, message);
	}, [addToast]);

	const value = useMemo(() => ({
		success,
		error,
		warning,
		info,
	}), [
		success,
		error,
		warning,
		info,
	]);

	return (
		<ToastContext.Provider value={value}>
			{children}

			<ToastContainer
				toasts={toasts}
				onRemove={removeToast}
			/>
		</ToastContext.Provider>
	);
};

export default ToastProvider;