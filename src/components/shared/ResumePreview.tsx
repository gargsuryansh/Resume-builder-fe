import type { Resume } from '@lib/types'

interface ResumePreviewProps {
  resume: Resume
}

export const ResumePreview = ({ resume }: ResumePreviewProps) => {
  return (
    <div className="bg-white text-black p-8 rounded-lg shadow-inner text-sm font-sans min-h-[800px]">
      <div className="mb-6 border-b border-gray-300 pb-4 text-center">
        <h1 className="text-3xl font-bold uppercase mb-1">{resume.personalInfo.name || 'Your Name'}</h1>
        <div className="text-gray-600 flex justify-center gap-4 text-xs">
          {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
          {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
          {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
        </div>
      </div>
      
      {resume.personalInfo.summary && (
        <div className="mb-6">
          <p className="text-sm leading-relaxed">{resume.personalInfo.summary}</p>
        </div>
      )}

      {resume.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-3 border-b border-gray-200">Experience</h2>
          {resume.experience.map((exp, i) => (
            <div key={i} className="mb-4">
              <div className="flex justify-between font-bold mb-1">
                <span>{exp.position} — {exp.company}</span>
                <span className="text-gray-600 text-xs">{exp.startDate} - {exp.endDate}</span>
              </div>
              <ul className="list-disc list-inside space-y-1">
                {exp.description.map((desc, j) => (
                  <li key={j} className="text-gray-800 text-sm">{desc}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {resume.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold uppercase mb-3 border-b border-gray-200">Education</h2>
          {resume.education.map((edu, i) => (
            <div key={i} className="mb-3">
              <div className="flex justify-between font-bold">
                <span>{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                <span className="text-gray-600 text-xs">{edu.startDate} - {edu.endDate}</span>
              </div>
              <div className="text-gray-700">{edu.institution}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
