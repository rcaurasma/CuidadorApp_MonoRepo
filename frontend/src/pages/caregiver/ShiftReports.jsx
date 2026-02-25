import { useEffect, useMemo, useState } from 'react'
import CaregiverLayout from '../../components/layouts/CaregiverLayout'
import Card from '../../components/common/Card'
import StatCard from '../../components/common/StatCard'
import PageHeader from '../../components/common/PageHeader'
import { LoadingState, EmptyState, ErrorState } from '../../components/common/DataState'
import { guardiaService, unwrapList } from '../../services/api'

export default function ShiftReports() {
  const [guardias, setGuardias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    guardiaService.getAll()
      .then((res) => setGuardias(unwrapList(res.data)))
      .catch(() => setError('No se pudieron cargar los reportes de turnos.'))
      .finally(() => setLoading(false))
  }, [])

  const totalHoras = useMemo(() => guardias.reduce((sum, item) => sum + (item.horasTrabajadas || 0), 0), [guardias])

  return (
    <CaregiverLayout title="Shift Logging & Reports">
      <div className="p-8 space-y-6">
        <PageHeader
          title="Shift Reports"
          description="Resumen de horas trabajadas y detalle de turnos registrados."
          breadcrumb={[
            { label: 'Caregiver', path: '/caregiver/dashboard' },
            { label: 'Shift Reports' }
          ]}
        />

        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Turnos" value={`${guardias.length}`} icon="schedule" />
            <StatCard title="Horas Totales" value={`${totalHoras}h`} icon="timelapse" />
            <StatCard title="Promedio por Turno" value={`${guardias.length ? (totalHoras / guardias.length).toFixed(1) : '0'}h`} icon="query_stats" />
          </div>
        )}

        <Card>
          {loading && <LoadingState label="Cargando reportes de turnos..." />}
          {!loading && error && <ErrorState message={error} />}
          {!loading && !error && guardias.length === 0 && <EmptyState label="Aún no hay turnos registrados." />}

          {!loading && !error && guardias.length > 0 && (
            <div className="max-h-[520px] overflow-auto rounded-lg border border-[#e7edf3]">
              <table className="w-full min-w-[720px]">
                <thead className="bg-[#f6f7f8] sticky top-0">
                  <tr>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Fecha</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Paciente</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Horas</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Informe</th>
                  </tr>
                </thead>
                <tbody>
                  {guardias.map((guardia) => (
                    <tr key={guardia.id} className="border-t border-[#e7edf3]">
                      <td className="py-3 px-4 text-sm">{guardia.fecha || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">{guardia.paciente?.nombre || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm">{guardia.horasTrabajadas || 0}h</td>
                      <td className="py-3 px-4 text-sm text-[#4c739a]">{guardia.informe ? 'Completado' : 'Pendiente'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </CaregiverLayout>
  )
}