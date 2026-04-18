/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
  	extend: {
  		colors: {
  			brand: {
  				primary: '#6366F1',
  				secondary: '#8B5CF6',
  				glow: '#818CF8'
  			},
  			bg: {
  				primary: '#0A0E1A',
  				secondary: '#111827',
  				tertiary: '#1C2333',
  				elevated: '#1F2A3D'
  			},
  			border: {
  				subtle: '#1F2937',
  				default: '#374151'
  			},
  			text: {
  				primary: '#F9FAFB',
  				secondary: '#9CA3AF',
  				muted: '#4B5563'
  			},
  			success: '#10B981',
  			warning: '#F59E0B',
  			error: '#EF4444',
  			info: '#3B82F6'
  		},
  		backgroundImage: {
  			'gradient-brand': 'linear-gradient(135deg, #6366F1, #8B5CF6)',
  			'gradient-card': 'linear-gradient(135deg, #1C2333, #111827)',
  			'gradient-glow': 'radial-gradient(ellipse at center, rgba(99,102,241,0.15), transparent 70%)'
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'Fira Code',
  				'monospace'
  			]
  		},
  		fontSize: {
  			display: [
  				'3rem',
  				{
  					lineHeight: '1.1',
  					letterSpacing: '-0.02em',
  					fontWeight: '800'
  				}
  			],
  			'heading-xl': [
  				'2rem',
  				{
  					lineHeight: '1.2',
  					letterSpacing: '-0.01em',
  					fontWeight: '700'
  				}
  			],
  			'heading-lg': [
  				'1.5rem',
  				{
  					lineHeight: '1.3',
  					fontWeight: '700'
  				}
  			],
  			'heading-md': [
  				'1.25rem',
  				{
  					lineHeight: '1.4',
  					fontWeight: '600'
  				}
  			],
  			'heading-sm': [
  				'1rem',
  				{
  					lineHeight: '1.5',
  					fontWeight: '600'
  				}
  			],
  			'body-lg': [
  				'1rem',
  				{
  					lineHeight: '1.6',
  					fontWeight: '400'
  				}
  			],
  			'body-md': [
  				'0.875rem',
  				{
  					lineHeight: '1.5',
  					fontWeight: '400'
  				}
  			],
  			'body-sm': [
  				'0.75rem',
  				{
  					lineHeight: '1.4',
  					fontWeight: '400'
  				}
  			],
  			label: [
  				'0.75rem',
  				{
  					lineHeight: '1',
  					letterSpacing: '0.05em',
  					fontWeight: '500'
  				}
  			]
  		},
  		borderRadius: {
  			sm: '8px',
  			md: '12px',
  			lg: '16px',
  			xl: '24px',
  			full: '9999px'
  		},
  		boxShadow: {
  			'glow-sm': '0 0 15px rgba(99,102,241,0.15)',
  			'glow-md': '0 0 30px rgba(99,102,241,0.2)',
  			'glow-lg': '0 0 60px rgba(99,102,241,0.25)',
  			card: '0 4px 24px rgba(0,0,0,0.3)',
  			'card-hover': '0 8px 32px rgba(0,0,0,0.4)'
  		},
  		backdropBlur: {
  			xs: '4px',
  			sm: '8px',
  			md: '16px',
  			lg: '24px',
  			xl: '40px'
  		},
  		animation: {
  			'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  			float: 'float 6s ease-in-out infinite',
  			glow: 'glow 2s ease-in-out infinite alternate',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		keyframes: {
  			float: {
  				'0%, 100%': {
  					transform: 'translateY(0px)'
  				},
  				'50%': {
  					transform: 'translateY(-10px)'
  				}
  			},
  			glow: {
  				'0%': {
  					boxShadow: '0 0 20px rgba(99,102,241,0.3)'
  				},
  				'100%': {
  					boxShadow: '0 0 40px rgba(99,102,241,0.6)'
  				}
  			},
  			'gradient-shift': {
  				'0%, 100%': {
  					backgroundPosition: '0% 50%'
  				},
  				'50%': {
  					backgroundPosition: '100% 50%'
  				}
  			},
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		}
  	}
  },
  plugins: [require('@tailwindcss/typography')],
}
