import { useState, useEffect } from "react"


const DailyGoal = () => {

  const [goal,setGoal] = useState("");
  const [current, setCurrent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Goal cambió:", goal);
  }, [goal]);

  useEffect(() => {
    console.log("Current cambió:", current);
  }, [current]);

useEffect(()=> {
  const savedGoal = localStorage.getItem("dailyGoal");

  if(savedGoal){
    setGoal(savedGoal);
    }
  },[]
  );

useEffect(()=>{
  if(goal){
    localStorage.setItem("dailyGoal",goal);
    }
  },[goal]
  );
const goalNumber = Number(goal);
const currentNumber = Number(current);

const remaining = goalNumber > 0 ? goalNumber - currentNumber : 0;

const percentage = goalNumber > 0 ? (currentNumber/goalNumber) * 100 : 0;

const progressWidth = Math.min(percentage,100);

let progressColor = "red";

if(percentage >= 50 && percentage < 80 ){
  progressColor = "orange";
  }
if(percentage >= 80 ){
  progressColor = "green";
  }

const isGoalReached = remaining <= 0;

const formatMoney = (value) => {
  if(!value) return "";
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(value || 0);
};
 const parseNumber = (value) => {
   return value.replace(/[^0-9]/g,"");
   }
  return(
    <div>
      <h2>Meta Diaria </h2>
      <div>
        <label>Meta: </label>
        <input
          type="text"
          value={goal ? `${formatMoney(goal)}` : ""}
          onChange={(e) => {
            const value = e.target.value;

              if (value.includes("-")) {
                setError("Solo números positivos");
                return;
              }

              setError("");
            const raw = parseNumber(e.target.value);
            setGoal(raw);
          }}
        />{error && <p style={{ color: "red" }}>{error}</p>}
        </div>

        <div>
          <label>Llevas: </label>
          <input
            type="text"
            value={current ? ` ${formatMoney(current)}` : ""}
            onChange={(e) => {
              const value = e.target.value;

                if (value.includes("-")) {
                  setError("Solo números positivos");
                  return;
                }

                setError("");
              const raw = parseNumber(e.target.value);
              setCurrent(raw);
            }}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
          </div>

          <div>
           {!goal ? (
             <p>Define una meta para empezar</p>
           ) : (
             <>
               <p>
                 {isGoalReached
                   ? `🔥 Meta superada por ${formatMoney(Math.abs(remaining))}`
                   : `Te faltan: ${formatMoney(remaining)}`}
               </p>

               <p>Progreso: {percentage.toFixed(0)}%</p>
             </>
           )}
            </div>
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