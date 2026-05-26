const GoalModal = ({
	show,
	goalAmount,
	goalEndDate,
	onGoalAmountChange,
	onGoalEndDateChange,
	onClose,
	onConfirm,
	saving,
}) => {
	if (!show) {
		return null;
	}

	return (
		<div className="modal-overlay">
			<div className="modal">
				<h2>Crear meta</h2>

				<div className="input-group">
					<label>Monto objetivo</label>

					<input
						type="number"
						value={goalAmount}
						onChange={(e) =>
							onGoalAmountChange(e.target.value)
						}
          disabled = {saving}
					/>
				</div>

				<div className="input-group">
					<label>Fecha final</label>

					<input
						type="date"
						value={goalEndDate}
						onChange={(e) =>
							onGoalEndDateChange(e.target.value)
						}
          disabled = {saving}
					/>
				</div>

				<div className="modal-actions">
					<button
						className="secondary-button"
						onClick={onClose}
						disabled={saving}
					>
						Cancelar
					</button>

					<button
						className="primary-button"
						onClick={onConfirm}
						disabled={saving}
					>
					{saving ? "Creando..." : "Crear meta"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default GoalModal;