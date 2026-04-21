import { useState, useEffect, useRef } from "react";

const DailyGoal = () => {
  const [goal, setGoal] = useState("");
  const [current, setCurrent] = useState("");
  const [error, setError] = useState("");
  const isHydrating = useRef(false);

  // modo y fecha de prueba
  const [mode, setMode] = useState("test");
  const [testDate, setTestDate] = useState("");

  // TRACE
  useEffect(() => {
    console.log("TRACE goal:", goal);
  }, [goal]);

  useEffect(() => {
    console.log("TRACE current:", current);
  }, [current]);

  useEffect(() => {
    console.log("TRACE mode:", mode);
  }, [mode]);

  useEffect(() => {
    console.log("TRACE testDate:", testDate);
  }, [testDate]);

  // fecha activa (real o simulada)
  const getActiveDate = () => {
    if (mode === "test" && testDate) return testDate;
    return new Date().toISOString().split("T")[0];
  };

  const goalKey = `dailyGoal-${getActiveDate()}`;

  // cargar goal por día
  useEffect(() => {
    console.log("TRACE loading goalKey:", goalKey);

    isHydrating.current = true;

    const savedGoal = localStorage.getItem(goalKey);

    if (savedGoal) {
      setGoal(savedGoal);
    } else {
      setGoal("");
    }
  setCurrent("");
  }, [goalKey]);

  // guardar goal por día
  useEffect(() => {
    if(isHydrating.current){
      isHydrating.current= false;
      return;
      }
 const stored = localStorage.getItem(goalKey);

    if (goal && goal !== stored) {
      console.log("TRACE saving goalKey:", goalKey, goal);
      localStorage.setItem(goalKey, goal);
    }
  }, [goal, goalKey]);

  const goalNumber = Number(goal);
  const currentNumber = Number(current);

  const remaining =
    goalNumber > 0 ? goalNumber - currentNumber : 0;

  const percentage =
    goalNumber > 0 ? (currentNumber / goalNumber) * 100 : 0;

  const progressWidth = Math.min(percentage, 100);

  let progressColor = "red";
  if (percentage >= 50 && percentage < 80) progressColor = "orange";
  if (percentage >= 80) progressColor = "green";

  const isGoalReached = remaining <= 0;

  const formatMoney = (value) => {
    if (value === "" || value === null || value === undefined) return "";

    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const parseNumber = (value) => {
    return value.replace(/[^0-9]/g, "");
  };

  return (
    <div>
      <h2>Meta Diaria</h2>

      {/* MODE SELECTOR */}
      <div>
        <label>Modo: </label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="real">Real</option>
          <option value="test">Test</option>
        </select>
      </div>

      {/* TEST DATE */}
      {mode === "test" && (
        <div>
          <label>Fecha simulada: </label>
          <input
            type="date"
            value={testDate}
            onChange={(e) => setTestDate(e.target.value)}
          />
        </div>
      )}

      {/* GOAL */}
      <div>
        <label>Meta: </label>
        <input
          type="text"
          value={goal ? formatMoney(goal) : ""}
          onChange={(e) => {
            const value = e.target.value;

            if (value.includes("-")) {
              setError("Solo números positivos");
              return;
            }

            setError("");
            const raw = parseNumber(value);
            setGoal(raw);
          }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {/* CURRENT */}
      <div>
        <label>Llevas: </label>
        <input
          type="text"
          value={current ? formatMoney(current) : ""}
          onChange={(e) => {
            const value = e.target.value;

            if (value.includes("-")) {
              setError("Solo números positivos");
              return;
            }

            setError("");
            const raw = parseNumber(value);
            setCurrent(raw);
          }}
        />
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>

      {/* INFO */}
      <div>
        {!goal ? (
          <p>Define una meta para empezar</p>
        ) : (
          <>
            <p>
              {isGoalReached
                ? `Meta superada por ${formatMoney(Math.abs(remaining))}`
                : `Te faltan: ${formatMoney(remaining)}`}
            </p>

            <p>Progreso: {percentage.toFixed(0)}%</p>
          </>
        )}
      </div>

      {/* PROGRESS BAR */}
      <div style={{ marginTop: "10px" }}>
        <div
          style={{
            width: "100%",
            height: "20px",
            background: "#ddd",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${progressWidth}%`,
              height: "100%",
              background: progressColor,
              transition: "0.3s",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DailyGoal;