interface SectionHeaderProps {
  title: string
  subtitle?: string
}

export const SectionHeader = ({ title, subtitle }: SectionHeaderProps) => (
  <div className="mb-6">
    <h3 className="section-header">{title}</h3>
    {subtitle && <p className="text-body-md text-text-muted">{subtitle}</p>}
  </div>
)
