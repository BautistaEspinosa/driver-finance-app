import Spinner from "./Spinner";

import "./loading.css";

const LoadingOverlay = ({
	message = "Cargando...",
}) => {

	return (
		<div className="loading-overlay">

			<div className="loading-content">

				<Spinner size="lg" />

				<p>{message}</p>

			</div>

		</div>
	);
};

export default LoadingOverlay;