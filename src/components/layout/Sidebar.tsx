import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home, FileText, Zap, BarChart3, Search, Briefcase,
  Mail, MessageCircle, History, Settings, Cpu
} from 'lucide-react'
import { clsx } from 'clsx'

const navItems = [
  { path: '/', icon: Home, label: 'Dashboard', section: 'WORKSPACE' },
  { path: '/builder', icon: FileText, label: 'Resume Builder', section: 'WORKSPACE' },
  { path: '/tailor', icon: Zap, label: 'AI Tailor', featured: true, section: 'AI TOOLS' },
  { path: '/analyzer', icon: BarChart3, label: 'AI Analyzer', section: 'AI TOOLS' },
  { path: '/cover-letter', icon: Mail, label: 'Cover Letter', section: 'AI TOOLS' },
  { path: '/interview-prep', icon: MessageCircle, label: 'Interview Prep', section: 'AI TOOLS' },
  { path: '/jobs', icon: Briefcase, label: 'Job Search', section: 'JOB DISCOVERY' },
  { path: '/scraper', icon: Search, label: 'Job Scraper', section: 'JOB DISCOVERY' },
  { path: '/history', icon: History, label: 'History', section: 'ACCOUNT' },
  { path: '/settings', icon: Settings, label: 'Settings', section: 'ACCOUNT' },
]

export const Sidebar = () => {
  return (
    <aside className="w-64 h-screen fixed left-0 top-0 flex flex-col border-r border-border-subtle bg-bg-primary/95 backdrop-blur-md z-50">
      {/* Logo */}
      <div className="p-6 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-gradient-brand flex items-center justify-center">
            <Cpu size={16} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-heading-sm text-text-primary">ResumeForge</p>
            <p className="text-body-sm text-text-muted">Pro</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {['WORKSPACE', 'AI TOOLS', 'JOB DISCOVERY', 'ACCOUNT'].map((section) => (
          <div key={section} className="space-y-1">
            <h3 className="px-3 text-[10px] font-bold tracking-widest text-text-muted uppercase mb-2">
              {section}
            </h3>
            {navItems
              .filter((item) => item.section === section)
              .map(({ path, icon: Icon, label, featured }) => (
                <NavLink key={path} to={path}>
                  {({ isActive }) => (
                    <motion.div
                      className={clsx(
                        'flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors relative',
                        isActive
                          ? 'bg-brand-primary/15 text-brand-glow'
                          : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary',
                        featured && !isActive && 'border border-brand-primary/20'
                      )}
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.15 }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute left-0 top-0 bottom-0 w-0.5 rounded-full bg-gradient-brand"
                        />
                      )}
                      <Icon size={18} />
                      <span className="text-body-md font-medium">{label}</span>
                      {featured && (
                        <span className="ml-auto text-label bg-brand-primary/20 text-brand-glow px-1.5 py-0.5 rounded-full">
                          AI
                        </span>
                      )}
                    </motion.div>
                  )}
                </NavLink>
              ))}
          </div>
        ))}
      </nav>
    </aside>
  )
}
