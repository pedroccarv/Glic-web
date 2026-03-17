import { useEffect, useState } from "react"
import api from "../api/axios"
import type { Insulin } from "../types/Insulin"
import type { ApplicationLog } from "../types/ApplicationLog"
import { InsulinForm } from "../components/InsulinForm"
import { ApplicationLogForm } from "../components/ApplicationLogForm"
import { useAuth } from "../context/AuthContext"
import "../App.css"

export function HomePage() {
  const { logout } = useAuth()
  const [insulins, setInsulins] = useState<Insulin[]>([])
  const [logs, setLogs] = useState<ApplicationLog[]>([])

  const loadInsulins = () => {
    api
      .get("/insulins") // sem userId na URL — vem do token
      .then((response) => setInsulins(response.data))
      .catch((error) => console.error("Erro ao buscar insulinas:", error))
  }

  const loadLogs = () => {
    const hoje = new Date().toISOString().split("T")[0]
    api
      .get(`/logs?date=${hoje}`) // sem userId na URL
      .then((response) => setLogs(response.data))
      .catch((error) => console.error("Erro ao buscar logs:", error))
  }

  useEffect(() => {
    loadInsulins()
    loadLogs()
  }, [])

  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })

  return (
    <div>
      <header className="app-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 className="app-header__title">💉 Minhas Insulinas</h1>
            <p className="app-header__subtitle">
              Gerencie seu estoque e registre suas doses diárias
            </p>
          </div>
          <button onClick={logout} style={{ padding: "8px 16px" }}>
            Sair
          </button>
        </div>
      </header>

      <section className="insulin-list">
        <h2 className="app-section-title">📦 Estoque atual</h2>
        {insulins.length === 0 ? (
          <p className="insulin-list__empty">
            ℹ️ Nenhuma insulina cadastrada ainda.
          </p>
        ) : (
          <ul className="insulin-list__grid">
            {insulins.map((insulin) => (
              <li key={insulin.id} className="insulin-list__item">
                <div className="insulin-list__item-name">{insulin.name}</div>
                <div className="insulin-list__item-meta">
                  <span className="insulin-list__item-badge">{insulin.format}</span>
                  {insulin.units} UI
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="app-forms">
        <div>
          <h2 className="app-section-title">➕ Cadastrar insulina</h2>
          <InsulinForm onSuccess={loadInsulins} />
        </div>
        <div>
          <h2 className="app-section-title">💉 Registrar dose</h2>
          <ApplicationLogForm insulins={insulins} onSuccess={loadLogs} />
        </div>
      </div>

      <section>
        <h2 className="app-section-title">📅 Diário de hoje</h2>
        <div className="app-diary">
          <div className="app-diary__header">
            <div className="app-diary__icon">📅</div>
            <span className="app-diary__title">Doses aplicadas</span>
            <span className="app-diary__date">{today}</span>
          </div>
          {logs.length === 0 ? (
            <p className="app-diary__empty">Nenhuma dose registrada hoje.</p>
          ) : (
            <ul className="app-diary__list">
              {logs.map((log) => (
                <li key={log.id} className="app-diary__entry">
                  <span className="app-diary__entry-time">
                    {new Date(log.applicationTime).toLocaleTimeString("pt-BR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <div className="app-diary__entry-dot" />
                  <span className="app-diary__entry-text">
                    Apliquei{" "}
                    <span className="app-diary__entry-units">
                      {log.appliedUnits} UI
                    </span>
                  </span>
                  {log.consumedCarbs != null && (
                    <span className="app-diary__entry-carbs">
                      {log.consumedCarbs}g carbo
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  )
}