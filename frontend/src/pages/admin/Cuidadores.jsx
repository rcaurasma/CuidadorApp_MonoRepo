import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layouts/AdminLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import PageHeader from '../../components/common/PageHeader'
import { LoadingState, EmptyState, ErrorState } from '../../components/common/DataState'
import { cuidadorService, unwrapList } from '../../services/api'

export default function Cuidadores() {
  const [cuidadores, setCuidadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    setError('')
    cuidadorService.getAll()
      .then((res) => setCuidadores(unwrapList(res.data)))
      .catch(() => setError('No se pudieron cargar los cuidadores. Verifica permisos de administrador.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AdminLayout title="Gestión de Cuidadores">
      <div className="p-8 space-y-6">
        <PageHeader
          title="Cuidadores"
          description="Listado de cuidadores según modelo SQL (nombre, documento, teléfono, activo)."
          breadcrumb={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Cuidadores' }
          ]}
          actionLabel="Nuevo Cuidador"
          actionIcon="add"
        />

        <Card>
          {loading && <LoadingState label="Cargando cuidadores..." />}
          {!loading && error && <ErrorState message={error} />}
          {!loading && !error && cuidadores.length === 0 && (
            <EmptyState label="No hay cuidadores registrados todavía." />
          )}

          {!loading && !error && cuidadores.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px]">
                <thead>
                  <tr className="border-b border-[#e7edf3]">
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Nombre</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Documento</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Teléfono</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Estado</th>
                    <th className="text-right py-3 px-4 text-sm font-bold text-[#4c739a]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cuidadores.map((cuidador) => (
                    <tr key={cuidador.id} className="border-b border-[#e7edf3] hover:bg-[#f6f7f8]">
                      <td className="py-3 px-4 text-sm font-semibold">{cuidador.nombre}</td>
                      <td className="py-3 px-4 text-sm text-[#4c739a]">{cuidador.documento || 'Sin documento'}</td>
                      <td className="py-3 px-4 text-sm text-[#4c739a]">{cuidador.telefono || 'Sin teléfono'}</td>
                      <td className="py-3 px-4">
                        <Badge variant={cuidador.activo ? 'success' : 'warning'}>
                          {cuidador.activo ? 'Activo' : 'Inactivo'}
                        </Badge>
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
