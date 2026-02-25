import { useEffect, useMemo, useState } from 'react'
import CaregiverLayout from '../../components/layouts/CaregiverLayout'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import { LoadingState, EmptyState, ErrorState } from '../../components/common/DataState'
import { guardiaService, unwrapList } from '../../services/api'

export default function Incidents() {
  const [incidents, setIncidents] = useState([])
  const [selectedIncident, setSelectedIncident] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    guardiaService.getAll()
      .then((res) => {
        const rows = unwrapList(res.data)
          .filter((item) => item.informe)
          .map((item) => ({
            ...item,
            severity: item.horasTrabajadas >= 12 ? 'Alta' : item.horasTrabajadas >= 8 ? 'Media' : 'Baja'
          }))
        setIncidents(rows)
        if (rows.length > 0) setSelectedIncident(rows[0])
      })
      .catch(() => setError('No se pudieron cargar incidentes.'))
      .finally(() => setLoading(false))
  }, [])

  const severityVariant = useMemo(() => ({ Alta: 'error', Media: 'warning', Baja: 'info' }), [])

  return (
    <CaregiverLayout title="Incidents">
      <div className="p-8 space-y-6">
        <PageHeader
          title="Incident Reports"
          description="Incidencias obtenidas de informes de guardia con prioridad estimada."
          breadcrumb={[
            { label: 'Caregiver', path: '/caregiver/dashboard' },
            { label: 'Incidents' }
          ]}
        />

        {error && <ErrorState message={error} />}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            {loading && <LoadingState label="Cargando incidencias..." />}
            {!loading && incidents.length === 0 && <EmptyState label="No hay incidencias reportadas." />}

            {!loading && incidents.length > 0 && (
              <div className="space-y-2 max-h-[520px] overflow-auto">
                {incidents.map((incident) => (
                  <button
                    key={incident.id}
                    type="button"
                    onClick={() => setSelectedIncident(incident)}
                    className={`w-full text-left border rounded-lg p-3 ${
                      selectedIncident?.id === incident.id ? 'border-[#2b8cee] bg-[#2b8cee]/5' : 'border-[#e7edf3]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold truncate">{incident.paciente?.nombre || 'Paciente N/A'}</p>
                      <Badge variant={severityVariant[incident.severity]}>{incident.severity}</Badge>
                    </div>
                    <p className="text-xs text-[#4c739a] mt-1">{incident.fecha || 'Sin fecha'} · {incident.cuidador?.nombre || 'Sin cuidador'}</p>
                  </button>
                ))}
              </div>
            )}
          </Card>

          <Card>
            {!selectedIncident && <EmptyState label="Selecciona una incidencia para ver detalle." />}
            {selectedIncident && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold">Detalle de incidencia</h4>
                <Badge variant={severityVariant[selectedIncident.severity]}>{selectedIncident.severity}</Badge>
                <p className="text-sm"><span className="font-semibold">Paciente:</span> {selectedIncident.paciente?.nombre || 'N/A'}</p>
                <p className="text-sm"><span className="font-semibold">Fecha:</span> {selectedIncident.fecha || 'N/A'}</p>
                <div className="rounded-lg border border-[#e7edf3] p-4 bg-[#f6f7f8]">
                  <p className="text-sm font-semibold mb-2">Descripción</p>
                  <p className="text-sm text-[#4c739a] whitespace-pre-wrap">{selectedIncident.informe}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">Marcar revisado</Button>
                  <Button size="sm" variant="outline">Escalar</Button>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </CaregiverLayout>
  )
}