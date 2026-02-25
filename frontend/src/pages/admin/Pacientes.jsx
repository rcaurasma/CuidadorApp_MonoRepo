import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layouts/AdminLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import PageHeader from '../../components/common/PageHeader'
import { LoadingState, EmptyState, ErrorState } from '../../components/common/DataState'
import { pacienteService, unwrapList } from '../../services/api'

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    pacienteService.getAll()
      .then((res) => setPacientes(unwrapList(res.data)))
      .catch(() => setError('No se pudieron cargar los pacientes. Verifica sesión o conexión con backend.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout title="Gestión de Pacientes">
      <div className="p-8 space-y-6">
        <PageHeader
          title="Pacientes"
          description="Listado de pacientes según modelo SQL (nombre, dirección, contacto_familia)."
          breadcrumb={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Pacientes' }
          ]}
          actionLabel="Nuevo Paciente"
          actionIcon="add"
        />

        <Card>
          {loading && <LoadingState label="Cargando pacientes..." />}
          {!loading && error && <ErrorState message={error} />}
          {!loading && !error && pacientes.length === 0 && (
            <EmptyState label="No hay pacientes registrados todavía." />
          )}

          {!loading && !error && pacientes.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="border-b border-[#e7edf3]">
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Nombre</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Dirección</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Contacto familiar</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Estado</th>
                    <th className="text-right py-3 px-4 text-sm font-bold text-[#4c739a]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientes.map((paciente) => (
                    <tr key={paciente.id} className="border-b border-[#e7edf3] hover:bg-[#f6f7f8]">
                      <td className="py-3 px-4 text-sm font-semibold">{paciente.nombre}</td>
                      <td className="py-3 px-4 text-sm text-[#4c739a]">{paciente.direccion || 'Sin dirección'}</td>
                      <td className="py-3 px-4 text-sm text-[#4c739a]">{paciente.contactoFamilia || 'Sin contacto'}</td>
                      <td className="py-3 px-4">
                        <Badge variant="success">Activo</Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button variant="secondary" size="sm">Ver</Button>
                          <Button variant="outline" size="sm">Editar</Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}
