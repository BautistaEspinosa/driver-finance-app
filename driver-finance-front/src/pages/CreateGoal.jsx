// components/CreateGoal.jsx

import { useState } from "react";
import { createGoal } from "../api/shiftApi";

export default function CreateGoal({ onCreated }) {

	const [amount, setAmount] = useState("");
	const [endDate, setEndDate] = useState("");

	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {

		e.preventDefault();

		if (!amount || !endDate) {
			setError("Todos los campos son obligatorios");
			return;
		}

		setLoading(true);
		setError("");

		try {

			await createGoal({
				amount: Number(amount),
				endDate,
			});

			setAmount("");
			setEndDate("");

			onCreated?.();

		} catch (err) {

			setError(err.message || "Error al crear meta");

		} finally {

			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>

			<h2>Crear Meta</h2>

			{error && (
				<p style={{ color: "red" }}>
					{error}
				</p>
			)}

			<div>
				<label>Monto objetivo</label>

				<input
					type="number"
					min="0"
					step="0.01"
					value={amount}
					onChange={(e) => setAmount(e.target.value)}
					required
				/>
			</div>

			<div>
				<label>Fecha final</label>

				<input
					type="date"
					value={endDate}
					onChange={(e) => setEndDate(e.target.value)}
					required
				/>
			</div>

			<button disabled={loading}>
				{loading ? "Guardando..." : "Crear Meta"}
			</button>
		</form>
	);
}