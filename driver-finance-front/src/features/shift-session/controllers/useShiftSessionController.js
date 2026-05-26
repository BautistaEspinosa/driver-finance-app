import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import {
	createShift,
	updateShift,
	getShifts,
	getGoalProgress,
	createGoal,
	getCurrentDevDate,
	setDevDate,
	resetDevDate,
} from "../../../api/shiftApi";

import {
	calculateProjectedCurrent,
	calculateProjectedRemaining,
	calculateProjectedPerDay,
} from "../domain/sessionCalculations";

import { useShiftSession } from "../hooks/useShiftSession";

import { debugLog } from "../../../shared/debug/debugLogger";
import { useToast } from "../../../shared/ui/toast/useToast";

const useShiftSessionController = () => {
	const toast = useToast();

	const {
		income,
		setIncome,
		gas,
		setGas,
		otherExpenses,
		setOtherExpenses,
		currentNet,
		hydrateSession,
	} = useShiftSession();

	const [goalAmount, setGoalAmount] = useState("");
	const [goalEndDate, setGoalEndDate] = useState("");

	const [goal, setGoal] = useState(null);
	const [todayShift, setTodayShift] = useState(null);

	const [loading, setLoading] = useState(false);
	const [saving, setSaving] = useState(false);

	const [showGoalModal, setShowGoalModal] = useState(false);
	const [showCloseModal, setShowCloseModal] = useState(false);

	const [testMode, setTestMode] = useState(false);
	const [currentDate, setCurrentDate] = useState("");

	const hasLoadedRef = useRef(false);
	const lastLoadedDateRef = useRef(null);

	const projectedCurrent = useMemo(() => {
		return calculateProjectedCurrent({
			goal,
			todayShift,
			currentNet,
		});
	}, [goal, todayShift, currentNet]);

	const projectedRemaining = useMemo(() => {
		return calculateProjectedRemaining({
			goal,
			projectedCurrent,
		});
	}, [goal, projectedCurrent]);

	const projectedPerDay = useMemo(() => {
		return calculateProjectedPerDay({
			projectedRemaining,
			daysLeft: goal?.daysLeft,
		});
	}, [projectedRemaining, goal]);

	const loadData = useCallback(
		async (date) => {
			try {
				setLoading(true);

				debugLog("CONTROLLER", "LOAD_START", {
					requestedDate: date,
				});

				const devDate = await getCurrentDevDate();

				const activeDate = date || devDate.currentDate;

				setTestMode(devDate.testMode);
				setCurrentDate(devDate.currentDate);

				const [goalResponse, shiftsResponse] = await Promise.all([
					getGoalProgress(),
					getShifts(`?from=${activeDate}&to=${activeDate}`),
				]);

				setGoal(goalResponse);

				const shift = shiftsResponse?.[0] || null;

				setTodayShift(shift);

				hydrateSession(shift);

				debugLog("CONTROLLER", "SHIFT_LOADED", {
					hasShift: !!shift,
					id: shift?.id,
				});

				lastLoadedDateRef.current = activeDate;
			} catch (error) {
				console.error("[DailyShift] LOAD_ERROR", error);
				toast.error(error.message || "Error cargando información");
			} finally {
				setLoading(false);
				debugLog("CONTROLLER", "LOAD_END");
			}
		},
		[hydrateSession, toast]
	);

	useEffect(() => {
		if (hasLoadedRef.current) return;

		hasLoadedRef.current = true;
		loadData();
	}, [loadData]);

	const openGoalModal = useCallback(() => setShowGoalModal(true), []);
	const closeGoalModal = useCallback(() => setShowGoalModal(false), []);

	const openCloseModal = useCallback(() => setShowCloseModal(true), []);
	const closeCloseModal = useCallback(() => setShowCloseModal(false), []);

	const handleNextDay = useCallback(async () => {
		const next = new Date(currentDate);
		next.setDate(next.getDate() + 1);

		const formatted = next.toISOString().split("T")[0];

		debugLog("CONTROLLER", "NEXT_DAY", { formatted });

		await setDevDate(formatted);
		await loadData(formatted);

		toast.info(`Fecha simulada: ${formatted}`);
	}, [currentDate, loadData, toast]);

	const handleResetDate = useCallback(async () => {
		debugLog("CONTROLLER", "RESET_DATE");

		await resetDevDate();
		await loadData();

		toast.info("Fecha restablecida");
	}, [loadData, toast]);

	const handleCreateGoal = useCallback(async () => {
		try {
			setSaving(true);

			const payload = {
				amount: Number(goalAmount),
				endDate: goalEndDate,
			};

			debugLog("CONTROLLER", "CREATE_GOAL", payload);

			await createGoal(payload);

			closeGoalModal();
			setGoalAmount("");
			setGoalEndDate("");

			toast.success("Meta creada correctamente");

			await loadData(currentDate);
		} catch (error) {
			console.error(error);
			toast.error(error.message || "No se pudo crear la meta");
		} finally {
			setSaving(false);
		}
	}, [
		goalAmount,
		goalEndDate,
		currentDate,
		loadData,
		closeGoalModal,
		toast,
	]);

	// ✅ OPTIMISTIC SAVE SHIFT
	const handleSaveShift = useCallback(async () => {
		try {
			setSaving(true);

			const payload = {
				shiftDate: currentDate,
				income: Number(income || 0),
				gas: Number(gas || 0),
				otherExpenses: Number(otherExpenses || 0),
			};

			debugLog("CONTROLLER", "SAVE_SHIFT", payload);

			// 🔥 OPTIMISTIC UI UPDATE
			const optimisticShift = {
				id: todayShift?.id || "temp",
				shiftDate: currentDate,
				income: payload.income,
				gas: payload.gas,
				otherExpenses: payload.otherExpenses,
			};

			setTodayShift(optimisticShift);
			hydrateSession(optimisticShift);

			// backend
			if (todayShift?.id) {
				await updateShift(todayShift.id, payload);
				debugLog("CONTROLLER", "SHIFT_UPDATED");
				toast.success("Turno actualizado");
			} else {
				const created = await createShift(payload);
				debugLog("CONTROLLER", "SHIFT_CREATED");
				toast.success("Turno guardado");

				if (created?.id) {
					setTodayShift(created);
				}
			}

			closeCloseModal();

			// ❌ ya no forzamos reload inmediato
		} catch (error) {
			console.error(error);
			toast.error(error.message || "No se pudo guardar el turno");
		} finally {
			setSaving(false);
		}
	}, [
		currentDate,
		income,
		gas,
		otherExpenses,
		todayShift,
		closeCloseModal,
		toast,
		hydrateSession,
	]);

	return {
		state: {
			income,
			gas,
			otherExpenses,
			goalAmount,
			goalEndDate,
			goal,
			todayShift,
			loading,
			saving,
			showGoalModal,
			showCloseModal,
			testMode,
			currentDate,
			currentNet,
			projectedCurrent,
			projectedRemaining,
			projectedPerDay,
		},

		actions: {
			setIncome,
			setGas,
			setOtherExpenses,
			setGoalAmount,
			setGoalEndDate,
			openGoalModal,
			closeGoalModal,
			openCloseModal,
			closeCloseModal,
			handleNextDay,
			handleResetDate,
			handleCreateGoal,
			handleSaveShift,
		},
	};
};

export default useShiftSessionController;