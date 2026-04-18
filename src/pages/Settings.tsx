import { useState } from 'react'
import { Save, Server, FileOutput } from 'lucide-react'
import { useSettingsStore } from '@store/settingsStore'
import { SectionHeader } from '@components/ui/SectionHeader'
import { GlassCard } from '@components/ui/GlassCard'
import { toast } from 'sonner'
import { checkHealth } from '@lib/api'

export const Settings = () => {
  const { backendUrl, defaultExportFormat, setBackendUrl, setDefaultExportFormat } = useSettingsStore()
  const [localUrl, setLocalUrl] = useState(backendUrl)
  const [testing, setTesting] = useState(false)

  const handleSave = () => {
    setBackendUrl(localUrl)
    toast.success('Settings saved successfully')
  }

  const handleTestConnection = async () => {
    setTesting(true)
    try {
      // Temporarily use the local string to test before saving
      const originalUrl = backendUrl
      setBackendUrl(localUrl) // hack for test
      await checkHealth()
      toast.success('Connection successful')
    } catch {
      toast.error('Connection failed. Ensure backend is running.')
    } finally {
      // Revert until saved explicitly, actually the user expects it to be the tested one, 
      // so if it succeeds maybe we keep it, but let's just restore original state if not saved.
      setBackendUrl(backendUrl)
      setTesting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <SectionHeader 
        title="Settings" 
        subtitle="Manage your application preferences and backend connections." 
      />

      <div className="space-y-6">
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
             <Server size={18} className="text-brand-glow" />
             <h3 className="text-heading-sm">Backend Configuration</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="text-label text-text-secondary block mb-1">API Base URL</label>
              <div className="flex gap-3">
                <input 
                  type="url"
                  value={localUrl}
                  onChange={(e) => setLocalUrl(e.target.value)}
                  className="input-field flex-1"
                />
                <button 
                  onClick={handleTestConnection}
                  disabled={testing || !localUrl}
                  className="btn-secondary whitespace-nowrap"
                >
                  {testing ? 'Testing...' : 'Test Connection'}
                </button>
              </div>
              <p className="text-body-sm text-text-muted mt-2">
                Default: http://localhost:8000
              </p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
           <div className="flex items-center gap-2 mb-4">
             <FileOutput size={18} className="text-purple-400" />
             <h3 className="text-heading-sm">Export Preferences</h3>
          </div>

          <div>
             <label className="text-label text-text-secondary block mb-2">Default Export Format</label>
             <div className="flex gap-4">
                {[
                  { value: 'pdf', label: 'PDF Only' },
                  { value: 'docx', label: 'DOCX Only' },
                  { value: 'both', label: 'Both Formats' }
                ].map(opt => (
                  <label key={opt.value} className="flex items-center gap-2 cursor-pointer p-3 rounded-md border border-border-default bg-bg-tertiary hover:border-brand-primary transition-colors">
                    <input 
                      type="radio" 
                      name="export"
                      value={opt.value}
                      checked={defaultExportFormat === opt.value}
                      onChange={(e) => setDefaultExportFormat(e.target.value as any)}
                      className="accent-brand-primary"
                    />
                    <span className="text-body-md whitespace-nowrap">{opt.label}</span>
                  </label>
                ))}
             </div>
          </div>
        </GlassCard>

        <div className="flex justify-end pt-4">
          <button onClick={handleSave} className="btn-primary flex items-center gap-2">
            <Save size={18} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
