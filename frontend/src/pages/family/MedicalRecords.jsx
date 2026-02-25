import { useEffect, useState } from 'react'
import FamilyLayout from '../../components/layouts/FamilyLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import { LoadingState, EmptyState, ErrorState } from '../../components/common/DataState'
import { pacienteService, unwrapList } from '../../services/api'

export default function MedicalRecords() {
  const [pacientes, setPacientes] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    pacienteService.getAll()
      .then((res) => {
        const rows = unwrapList(res.data)
        setPacientes(rows)
        if (rows.length > 0) setSelected(rows[0])
      })
      .catch(() => setError('No se pudieron cargar los registros médicos. Requiere sesión de familia.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <FamilyLayout title="Medical Records">
      <div className="p-8 space-y-6">
        <PageHeader
          title="Medical Records"
          description="Ficha del paciente vinculada a dirección y contacto familiar."
          breadcrumb={[
            { label: 'Family', path: '/family/dashboard' },
            { label: 'Medical Records' }
          ]}
        />

        {error && <ErrorState message={error} />}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            {loading && <LoadingState label="Cargando pacientes..." />}
            {!loading && pacientes.length === 0 && <EmptyState label="No hay pacientes disponibles para esta cuenta." />}
            {!loading && pacientes.length > 0 && (
              <div className="space-y-2">
                {pacientes.map((paciente) => (
                  <button
                    key={paciente.id}
                    type="button"
                    onClick={() => setSelected(paciente)}
                    className={`w-full text-left border rounded-lg p-3 ${
                      selected?.id === paciente.id ? 'border-[#2b8cee] bg-[#2b8cee]/5' : 'border-[#e7edf3]'
                    }`}
                  >
                    <p className="text-sm font-semibold">{paciente.nombre}</p>
                    <p className="text-xs text-[#4c739a] mt-1">{paciente.contactoFamilia || 'Sin contacto familiar'}</p>
                  </button>
                ))}
              </div>
            )}
          </Card>

          <Card>
            {!selected && <EmptyState label="Selecciona un paciente para ver su ficha." />}
            {selected && (
              <div className="space-y-4">
                <h4 className="text-lg font-bold">Ficha del paciente</h4>
                <p className="text-sm"><span className="font-semibold">Nombre:</span> {selected.nombre}</p>
                <p className="text-sm"><span className="font-semibold">Dirección:</span> {selected.direccion || 'Sin dirección registrada'}</p>
                <p className="text-sm"><span className="font-semibold">Contacto familiar:</span> {selected.contactoFamilia || 'Sin contacto'}</p>

                <div className="rounded-lg border border-[#e7edf3] p-4 bg-[#f6f7f8]">
                  <p className="text-sm font-semibold mb-2">Observaciones</p>
                  <p className="text-sm text-[#4c739a]">Este módulo está alineado con el modelo `Paciente` del backend. Puedes extenderlo con diagnósticos y medicación cuando exista endpoint dedicado.</p>
                </div>

                <Button size="sm" variant="secondary">Solicitar actualización</Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </FamilyLayout>
  )
}