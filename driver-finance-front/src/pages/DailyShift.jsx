import "./DailyShift.css";

import GoalCard from "../features/shift-session/components/GoalCard";
import ShiftFormCard from "../features/shift-session/components/ShiftFormCard";
import TestModeBar from "../features/shift-session/components/TestModeBar";
import GoalModal from "../features/shift-session/components/GoalModal";
import CloseShiftModal from "../features/shift-session/components/CloseShiftModal";

import LoadingOverlay from "../shared/ui/loading/LoadingOverlay";

import useShiftSessionController from "../features/shift-session/controllers/useShiftSessionController";

const DailyShift = () => {
	const { state, actions } = useShiftSessionController();

	return (
		<div className="daily-shift-container">

			{state.loading && (
				<LoadingOverlay message="Cargando información..." />
			)}

			<div className="daily-shift-card">

				<div className="header">
					<h1>Driver Finance</h1>
					<p>Resumen del turno</p>
				</div>

				<TestModeBar
					currentDate={state.currentDate}
					testMode={state.testMode}
					onNextDay={actions.handleNextDay}
					onResetDate={actions.handleResetDate}
				/>

				<GoalCard
					goal={state.goal}
					projectedCurrent={state.projectedCurrent}
					projectedRemaining={state.projectedRemaining}
					projectedPerDay={state.projectedPerDay}
					onOpenGoalModal={actions.openGoalModal}
				/>

				<ShiftFormCard
					income={state.income}
					setIncome={actions.setIncome}
					gas={state.gas}
					setGas={actions.setGas}
					otherExpenses={state.otherExpenses}
					setOtherExpenses={actions.setOtherExpenses}
					currentNet={state.currentNet}
					todayShift={state.todayShift}
					loading={state.loading}
					saving={state.saving}
					onOpenCloseModal={actions.openCloseModal}
				/>
			</div>

			<GoalModal
				show={state.showGoalModal}
				goalAmount={state.goalAmount}
				goalEndDate={state.goalEndDate}
				onGoalAmountChange={actions.setGoalAmount}
				onGoalEndDateChange={actions.setGoalEndDate}
				onClose={actions.closeGoalModal}
				onConfirm={actions.handleCreateGoal}
				saving={state.saving}
			/>

			<CloseShiftModal
				show={state.showCloseModal}
				todayShift={state.todayShift}
				income={state.income}
				gas={state.gas}
				otherExpenses={state.otherExpenses}
				currentNet={state.currentNet}
				onClose={actions.closeCloseModal}
				onConfirm={actions.handleSaveShift}
				saving={state.saving}
			/>
		</div>
	);
};

export default DailyShift;