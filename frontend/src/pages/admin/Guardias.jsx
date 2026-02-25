import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../../components/layouts/AdminLayout'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import { LoadingState, EmptyState, ErrorState } from '../../components/common/DataState'
import { guardiaService, unwrapList } from '../../services/api'

const ROWS_PER_PAGE = 8

export default function Guardias() {
  const [guardias, setGuardias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setLoading(true)
    setError('')
    guardiaService.getAll()
      .then((res) => setGuardias(unwrapList(res.data)))
      .catch(() => setError('No se pudieron cargar los turnos de guardia.'))
      .finally(() => setLoading(false))
  }, [])

  const totalPages = useMemo(() => Math.max(1, Math.ceil(guardias.length / ROWS_PER_PAGE)), [guardias])
  const pageRows = useMemo(() => {
    const start = (page - 1) * ROWS_PER_PAGE
    return guardias.slice(start, start + ROWS_PER_PAGE)
  }, [guardias, page])

  return (
    <AdminLayout title="Turnos de Guardia">
      <div className="p-8 space-y-6">
        <PageHeader
          title="Turnos"
          description="Gestión de guardias por fecha, cuidador y paciente."
          breadcrumb={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Turnos' }
          ]}
          actionLabel="Nuevo Turno"
          actionIcon="add"
        />

        <Card>
          {loading && <LoadingState label="Cargando guardias..." />}
          {!loading && error && <ErrorState message={error} />}
          {!loading && !error && guardias.length === 0 && (
            <EmptyState label="No hay guardias cargadas." />
          )}

          {!loading && !error && guardias.length > 0 && (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead>
                    <tr className="border-b border-[#e7edf3]">
                      <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Fecha</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Cuidador</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Paciente</th>
                      <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Horas</th>
                      <th className="text-right py-3 px-4 text-sm font-bold text-[#4c739a]">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((guardia) => (
                      <tr key={guardia.id} className="border-b border-[#e7edf3] hover:bg-[#f6f7f8]">
                        <td className="py-3 px-4 text-sm font-semibold">{guardia.fecha || 'Sin fecha'}</td>
                        <td className="py-3 px-4 text-sm text-[#4c739a]">{guardia.cuidador?.nombre || 'Sin cuidador'}</td>
                        <td className="py-3 px-4 text-sm text-[#4c739a]">{guardia.paciente?.nombre || 'Sin paciente'}</td>
                        <td className="py-3 px-4 text-sm text-[#4c739a]">{guardia.horasTrabajadas || 0}h</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="secondary">Ver</Button>
                            <Button size="sm" variant="outline">Editar</Button>
                            <Button size="sm" variant="outline">Eliminar</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-4">
                <p className="text-sm text-[#4c739a]">Página {page} de {totalPages}</p>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" disabled={page === 1} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>Anterior</Button>
                  <Button size="sm" variant="secondary" disabled={page === totalPages} onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}>Siguiente</Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </div>
    </AdminLayout>
  )
}