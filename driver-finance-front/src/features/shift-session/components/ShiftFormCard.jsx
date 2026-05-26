const ShiftFormCard = ({
	income,
	setIncome,

	gas,
	setGas,

	otherExpenses,
	setOtherExpenses,

	currentNet,

	todayShift,

	saving,
	loading,

	onOpenCloseModal,
}) => {
	return (
		<div className="shift-card">
			<h2>Turno del día</h2>

			<div className="input-group">
				<label>¿Cuánto llevas?</label>

				<input
					type="number"
					value={income}
					onChange={(e) => setIncome(e.target.value)}
					placeholder="0"
				/>
			</div>

			<div className="input-group">
				<label>Gasolina</label>

				<input
					type="number"
					value={gas}
					onChange={(e) => setGas(e.target.value)}
					placeholder="0"
				/>
			</div>

			<div className="input-group">
				<label>Otros gastos</label>

				<input
					type="number"
					value={otherExpenses}
					onChange={(e) =>
						setOtherExpenses(e.target.value)
					}
					placeholder="0"
				/>
			</div>

			<div className="live-net-card">
				<label>Ganancia actual</label>

				<h2>${currentNet}</h2>
			</div>

			<button
				className="primary-button"
				onClick={onOpenCloseModal}
				disabled={saving || loading}
			>
				{todayShift ? "Actualizar turno" : "Cerrar turno"}
			</button>
		</div>
	);
};

export default ShiftFormCard;