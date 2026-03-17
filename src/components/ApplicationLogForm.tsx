import { useState } from "react"
import axios from "axios"
import type { Insulin } from "../types/Insulin"
import "../styles/ApplicationLogForm.css"

interface ApplicationLogFormProps {
  insulins: Insulin[]
  onSuccess: () => void
}

export function ApplicationLogForm({ insulins, onSuccess }: ApplicationLogFormProps) {
  const [selectedInsulinId, setSelectedInsulinId] = useState<number | "">("")
  const [appliedUnits, setAppliedUnits] = useState<number>(0)
  const [consumedCarbs, setConsumedCarbs] = useState<number>(0)
  const [applicationTime, setApplicationTime] = useState<string>(
    new Date().toISOString().slice(0, 16)
  )

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (selectedInsulinId === "") { alert("Por favor, selecione uma insulina!"); return }
    if (appliedUnits < 0) { alert("As unidades aplicadas não podem ser negativas!"); return }

    const applicationLogRequestDTO = {
      appliedUnits,
      applicationTime,
      consumedCarbs,
      insulinId: selectedInsulinId,
      userId: 1,
    }

    axios
      .post(`/users/1/logs/insulina/${selectedInsulinId}`, applicationLogRequestDTO)
      .then((response) => {
        alert("Dose registrada com sucesso no diário!")
        console.log(response.data)
        onSuccess()
        setAppliedUnits(0)
        setConsumedCarbs(0)
        setSelectedInsulinId("")
        setApplicationTime(new Date().toISOString().slice(0, 16))
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Ops, deu erro ao registrar a aplicação."
        alert(msg)
      })
  }

  return (
    <div className="log-form-wrapper">
      <form onSubmit={handleSubmit} className="log-form-card">

        <div className="log-form-header">
          <div className="log-form-icon-badge">💉</div>
          <div>
            <h3 className="log-form-title">Registrar Aplicação</h3>
            <p className="log-form-subtitle">Registre sua dose no diário</p>
          </div>
        </div>

        <div className="log-form-grid">

          <span className="log-form-section-label">Insulina</span>

          <div className="log-form-field log-form-field--full">
            <label className="log-form-label">Insulina aplicada</label>
            <select
              className="log-form-select"
              value={selectedInsulinId}
              onChange={(e) => setSelectedInsulinId(e.target.value ? Number(e.target.value) : "")}
              required
            >
              <option value="">— Selecione uma insulina —</option>
              {insulins.map((insulin) => (
                <option key={insulin.id} value={insulin.id}>
                  {insulin.name} · {insulin.types}
                </option>
              ))}
            </select>
          </div>

          <div className="log-form-divider" />
          <span className="log-form-section-label">Dose</span>

          <div className="log-form-field">
            <label className="log-form-label">Unidades (UI)</label>
            <input
              className="log-form-input"
              type="number"
              step="0.5"
              min="0"
              value={appliedUnits}
              onChange={(e) => setAppliedUnits(Number(e.target.value))}
              placeholder="0"
              required
            />
          </div>

          <div className="log-form-field">
            <label className="log-form-label">Carboidratos (g)</label>
            <input
              className="log-form-input"
              type="number"
              min="0"
              value={consumedCarbs}
              onChange={(e) => setConsumedCarbs(Number(e.target.value))}
              placeholder="0"
            />
          </div>

          <div className="log-form-divider" />
          <span className="log-form-section-label">Data e hora</span>

          <div className="log-form-field log-form-field--full">
            <label className="log-form-label">Data e hora da aplicação</label>
            <input
              className="log-form-input"
              type="datetime-local"
              value={applicationTime}
              onChange={(e) => setApplicationTime(e.target.value)}
              required
            />
          </div>

          <div className="log-form-info-box">
            <span>ℹ️</span>
            <span>O horário é preenchido automaticamente com a hora atual.</span>
          </div>

        </div>

        <button className="log-form-submit" type="submit">
          Registrar no Diário
        </button>

      </form>
    </div>
  )
}