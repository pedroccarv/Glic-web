import { useState } from "react"
import axios from "axios"
import "../styles/InsulinForm.css"

interface InsulinFormProps {
  onSuccess?: () => void
}

export function InsulinForm({ onSuccess }: InsulinFormProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [units, setUnits] = useState<number>(0)
  const [price, setPrice] = useState<number>(0)
  const [quantity, setQuantity] = useState<number>(1)
  const [openingDate, setOpeningDate] = useState("")
  const [purchaseDate, setPurchaseDate] = useState("")
  const [type, setType] = useState("Rapid")
  const [format, setFormat] = useState("Pens")
  const [loading, setLoading] = useState(false)

  const resetForm = () => {
    setName(""); setDescription(""); setUnits(0); setPrice(0)
    setQuantity(1); setOpeningDate(""); setPurchaseDate("")
    setType("Rapid"); setFormat("Pens")
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!name.trim()) { alert("O campo 'Nome' é obrigatório."); return }
    if (units <= 0) { alert("Unidades deve ser um número positivo."); return }
    if (price < 0) { alert("Preço não pode ser negativo."); return }
    if (quantity <= 0) { alert("Quantidade deve ser um número positivo."); return }
    if (!openingDate || !purchaseDate) { alert("As datas são obrigatórias."); return }

    setLoading(true)
    axios
      .post("/users/1/insulins", { name, description, units, price, quantity, openingDate, purchaseDate, type, format })
      .then((response) => {
        alert("Insulina salva com sucesso!")
        console.log(response.data)
        resetForm()
        onSuccess?.()
      })
      .catch((error) => {
        const msg = error.response?.data?.message || "Erro ao salvar a insulina."
        alert(`Ops, deu erro: ${msg}`)
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="insulin-form-wrapper">
      <form onSubmit={handleSubmit} className="insulin-form-card">

        <div className="insulin-form-header">
          <div className="insulin-form-icon-badge">💊</div>
          <div>
            <h3 className="insulin-form-title">Cadastrar Insulina</h3>
            <p className="insulin-form-subtitle">Adicione um novo item ao seu estoque</p>
          </div>
        </div>

        <div className="insulin-form-grid">

          <span className="insulin-form-section-label">Identificação</span>

          <div className="insulin-form-field insulin-form-field--full">
            <label className="insulin-form-label">Nome</label>
            <input
              className="insulin-form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Insulina Glargina"
              required
            />
          </div>

          <div className="insulin-form-field insulin-form-field--full">
            <label className="insulin-form-label">Descrição</label>
            <input
              className="insulin-form-input"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Observações adicionais"
            />
          </div>

          <div className="insulin-form-field">
            <label className="insulin-form-label">Tipo</label>
            <select
              className="insulin-form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Rapid">Rápida</option>
              <option value="Short">Curta</option>
              <option value="Intermediate">Intermediária</option>
              <option value="LongActing">Longa duração</option>
            </select>
          </div>

          <div className="insulin-form-field">
            <label className="insulin-form-label">Formato</label>
            <select
              className="insulin-form-select"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="Pens">Canetas</option>
              <option value="Vials">Frascos</option>
              <option value="Cartridges">Cartuchos</option>
            </select>
          </div>

          <div className="insulin-form-divider" />
          <span className="insulin-form-section-label">Estoque & Valores</span>

          <div className="insulin-form-field">
            <label className="insulin-form-label">Unidades (UI)</label>
            <input
              className="insulin-form-input"
              type="number"
              value={units}
              onChange={(e) => setUnits(Number(e.target.value))}
              min="1"
              placeholder="100"
              required
            />
          </div>

          <div className="insulin-form-field">
            <label className="insulin-form-label">Quantidade</label>
            <input
              className="insulin-form-input"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              placeholder="1"
              required
            />
          </div>

          <div className="insulin-form-field insulin-form-field--full">
            <label className="insulin-form-label">Preço (R$)</label>
            <input
              className="insulin-form-input"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min="0"
              placeholder="0,00"
              required
            />
          </div>

          <div className="insulin-form-divider" />
          <span className="insulin-form-section-label">Datas</span>

          <div className="insulin-form-field">
            <label className="insulin-form-label">Data de Compra</label>
            <input
              className="insulin-form-input"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />
          </div>

          <div className="insulin-form-field">
            <label className="insulin-form-label">Data de Abertura</label>
            <input
              className="insulin-form-input"
              type="date"
              value={openingDate}
              onChange={(e) => setOpeningDate(e.target.value)}
              required
            />
          </div>

        </div>

        <button className="insulin-form-submit" type="submit" disabled={loading}>
          {loading ? "⏳ Salvando..." : "Salvar Insulina"}
        </button>

      </form>
    </div>
  )
}