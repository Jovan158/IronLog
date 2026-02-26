import { useEffect, useState } from 'react'
import { Plus, Edit2, Trash2 } from 'lucide-react'
import { useWorkoutStore } from '../../stores/workoutStore'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { Modal } from '../ui/Modal'
import { ConfirmDialog } from '../ui/ConfirmDialog'
import { EmptyState } from '../ui/EmptyState'
import { useToast } from '../ui/Toast'
import { PlanEditor } from './PlanEditor'

export function PlanList() {
  const { plans, loadPlans, createPlan, deletePlan } = useWorkoutStore()
  const { showToast } = useToast()
  const [showCreate, setShowCreate] = useState(false)
  const [newPlanName, setNewPlanName] = useState('')
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null)

  useEffect(() => {
    loadPlans()
  }, [loadPlans])

  const handleCreate = async () => {
    if (!newPlanName.trim()) return
    await createPlan(newPlanName.trim())
    setNewPlanName('')
    setShowCreate(false)
    showToast('Plan created', 'success')
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await deletePlan(deleteTarget)
    setDeleteTarget(null)
    showToast('Plan deleted', 'success')
  }

  if (editingPlanId) {
    const plan = plans.find((p) => p.id === editingPlanId)
    if (plan) {
      return <PlanEditor plan={plan} onBack={() => setEditingPlanId(null)} />
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">My Plans</h3>
        <Button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 text-sm">
          <Plus size={16} />
          New Plan
        </Button>
      </div>

      {plans.length === 0 ? (
        <EmptyState
          title="No workout plans"
          description="Create your first plan to get started"
        />
      ) : (
        plans.map((plan) => (
          <Card key={plan.id} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-text-primary">{plan.name}</p>
              <p className="text-xs text-text-muted">{plan.days.length} day{plan.days.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingPlanId(plan.id)} className="text-text-muted hover:text-text-primary p-2 transition-colors" aria-label="Edit plan">
                <Edit2 size={16} />
              </button>
              <button onClick={() => setDeleteTarget(plan.id)} className="text-text-muted hover:text-destructive p-2 transition-colors" aria-label="Delete plan">
                <Trash2 size={16} />
              </button>
            </div>
          </Card>
        ))
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Workout Plan">
        <div className="flex flex-col gap-4">
          <Input
            label="Plan Name"
            placeholder="e.g. Upper Lower Split"
            value={newPlanName}
            onChange={(e) => setNewPlanName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <Button onClick={handleCreate} disabled={!newPlanName.trim()} className="w-full">
            Create Plan
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Plan"
        message="Are you sure you want to delete this plan? This cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
      />
    </div>
  )
}
