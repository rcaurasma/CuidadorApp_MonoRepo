import { useEffect, useState } from 'react'
import AdminLayout from '../../components/layouts/AdminLayout'
import Card from '../../components/common/Card'
import Badge from '../../components/common/Badge'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import { LoadingState, EmptyState, ErrorState } from '../../components/common/DataState'
import api, { pagoService, unwrapList } from '../../services/api'

export default function Pagos() {
  const [pagos, setPagos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmingId, setConfirmingId] = useState(null)

  const loadPagos = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await pagoService.getAll()
      setPagos(unwrapList(res.data))
    } catch {
      setError('No se pudieron cargar los pagos. Esta vista requiere rol admin.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPagos()
  }, [])

  const confirmarPago = async (id) => {
    setConfirmingId(id)
    try {
      await api.put(`/pagos/${id}/confirmar`)
      await loadPagos()
    } catch {
      setError('No se pudo confirmar el pago seleccionado.')
    } finally {
      setConfirmingId(null)
    }
  }

  return (
    <AdminLayout title="Billing y Pagos">
      <div className="p-8 space-y-6">
        <PageHeader
          title="Billing"
          description="Control de pagos por cuidador y estado de confirmación."
          breadcrumb={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Billing' }
          ]}
          actionLabel="Actualizar"
          actionIcon="refresh"
          onAction={loadPagos}
        />

        <Card>
          {loading && <LoadingState label="Cargando pagos..." />}
          {!loading && error && <ErrorState message={error} />}
          {!loading && !error && pagos.length === 0 && (
            <EmptyState label="No hay pagos registrados." />
          )}

          {!loading && !error && pagos.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className="border-b border-[#e7edf3]">
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Cuidador</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Monto</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Método</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Fecha pago</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Estado</th>
                    <th className="text-right py-3 px-4 text-sm font-bold text-[#4c739a]">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((pago) => (
                    <tr key={pago.id} className="border-b border-[#e7edf3] hover:bg-[#f6f7f8]">
                      <td className="py-3 px-4 text-sm font-semibold">{pago.cuidador?.nombre || 'Sin cuidador'}</td>
                      <td className="py-3 px-4 text-sm text-[#4c739a]">${pago.monto || 0}</td>
                      <td className="py-3 px-4 text-sm text-[#4c739a]">{pago.metodo || 'Sin método'}</td>
                      <td className="py-3 px-4 text-sm text-[#4c739a]">{pago.fechaPago || 'Pendiente'}</td>
                      <td className="py-3 px-4">
                        <Badge variant={pago.confirmado ? 'success' : 'warning'}>
                          {pago.confirmado ? 'Confirmado' : 'Pendiente'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {!pago.confirmado ? (
                          <Button
                            size="sm"
                            variant="primary"
                            disabled={confirmingId === pago.id}
                            onClick={() => confirmarPago(pago.id)}
                          >
                            {confirmingId === pago.id ? 'Confirmando...' : 'Confirmar'}
                          </Button>
                        ) : (
                          <Button size="sm" variant="secondary" disabled>Confirmado</Button>
                        )}
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