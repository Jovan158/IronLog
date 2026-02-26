import { useRef, useState } from 'react'
import { ArrowLeft, Download, Upload, Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useSettingsStore } from '../stores/settingsStore'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { useToast } from '../components/ui/Toast'
import { exportAllData, importData, deleteAllData } from '../utils/dataExport'
import type { AiCoachMode } from '../types'

export default function SettingsPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const {
    aiCoachMode,
    apiEndpoint,
    apiKey,
    apiModel,
    units,
    setAiCoachMode,
    setApiEndpoint,
    setApiKey,
    setApiModel,
    setUnits,
  } = useSettingsStore()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteInput, setDeleteInput] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = async () => {
    try {
      await exportAllData()
      showToast('Data exported', 'success')
    } catch {
      showToast('Failed to export data', 'error')
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      await importData(file)
      showToast('Data imported successfully', 'success')
    } catch {
      showToast('Failed to import data', 'error')
    }
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDeleteAll = async () => {
    if (deleteInput !== 'DELETE') return
    try {
      await deleteAllData()
      showToast('All data deleted', 'success')
      setShowDeleteConfirm(false)
      setDeleteInput('')
    } catch {
      showToast('Failed to delete data', 'error')
    }
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-text-muted hover:text-text-primary transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-text-primary">Settings</h2>
      </div>

      <Card className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-text-primary">AI Coach Mode</h3>
        <div className="flex gap-2">
          {(['builtin', 'api'] as AiCoachMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setAiCoachMode(mode)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                aiCoachMode === mode
                  ? 'bg-accent text-black'
                  : 'bg-surface-alt text-text-secondary hover:text-text-primary'
              }`}
            >
              {mode === 'builtin' ? 'Built-in' : 'Custom API'}
            </button>
          ))}
        </div>

        {aiCoachMode === 'api' && (
          <div className="flex flex-col gap-3">
            <Input
              label="API Endpoint"
              value={apiEndpoint}
              onChange={(e) => setApiEndpoint(e.target.value)}
              placeholder="https://api.openai.com/v1/chat/completions"
            />
            <Input
              label="API Key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
            />
            <Input
              label="Model"
              value={apiModel}
              onChange={(e) => setApiModel(e.target.value)}
              placeholder="gpt-3.5-turbo"
            />
          </div>
        )}
      </Card>

      <Card className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-text-primary">Units</h3>
        <div className="flex gap-2">
          {(['kg', 'lbs'] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnits(u)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                units === u
                  ? 'bg-accent text-black'
                  : 'bg-surface-alt text-text-secondary hover:text-text-primary'
              }`}
            >
              {u.toUpperCase()}
            </button>
          ))}
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <h3 className="text-lg font-semibold text-text-primary">Data Management</h3>

        <Button variant="ghost" onClick={handleExport} className="flex items-center gap-2 justify-start w-full">
          <Download size={16} />
          Export Data
        </Button>

        <Button
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 justify-start w-full"
        >
          <Upload size={16} />
          Import Data
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />

        <Button
          variant="destructive"
          onClick={() => setShowDeleteConfirm(true)}
          className="flex items-center gap-2 justify-center w-full"
        >
          <Trash2 size={16} />
          Delete All Data
        </Button>
      </Card>

      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false)
          setDeleteInput('')
        }}
        title="Delete All Data"
      >
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            This will permanently delete all your workout plans, sessions, diary entries, and
            messages. Type <strong className="text-destructive">DELETE</strong> to confirm.
          </p>
          <Input
            value={deleteInput}
            onChange={(e) => setDeleteInput(e.target.value)}
            placeholder='Type "DELETE" to confirm'
          />
          <div className="flex gap-3">
            <Button
              variant="ghost"
              onClick={() => {
                setShowDeleteConfirm(false)
                setDeleteInput('')
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAll}
              disabled={deleteInput !== 'DELETE'}
              className="flex-1"
            >
              Delete Everything
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
