import { useState } from 'react'
import FamilyLayout from '../../components/layouts/FamilyLayout'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import PageHeader from '../../components/common/PageHeader'
import { ErrorState } from '../../components/common/DataState'

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Support() {
  const [formData, setFormData] = useState({
    email: '',
    asunto: '',
    mensaje: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const onChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const onSubmit = (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!emailRegex.test(formData.email)) {
      setError('Ingresa un email válido para contacto.')
      return
    }
    if (!formData.asunto.trim() || !formData.mensaje.trim()) {
      setError('Asunto y mensaje son obligatorios.')
      return
    }

    setSuccess('Solicitud enviada. El equipo de soporte responderá en breve.')
    setFormData({ email: '', asunto: '', mensaje: '' })
  }

  return (
    <FamilyLayout title="Support & Help Center">
      <div className="p-8 space-y-6">
        <PageHeader
          title="Support"
          description="Centro de ayuda para consultas operativas, agenda y reportes de cuidado."
          breadcrumb={[
            { label: 'Family', path: '/family/dashboard' },
            { label: 'Support' }
          ]}
        />

        {error && <ErrorState message={error} />}
        {success && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 text-sm">
            {success}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <h4 className="text-lg font-bold mb-4">Contacto de soporte</h4>
            <form onSubmit={onSubmit} className="space-y-4">
              <Input label="Email" name="email" type="email" value={formData.email} onChange={onChange} required />
              <Input label="Asunto" name="asunto" value={formData.asunto} onChange={onChange} required />

              <div className="flex flex-col gap-2">
                <label className="text-[#0d141b] text-sm font-semibold">Mensaje</label>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={onChange}
                  rows={5}
                  className="w-full border border-[#cfdbe7] rounded-lg p-3 text-sm"
                  required
                />
              </div>

              <Button type="submit" variant="primary" icon="send">Enviar</Button>
            </form>
          </Card>

          <Card>
            <h4 className="text-lg font-bold mb-4">Preguntas frecuentes</h4>
            <div className="space-y-3 text-sm">
              <div className="border border-[#e7edf3] rounded-lg p-3">
                <p className="font-semibold">¿Cómo reprogramo una visita?</p>
                <p className="text-[#4c739a] mt-1">Desde Schedule & Booking puedes ver y actualizar próximos turnos.</p>
              </div>
              <div className="border border-[#e7edf3] rounded-lg p-3">
                <p className="font-semibold">¿Cómo veo el historial de cuidado?</p>
                <p className="text-[#4c739a] mt-1">Usa la sección History e ingresa el ID del paciente para consultar guardias.</p>
              </div>
              <div className="border border-[#e7edf3] rounded-lg p-3">
                <p className="font-semibold">¿Cómo actualizo datos de paciente?</p>
                <p className="text-[#4c739a] mt-1">Solicita cambios desde Medical Records o por este canal de soporte.</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </FamilyLayout>
  )
}