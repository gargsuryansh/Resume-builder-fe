interface KeywordChipProps {
  label: string
  type: 'matched' | 'missing'
}

export const KeywordChip = ({ label, type }: KeywordChipProps) => (
  <span className={type === 'matched' ? 'keyword-chip-matched' : 'keyword-chip-missing'}>
    {type === 'matched' ? '✓' : '✗'} {label}
  </span>
)
