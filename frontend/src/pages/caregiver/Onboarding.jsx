import { useState } from 'react'
import CaregiverLayout from '../../components/layouts/CaregiverLayout'
import Card from '../../components/common/Card'
import Input from '../../components/common/Input'
import Button from '../../components/common/Button'
import Badge from '../../components/common/Badge'
import PageHeader from '../../components/common/PageHeader'
import { ErrorState } from '../../components/common/DataState'
import { documentoService, unwrapList } from '../../services/api'

export default function Onboarding() {
  const [formData, setFormData] = useState({
    cuidadorId: '',
    tipoDocumento: 'cedula',
    archivo: null
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [documentos, setDocumentos] = useState([])

  const onChange = (event) => {
    const { name, value, files } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const loadDocuments = async (cuidadorId) => {
    try {
      const response = await documentoService.getByCuidador(cuidadorId)
      setDocumentos(unwrapList(response.data))
    } catch {
      setDocumentos([])
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const cuidadorId = Number(formData.cuidadorId)
    if (!cuidadorId || cuidadorId <= 0) {
      setError('El ID de cuidador debe ser un número mayor a 0.')
      return
    }
    if (!formData.archivo) {
      setError('Debes seleccionar un archivo para continuar.')
      return
    }

    const payload = new FormData()
    payload.append('tipo_documento', formData.tipoDocumento)
    payload.append('archivo', formData.archivo)

    setSubmitting(true)
    try {
      await documentoService.upload(cuidadorId, payload)
      setSuccess('Documento cargado correctamente.')
      await loadDocuments(cuidadorId)
    } catch {
      setError('No se pudo cargar el documento. Verifica permisos y formato del archivo.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <CaregiverLayout title="Onboarding & Verification">
      <div className="p-8 space-y-6">
        <PageHeader
          title="Onboarding"
          description="Carga de documentos de verificación (cedula, certificado, antecedentes)."
          breadcrumb={[
            { label: 'Caregiver', path: '/caregiver/dashboard' },
            { label: 'Onboarding' }
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
            <h4 className="text-lg font-bold mb-4">Subir documento</h4>
            <form onSubmit={onSubmit} className="space-y-4">
              <Input
                label="ID de cuidador"
                name="cuidadorId"
                type="number"
                placeholder="Ej: 1"
                value={formData.cuidadorId}
                onChange={onChange}
                required
              />

              <div className="flex flex-col gap-2">
                <label className="text-[#0d141b] text-sm font-semibold">Tipo de documento</label>
                <select
                  name="tipoDocumento"
                  value={formData.tipoDocumento}
                  onChange={onChange}
                  className="h-12 px-4 border border-[#cfdbe7] rounded-lg bg-white"
                >
                  <option value="cedula">Cédula</option>
                  <option value="certificado">Certificado</option>
                  <option value="antecedentes">Antecedentes</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[#0d141b] text-sm font-semibold">Archivo</label>
                <input
                  type="file"
                  name="archivo"
                  onChange={onChange}
                  className="h-12 px-3 py-2 border border-[#cfdbe7] rounded-lg bg-white"
                  accept=".pdf,.png,.jpg,.jpeg"
                />
              </div>

              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Subiendo...' : 'Enviar documento'}
              </Button>
            </form>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold">Documentos cargados</h4>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => formData.cuidadorId && loadDocuments(Number(formData.cuidadorId))}
              >
                Recargar
              </Button>
            </div>

            {!formData.cuidadorId && (
              <p className="text-sm text-[#4c739a]">Ingresa un ID de cuidador para consultar sus documentos.</p>
            )}

            {formData.cuidadorId && documentos.length === 0 && (
              <p className="text-sm text-[#4c739a]">No hay documentos registrados para este cuidador.</p>
            )}

            {documentos.length > 0 && (
              <div className="space-y-2 max-h-[460px] overflow-auto">
                {documentos.map((doc) => (
                  <div key={doc.id} className="border border-[#e7edf3] rounded-lg p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold truncate">{doc.nombreArchivo}</p>
                      <Badge variant="info">{doc.tipoDocumento}</Badge>
                    </div>
                    <p className="text-xs text-[#4c739a] mt-1">Subido: {doc.fechaSubida}</p>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </CaregiverLayout>
  )
}