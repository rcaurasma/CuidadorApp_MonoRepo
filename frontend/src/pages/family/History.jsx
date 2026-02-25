import { useState } from 'react'
import FamilyLayout from '../../components/layouts/FamilyLayout'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import { LoadingState, EmptyState, ErrorState } from '../../components/common/DataState'
import api, { unwrapList } from '../../services/api'

export default function History() {
  const [pacienteId, setPacienteId] = useState('')
  const [historyRows, setHistoryRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const loadHistory = async (event) => {
    event.preventDefault()
    setError('')

    const id = Number(pacienteId)
    if (!id || id <= 0) {
      setError('Debes ingresar un ID de paciente válido (número mayor a 0).')
      return
    }

    setLoading(true)
    try {
      const response = await api.get(`/guardias/paciente/${id}`)
      setHistoryRows(unwrapList(response.data))
    } catch {
      setError('No se pudo cargar el historial. Verifica el ID de paciente y permisos de la sesión.')
      setHistoryRows([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <FamilyLayout title="Care Service History">
      <div className="p-8 space-y-6">
        <PageHeader
          title="Service History"
          description="Historial de guardias por paciente, alineado al recurso backend `/guardias/paciente/{id}`."
          breadcrumb={[
            { label: 'Family', path: '/family/dashboard' },
            { label: 'History' }
          ]}
        />

        <Card>
          <form onSubmit={loadHistory} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
            <Input
              label="ID Paciente"
              type="number"
              name="pacienteId"
              value={pacienteId}
              onChange={(event) => setPacienteId(event.target.value)}
              placeholder="Ej: 1"
              required
            />
            <Button type="submit" variant="primary" icon="search">Buscar historial</Button>
          </form>

          <div className="mt-4">
            {loading && <LoadingState label="Cargando historial..." />}
            {!loading && error && <ErrorState message={error} />}
            {!loading && !error && historyRows.length === 0 && (
              <EmptyState label="Sin resultados todavía para el paciente indicado." />
            )}

            {!loading && !error && historyRows.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                  <thead>
                    <tr className="border-b border-[#e7edf3]">
                      <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Fecha</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Cuidador</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Horas</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Informe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyRows.map((item) => (
                      <tr key={item.id} className="border-b border-[#e7edf3]">
                        <td className="py-3 px-4 text-sm">{item.fecha || 'N/A'}</td>
                        <td className="py-3 px-4 text-sm">{item.cuidador?.nombre || 'N/A'}</td>
                        <td className="py-3 px-4 text-sm">{item.horasTrabajadas || 0}h</td>
                        <td className="py-3 px-4 text-sm text-[#4c739a] max-w-[360px] truncate">{item.informe || 'Sin informe'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>
    </FamilyLayout>
  )
}