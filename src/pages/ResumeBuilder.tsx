import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, ArrowRight, ArrowLeft } from 'lucide-react'
import { useResumeStore } from '@store/resumeStore'
import { GlassCard } from '@components/ui/GlassCard'
import { ResumePreview } from '@components/shared/ResumePreview'
import { toast } from 'sonner'
import type { Resume } from '@lib/types'

const schema = z.object({
  personalInfo: z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Valid email is required"),
    phone: z.string().optional().nullable(),
    location: z.string().optional().nullable(),
    linkedin: z.string().optional().nullable(),
    github: z.string().optional().nullable(),
    website: z.string().optional().nullable(),
    summary: z.string().optional().nullable(),
  }),
  experience: z.array(z.object({
    company: z.string().min(1, "Required"),
    position: z.string().min(1, "Required"),
    startDate: z.string().min(1, "Required"),
    endDate: z.string().min(1, "Required"),
    description: z.string().transform(v => v.split('\n').filter(Boolean)),
  })),
  education: z.array(z.object({
    institution: z.string().min(1, "Required"),
    degree: z.string().min(1, "Required"),
    startDate: z.string().min(1, "Required"),
    endDate: z.string().min(1, "Required"),
    achievements: z.string().transform(v => v.split('\n').filter(Boolean)).optional(),
  })),
  projects: z.array(z.object({
    name: z.string().min(1, "Required"),
    description: z.string().min(1, "Required"),
    technologies: z.string().transform(v => v.split(',').map(s => s.trim()).filter(Boolean)),
    link: z.string().optional().nullable(),
    highlights: z.string().transform(v => v.split('\n').filter(Boolean)).optional(),
  })),
  skills: z.string().transform(v => {
    const list = v.split(',').map(s => s.trim()).filter(Boolean)
    return { "Core Settings": list }
  })
})

const STEPS = ['Personal Info', 'Experience', 'Education', 'Projects', 'Skills']

