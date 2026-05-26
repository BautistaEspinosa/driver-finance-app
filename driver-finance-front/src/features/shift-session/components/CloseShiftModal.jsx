const CloseShiftModal = ({
	show,
	todayShift,
	income,
	gas,
	otherExpenses,
	currentNet,
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
				<h2>
					{todayShift
						? "Actualizar turno"
						: "Cerrar turno"}
				</h2>

				<div className="resume-grid">
					<div>
						<label>Ingresos</label>
						<h3>${income || 0}</h3>
					</div>

					<div>
						<label>Gasolina</label>
						<h3>${gas || 0}</h3>
					</div>

					<div>
						<label>Otros</label>
						<h3>${otherExpenses || 0}</h3>
					</div>

					<div>
						<label>Neto</label>
						<h3>${currentNet}</h3>
					</div>
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

export default CloseShiftModal;