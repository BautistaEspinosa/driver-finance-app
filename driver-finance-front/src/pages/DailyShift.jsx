import { useEffect, useMemo, useState } from "react";

import {
  createGoal,
  createShift,
  getGoalProgress,
  getShifts,
  updateShift,
} from "../api/shiftApi";

import {
  calculateNet,
} from "../utils/goalCalculations";

import { formatMoney } from "../utils/format";

import "./DailyShift.css";

const debug = (label, payload = {}) => {
  console.log(`[DailyShift] ${label}`, payload);
};

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const addDays = (dateString, days) => {
  const date = new Date(dateString);

  date.setDate(date.getDate() + days);

  return formatDate(date);
};

const DailyShift = () => {
  // =====================================
  // TEST MODE
  // =====================================

  const [testMode, setTestMode] =
    useState(false);

  const [virtualToday, setVirtualToday] =
    useState(formatDate(new Date()));

  const selectedDate = testMode
    ? virtualToday
    : formatDate(new Date());

  // =====================================
  // SHIFT STATE
  // =====================================

  const [income, setIncome] =
    useState("");

  const [gas, setGas] =
    useState("");

  const [
    otherExpenses,
    setOtherExpenses,
  ] = useState("");

  const [todayShift, setTodayShift] =
    useState(null);

  // =====================================
  // GOAL STATE
  // =====================================

  const [goal, setGoal] =
    useState(null);

  const [goalAmount, setGoalAmount] =
    useState("");

  const [goalEndDate, setGoalEndDate] =
    useState("");

  // =====================================
  // GENERAL STATE
  // =====================================

  const [allShifts, setAllShifts] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================
  // EFFECTS
  // =====================================

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  // =====================================
  // LOAD DATA
  // =====================================

  const loadData = async () => {
    try {
      setLoading(true);

      setError("");

      debug("LOAD_START", {
        selectedDate,
        testMode,
      });

      const shifts = await getShifts();

      debug("SHIFTS_RESPONSE", shifts);

      const activeGoal =
        await getGoalProgress();

      debug("GOAL_RESPONSE", activeGoal);

      setAllShifts(shifts || []);

      setGoal(activeGoal || null);

      const shift =
        shifts.find(
          (s) =>
            s.shiftDate === selectedDate
        ) || null;

      debug("TODAY_SHIFT", shift);

      setTodayShift(shift);

      if (shift) {
        setIncome(
          String(shift.income || "")
        );

        setGas(
          String(shift.gas || "")
        );

        setOtherExpenses(
          String(
            shift.otherExpenses || ""
          )
        );
      } else {
        setIncome("");
        setGas("");
        setOtherExpenses("");
      }

      debug("LOAD_END");
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Error al cargar datos"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // DATE NAVIGATION
  // =====================================

  const goPreviousDay = () => {
    setVirtualToday(
      addDays(selectedDate, -1)
    );
  };

  const goNextDay = () => {
    setVirtualToday(
      addDays(selectedDate, 1)
    );
  };

  // =====================================
  // DERIVED VALUES
  // =====================================

  const incomeValue =
    Number(income || 0);

  const gasValue =
    Number(gas || 0);

  const otherExpensesValue =
    Number(otherExpenses || 0);

  const currentNet = calculateNet({
    income: incomeValue,
    gas: gasValue,
    otherExpenses:
      otherExpensesValue,
  });

  // 🔥 progreso en tiempo real

  const accumulatedNet = useMemo(() => {
    if (!goal) return 0;

    return allShifts
      .filter((shift) => {
        return (
          shift.shiftDate >=
            goal.startDate &&
          shift.shiftDate <=
            goal.endDate &&
          shift.shiftDate !==
            selectedDate
        );
      })
      .reduce((acc, shift) => {
        return (
          acc +
          Number(
            shift.netEarnings || 0
          )
        );
      }, 0);
  }, [allShifts, goal, selectedDate]);

  const currentProgress =
    accumulatedNet + currentNet;

  const remainingGoal = goal
    ? Math.max(
        Number(
          goal.targetAmount || 0
        ) - currentProgress,
        0
      )
    : 0;

  const daysRemaining = goal
    ? Math.max(
        Math.ceil(
          (new Date(goal.endDate) -
            new Date(
              selectedDate
            )) /
            (1000 *
              60 *
              60 *
              24)
        ) + 1,
        1
      )
    : 1;

  const dailyGoal =
    remainingGoal /
    Math.max(daysRemaining, 1);

  const onTrack =
    currentNet >= dailyGoal;

  const progressPercent = goal
    ? Math.min(
        (currentProgress /
          Number(
            goal.targetAmount || 1
          )) *
          100,
        100
      )
    : 0;

  debug("DERIVED_VALUES", {
    currentNet,
    accumulatedNet,
    currentProgress,
    remainingGoal,
    dailyGoal,
    daysRemaining,
    progressPercent,
  });

  // =====================================
  // SHIFT
  // =====================================

  const saveShift = async () => {
    try {
      setLoading(true);

      setError("");

      const payload = {
        shiftDate: selectedDate,
        income: incomeValue,
        gas: gasValue,
        otherExpenses:
          otherExpensesValue,
      };

      debug(
        "SAVE_SHIFT_PAYLOAD",
        payload
      );

      if (todayShift) {
        await updateShift(
          todayShift.id,
          payload
        );

        debug("SHIFT_UPDATED");
      } else {
        await createShift(payload);

        debug("SHIFT_CREATED");
      }

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Error al guardar turno"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // GOAL
  // =====================================

  const saveGoal = async () => {
    try {
      setLoading(true);

      setError("");

      const payload = {
        amount: Number(
          goalAmount || 0
        ),

        // 🔥 startDate automático
        startDate: selectedDate,

        endDate: goalEndDate,
      };

      debug(
        "CREATE_GOAL_PAYLOAD",
        payload
      );

      await createGoal(payload);

      debug("GOAL_CREATED");

      setGoalAmount("");

      setGoalEndDate("");

      await loadData();
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Error al crear meta"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="daily-shift-container">
      {/* ================================= */}
      {/* TEST MODE */}
      {/* ================================= */}

      <section className="card">
        <div className="test-mode-header">
          <label className="test-toggle">
            <input
              type="checkbox"
              checked={testMode}
              onChange={(e) =>
                setTestMode(
                  e.target.checked
                )
              }
            />

            Modo test
          </label>

          {testMode && (
            <div className="date-navigation">
              <button
                onClick={
                  goPreviousDay
                }
              >
                ←
              </button>

              <h3>{selectedDate}</h3>

              <button
                onClick={goNextDay}
              >
                →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ================================= */}
      {/* ERROR */}
      {/* ================================= */}

      {error && (
        <div className="card error-card">
          <p>{error}</p>
        </div>
      )}

      {/* ================================= */}
      {/* SHIFT */}
      {/* ================================= */}

      <section className="card">
        <h3>Turno del día</h3>

        <div className="form-group">
          <label>
            ¿Cuánto llevas?
          </label>

          <input
            type="number"
            min="0"
            value={income}
            onChange={(e) =>
              setIncome(
                e.target.value
              )
            }
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label>Gasolina</label>

          <input
            type="number"
            min="0"
            value={gas}
            onChange={(e) =>
              setGas(
                e.target.value
              )
            }
            placeholder="0"
          />
        </div>

        <div className="form-group">
          <label>
            Otros gastos
          </label>

          <input
            type="number"
            min="0"
            value={otherExpenses}
            onChange={(e) =>
              setOtherExpenses(
                e.target.value
              )
            }
            placeholder="0"
          />
        </div>

        {/* ========================= */}
        {/* RESUMEN */}
        {/* ========================= */}

        <div className="summary-box">
          <h4>
            Resumen financiero
          </h4>

          <p>
            <strong>
              Ingreso bruto:
            </strong>{" "}
            {formatMoney(
              incomeValue
            )}
          </p>

          <p>
            <strong>
              Gasolina:
            </strong>{" "}
            {formatMoney(gasValue)}
          </p>

          <p>
            <strong>
              Otros gastos:
            </strong>{" "}
            {formatMoney(
              otherExpensesValue
            )}
          </p>

          <p>
            <strong>
              Ganancia actual:
            </strong>{" "}
            {formatMoney(
              currentNet
            )}
          </p>
        </div>

        <button
          onClick={saveShift}
          disabled={loading}
        >
          {todayShift
            ? "Actualizar turno"
            : "Cerrar turno"}
        </button>
      </section>

      {/* ================================= */}
      {/* GOAL */}
      {/* ================================= */}

      {!goal ? (
        <section className="card">
          <h3>
            Crear meta financiera
          </h3>

          <div className="form-group">
            <label>
              Monto objetivo
            </label>

            <input
              type="number"
              min="0"
              value={goalAmount}
              onChange={(e) =>
                setGoalAmount(
                  e.target.value
                )
              }
              placeholder="Ej: 9000"
            />
          </div>

          <div className="form-group">
            <label>
              Fecha inicio
            </label>

            <input
              type="date"
              value={selectedDate}
              disabled
            />
          </div>

          <div className="form-group">
            <label>
              Fecha fin
            </label>

            <input
              type="date"
              value={goalEndDate}
              min={selectedDate}
              onChange={(e) =>
                setGoalEndDate(
                  e.target.value
                )
              }
            />
          </div>

          <button
            onClick={saveGoal}
            disabled={loading}
          >
            Guardar meta
          </button>
        </section>
      ) : (
        <section className="card">
          <h3>Meta activa</h3>

          {/* ========================= */}
          {/* PROGRESS BAR */}
          {/* ========================= */}

          <div className="progress-wrapper">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${progressPercent}%`,
                }}
              />
            </div>

            <span>
              {progressPercent.toFixed(
                1
              )}
              %
            </span>
          </div>

          <div className="goal-summary">
            <p>
              <strong>
                Meta objetivo:
              </strong>{" "}
              {formatMoney(
                goal.targetAmount
              )}
            </p>

            <p>
              <strong>
                Progreso actual:
              </strong>{" "}
              {formatMoney(
                currentProgress
              )}
            </p>

            <p>
              <strong>
                Faltante:
              </strong>{" "}
              {formatMoney(
                remainingGoal
              )}
            </p>

            <p>
              <strong>
                Días restantes:
              </strong>{" "}
              {daysRemaining}
            </p>

            <p>
              <strong>
                Meta diaria:
              </strong>{" "}
              {formatMoney(
                dailyGoal
              )}
            </p>

            <p>
              <strong>
                Estado:
              </strong>{" "}
              {onTrack
                ? "Vas en ritmo"
                : "Vas atrasado"}
            </p>

            <p>
              <strong>
                Periodo:
              </strong>{" "}
              {goal.startDate} →{" "}
              {goal.endDate}
            </p>
          </div>
        </section>
      )}
    </div>
  );
};
export default DailyShift;