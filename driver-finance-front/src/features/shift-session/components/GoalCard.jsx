import { memo } from "react";

const GoalCard = ({
	goal,
	projectedCurrent,
	projectedRemaining,
	projectedPerDay,
	onOpenGoalModal,
}) => {
	if (!goal) {
		return (
			<div className="empty-goal-card">
				<h2>No tienes una meta activa</h2>

				<p>
					Crea una meta financiera para comenzar a medir tu
					progreso.
				</p>

				<button
					className="primary-button"
					onClick={onOpenGoalModal}
				>
					Crear meta
				</button>
			</div>
		);
	}

	return (
		<div className="goal-card">
			<div className="goal-card-header">
				<h2>Meta activa</h2>

				<span
					className={`status ${goal.status?.toLowerCase()}`}
				>
					{goal.status}
				</span>
			</div>

			<div className="goal-grid">
				<div>
					<label>Meta</label>
					<h3>${goal.targetAmount}</h3>
				</div>

				<div>
					<label>Actual</label>
					<h3>${projectedCurrent.toFixed(0)}</h3>
				</div>

				<div>
					<label>Restante</label>
					<h3>${projectedRemaining.toFixed(0)}</h3>
				</div>

				<div>
					<label>Por día</label>
					<h3>${projectedPerDay.toFixed(0)}</h3>
				</div>
			</div>

			<div className="progress-container">
				<div
					className="progress-bar"
					style={{
						width: `${
							(projectedCurrent / goal.targetAmount) * 100
						}%`,
					}}
				/>
			</div>
		</div>
	);
};

export default memo(GoalCard);