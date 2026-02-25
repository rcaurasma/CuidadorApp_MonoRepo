import { useEffect, useMemo, useState } from 'react'
import CaregiverLayout from '../../components/layouts/CaregiverLayout'
import Card from '../../components/common/Card'
import StatCard from '../../components/common/StatCard'
import Badge from '../../components/common/Badge'
import PageHeader from '../../components/common/PageHeader'
import { LoadingState, EmptyState, ErrorState } from '../../components/common/DataState'
import { guardiaService, pagoService, unwrapList } from '../../services/api'

export default function Payroll() {
  const [pagos, setPagos] = useState([])
  const [guardias, setGuardias] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError('')
      try {
        const [pagosRes, guardiasRes] = await Promise.all([
          pagoService.getAll(),
          guardiaService.getAll()
        ])
        setPagos(unwrapList(pagosRes.data))
        setGuardias(unwrapList(guardiasRes.data))
      } catch {
        setError('No fue posible cargar payroll completo. Se muestra estimación con guardias disponibles.')
        try {
          const guardiasRes = await guardiaService.getAll()
          setGuardias(unwrapList(guardiasRes.data))
        } catch {
          setGuardias([])
        }
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const totalHoras = useMemo(() => guardias.reduce((sum, item) => sum + (item.horasTrabajadas || 0), 0), [guardias])
  const estimado = useMemo(() => totalHoras * 12, [totalHoras])
  const totalPagado = useMemo(() => pagos.filter((p) => p.confirmado).reduce((sum, p) => sum + (p.monto || 0), 0), [pagos])

  return (
    <CaregiverLayout title="Payroll & Earnings">
      <div className="p-8 space-y-6">
        <PageHeader
          title="Payroll"
          description="Vista de pagos confirmados y estimación por horas trabajadas."
          breadcrumb={[
            { label: 'Caregiver', path: '/caregiver/dashboard' },
            { label: 'Payroll' }
          ]}
        />

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Horas registradas" value={`${totalHoras}h`} icon="timelapse" />
            <StatCard title="Estimado" value={`$${estimado.toFixed(2)}`} icon="payments" />
            <StatCard title="Pagado" value={`$${totalPagado.toFixed(2)}`} icon="verified" />
          </div>
        )}

        <Card>
          {loading && <LoadingState label="Cargando payroll..." />}
          {!loading && error && <ErrorState message={error} />}
          {!loading && pagos.length === 0 && <EmptyState label="No hay pagos visibles para este usuario. Verifica permisos del backend." />}

          {!loading && pagos.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-[#e7edf3]">
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Fecha</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Monto</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Método</th>
                    <th className="text-left py-3 px-4 text-sm font-bold text-[#4c739a]">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {pagos.map((pago) => (
                    <tr key={pago.id} className="border-b border-[#e7edf3]">
                      <td className="py-3 px-4 text-sm">{pago.fechaPago || 'Pendiente'}</td>
                      <td className="py-3 px-4 text-sm">${(pago.monto || 0).toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm">{pago.metodo || 'Sin método'}</td>
                      <td className="py-3 px-4 text-sm">
                        <Badge variant={pago.confirmado ? 'success' : 'warning'}>
                          {pago.confirmado ? 'Confirmado' : 'Pendiente'}
                        </Badge>
                      </td>
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