import "./loading.css";

const Spinner = ({
	size = "md",
}) => {

	return (
		<div
			className={`spinner spinner-${size}`}
		/>
	);
};

export default Spinner;