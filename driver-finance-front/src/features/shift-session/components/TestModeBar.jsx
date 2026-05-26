const TestModeBar = ({
	currentDate,
	testMode,
	onNextDay,
	onResetDate,
}) => {
	return (
		<div className="test-mode-bar">
			<div>
				<label>Fecha actual</label>

				<h3>{currentDate}</h3>
			</div>

			<div className="test-actions">
				<button
					className="secondary-button"
					onClick={onNextDay}
				>
					Siguiente día
				</button>

				{testMode && (
					<button
						className="secondary-button"
						onClick={onResetDate}
					>
						Volver a hoy
					</button>
				)}
			</div>
		</div>
	);
};

export default TestModeBar;