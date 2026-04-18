import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import {
  Search, Home, FileText, Zap, History, Settings,
  Briefcase, Mail, MessageCircle, BarChart3, Command as CommandIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@lib/utils'

export const CommandPalette = () => {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-default bg-bg-tertiary/50 hover:bg-bg-tertiary transition-colors text-text-muted text-xs"
      >
        <CommandIcon size={12} />
        <span>Search actions...</span>
        <span className="ml-4 opacity-50">⌘K</span>
      </button>

      <AnimatePresence>
        {open && (
           <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                className="w-full max-w-xl bg-bg-elevated/95 backdrop-blur-xl border border-border-default rounded-xl shadow-glow overflow-hidden relative z-10"
              >
                <Command className="flex flex-col h-full">
                  <div className="flex items-center border-b border-border-subtle p-4">
                    <Search className="mr-3 text-text-muted shrink-0" size={18} />
                    <Command.Input
                      autoFocus
                      placeholder="What do you want to do?"
                      className="flex-1 bg-transparent border-none outline-none text-text-primary text-body-md placeholder:text-text-muted"
                    />
                  </div>
                  <Command.List className="max-h-[300px] overflow-y-auto p-2 scrollbar-hide">
                    <Command.Empty className="py-6 text-center text-text-muted text-body-sm">
                      No results found.
                    </Command.Empty>

                    <Command.Group heading="Navigation" className="px-2 py-2 text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      <Item onSelect={() => runCommand(() => navigate('/'))} icon={<Home size={16} />}>Dashboard</Item>
                      <Item onSelect={() => runCommand(() => navigate('/builder'))} icon={<FileText size={16} />}>Resume Builder</Item>
                      <Item onSelect={() => runCommand(() => navigate('/tailor'))} icon={<Zap size={16} />}>AI Tailor</Item>
                      <Item onSelect={() => runCommand(() => navigate('/analyzer'))} icon={<BarChart3 size={16} />}>AI Analyzer</Item>
                    </Command.Group>

                    <Command.Group heading="Tools" className="px-2 py-2 text-[10px] font-bold text-text-muted uppercase tracking-widest mt-2">
                      <Item onSelect={() => runCommand(() => navigate('/jobs'))} icon={<Briefcase size={16} />}>Job Search</Item>
                      <Item onSelect={() => runCommand(() => navigate('/cover-letter'))} icon={<Mail size={16} />}>Cover Letter</Item>
                      <Item onSelect={() => runCommand(() => navigate('/interview-prep'))} icon={<MessageCircle size={16} />}>Interview Prep</Item>
                    </Command.Group>

                    <Command.Group heading="Account" className="px-2 py-2 text-[10px] font-bold text-text-muted uppercase tracking-widest mt-2">
                       <Item onSelect={() => runCommand(() => navigate('/history'))} icon={<History size={16} />}>History</Item>
                       <Item onSelect={() => runCommand(() => navigate('/settings'))} icon={<Settings size={16} />}>Settings</Item>
                    </Command.Group>
                  </Command.List>
                </Command>
              </motion.div>
           </div>
        )}
      </AnimatePresence>
    </>
  )
}

const Item = ({ children, icon, onSelect }: { children: React.ReactNode, icon: React.ReactNode, onSelect?: () => void }) => (
  <Command.Item
    onSelect={onSelect}
    className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-text-secondary aria-selected:bg-brand-primary/10 aria-selected:text-brand-glow transition-all"
  >
    <div className="shrink-0">{icon}</div>
    <span className="text-body-md font-medium">{children}</span>
  </Command.Item>
)