export const ResumeBuilder = () => {
  const [step, setStep] = useState(0)
  const { getActiveResume, updateResume } = useResumeStore()
  const resume = getActiveResume()

  const defaultValues = {
    personalInfo: resume?.personalInfo || { name: '', email: '' },
    experience: resume?.experience?.map(e => ({ ...e, description: e.description.join('\n') })) || [],
    education: resume?.education?.map(e => ({ ...e, achievements: e.achievements.join('\n') })) || [],
    projects: resume?.projects?.map(p => ({ ...p, technologies: p.technologies.join(', '), highlights: p.highlights.join('\n') })) || [],
    skills: Object.values(resume?.skills || {}).flat().join(', ') || ''
  }

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any
  })

  const { fields: expFields, append: appendExp, remove: removeExp } = useFieldArray({ control, name: 'experience' })
  const { fields: eduFields, append: appendEdu, remove: removeEdu } = useFieldArray({ control, name: 'education' })
  const { fields: projFields, append: appendProj, remove: removeProj } = useFieldArray({ control, name: 'projects' })

  const liveData = watch()

  // create a dummy safe resume object for live preview
  const safeResumeForPreview: Resume = {
    ...(resume as Resume),
    personalInfo: liveData.personalInfo as any || resume?.personalInfo,
    experience: (liveData.experience as any || []).map((e: any) => ({ ...e, description: typeof e.description === 'string' ? e.description.split('\n') : [] })),
    education: (liveData.education as any || []).map((e: any) => ({ ...e, achievements: typeof e.achievements === 'string' ? e.achievements.split('\n') : [] })),
    projects: (liveData.projects as any || []).map((p: any) => ({ ...p, technologies: typeof p.technologies === 'string' ? p.technologies.split(',') : [], highlights: typeof p.highlights === 'string' ? p.highlights.split('\n') : []}))
  }

  const onSubmit = (data: any) => {
    if (!resume) return
    updateResume(resume.id, data)
    toast.success('Resume saved successfully')
  }

  return (
    <div className="flex h-full">
      {/* Editor Side */}
      <div className="w-1/2 flex flex-col h-full border-r border-border-subtle overflow-hidden">
        {/* Step Indicator */}
        <div className="p-6 border-b border-border-subtle bg-bg-primary/80 sticky top-0 z-10">
          <div className="flex justify-between items-center px-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${i === step ? 'bg-brand-primary text-white' : i < step ? 'bg-success/20 text-success' : 'bg-bg-tertiary text-text-muted'}`}>
                  {i + 1}
                </div>
                <span className={`text-label ${i === step ? 'text-text-primary' : 'text-text-muted'}`}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Form Area */}
        <div className="flex-1 overflow-y-auto p-8">
          <form id="resume-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                {step === 0 && (
                  <div className="space-y-4">
                    <h3 className="section-header">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-label text-text-secondary">Full Name</label>
                        <input {...register('personalInfo.name')} className="input-field mt-1" />
                        {(errors as any).personalInfo?.name && <p className="text-error text-body-sm mt-1">{(errors as any).personalInfo.name.message as string}</p>}
                      </div>
                      <div>
                        <label className="text-label text-text-secondary">Email</label>
                        <input {...register('personalInfo.email')} className="input-field mt-1" />
                        {(errors as any).personalInfo?.email && <p className="text-error text-body-sm mt-1">{(errors as any).personalInfo.email.message as string}</p>}
                      </div>
                      <div>
                        <label className="text-label text-text-secondary">Phone</label>
                        <input {...register('personalInfo.phone')} className="input-field mt-1" />
                      </div>
                      <div>
                        <label className="text-label text-text-secondary">Location</label>
                        <input {...register('personalInfo.location')} className="input-field mt-1" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-label text-text-secondary">Professional Summary</label>
                        <textarea {...register('personalInfo.summary')} className="input-field mt-1 min-h-[100px]" placeholder="Brief overview of your professional background..." />
                      </div>
                    </div>
                  </div>
                )}
                
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="section-header !mb-0">Professional Experience</h3>
                       <button type="button" onClick={() => appendExp({ company: '', position: '', startDate: '', endDate: '', description: '' })} className="text-brand-glow text-body-sm font-medium hover:text-white flex items-center gap-1">
                         <Plus size={14} /> Add Role
                       </button>
                    </div>
                    {expFields.map((field, index) => (
                      <GlassCard key={field.id} className="p-4 relative">
                        <button type="button" onClick={() => removeExp(index)} className="absolute top-4 right-4 text-text-muted hover:text-error transition-colors">
                          <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-label">Company</label>
                            <input {...register(`experience.${index}.company`)} className="input-field mt-1" />
                          </div>
                          <div>
                            <label className="text-label">Role</label>
                            <input {...register(`experience.${index}.position`)} className="input-field mt-1" />
                          </div>
                          <div>
                            <label className="text-label">Start Date</label>
                            <input {...register(`experience.${index}.startDate`)} className="input-field mt-1" placeholder="MM/YYYY" />
                          </div>
                          <div>
                            <label className="text-label">End Date</label>
                            <input {...register(`experience.${index}.endDate`)} className="input-field mt-1" placeholder="MM/YYYY or Present" />
                          </div>
                          <div className="col-span-2">
                            <label className="text-label">Description (one bullet per line)</label>
                            <textarea {...register(`experience.${index}.description`)} className="input-field mt-1 min-h-[120px]" />
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="section-header !mb-0">Education</h3>
                       <button type="button" onClick={() => appendEdu({ institution: '', degree: '', startDate: '', endDate: '' })} className="text-brand-glow text-body-sm font-medium hover:text-white flex items-center gap-1">
                         <Plus size={14} /> Add Education
                       </button>
                    </div>
                    {eduFields.map((field, index) => (
                      <GlassCard key={field.id} className="p-4 relative">
                        <button type="button" onClick={() => removeEdu(index)} className="absolute top-4 right-4 text-text-muted hover:text-error transition-colors">
                          <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="text-label">Institution</label>
                            <input {...register(`education.${index}.institution`)} className="input-field mt-1" />
                          </div>
                          <div>
                            <label className="text-label">Degree/Certificate</label>
                            <input {...register(`education.${index}.degree`)} className="input-field mt-1" />
                          </div>
                          <div>
                            <label className="text-label">Start Date</label>
                            <input {...register(`education.${index}.startDate`)} className="input-field mt-1" />
                          </div>
                          <div>
                            <label className="text-label">End Date</label>
                            <input {...register(`education.${index}.endDate`)} className="input-field mt-1" />
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center mb-4">
                       <h3 className="section-header !mb-0">Projects</h3>
                       <button type="button" onClick={() => appendProj({ name: '', description: '', technologies: '', highlights: '' })} className="text-brand-glow text-body-sm font-medium hover:text-white flex items-center gap-1">
                         <Plus size={14} /> Add Project
                       </button>
                    </div>
                    {projFields.map((field, index) => (
                      <GlassCard key={field.id} className="p-4 relative">
                        <button type="button" onClick={() => removeProj(index)} className="absolute top-4 right-4 text-text-muted hover:text-error transition-colors">
                          <Trash2 size={16} />
                        </button>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <label className="text-label">Project Name</label>
                            <input {...register(`projects.${index}.name`)} className="input-field mt-1" />
                          </div>
                          <div className="col-span-2">
                            <label className="text-label">Description</label>
                            <input {...register(`projects.${index}.description`)} className="input-field mt-1" />
                          </div>
                          <div className="col-span-2">
                            <label className="text-label">Technologies (comma separated)</label>
                            <input {...register(`projects.${index}.technologies`)} className="input-field mt-1" />
                          </div>
                          <div className="col-span-2">
                            <label className="text-label">Highlights (one bullet per line)</label>
                            <textarea {...register(`projects.${index}.highlights`)} className="input-field mt-1 min-h-[80px]" />
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <h3 className="section-header">Skills</h3>
                    <div>
                      <label className="text-label text-text-secondary">Core Skills (comma separated)</label>
                      <textarea {...register('skills')} className="input-field mt-1 min-h-[150px]" placeholder="React, TypeScript, Node.js..." />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </form>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border-subtle bg-bg-secondary flex justify-between items-center">
          <button
            type="button"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <div className="flex gap-4">
            <button form="resume-form" type="submit" className="text-body-md text-text-muted hover:text-white transition-colors px-4">
              Save Draft
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
                className="btn-primary flex items-center gap-2"
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button form="resume-form" type="submit" className="btn-primary flex items-center gap-2 bg-success text-white">
                Finish <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Side */}
      <div className="w-1/2 h-full bg-bg-secondary p-8 overflow-y-auto">
        <div className="max-w-[800px] mx-auto scale-90 origin-top">
           <ResumePreview resume={safeResumeForPreview} />
        </div>
      </div>
    </div>
  )
}
