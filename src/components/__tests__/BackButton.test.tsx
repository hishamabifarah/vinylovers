import { render, screen, fireEvent } from '@testing-library/react'
import BackButton from '../BackButton'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
}))

// Mock Button component
jest.mock('../ui/button', () => ({
  Button: ({ className, onClick, children, ...props }: any) => (
    <button
      onClick={onClick}
      className={cn('button-base', className)}
      data-testid={props['data-testid']}
      {...props}
      onKeyDown={(e) => {
        if (e.key === 'Enter' && onClick) {
          onClick(e)
        }
      }}
    >
      {children}
    </button>
  ),
}))

describe('BackButton', () => {
  const mockRouter = {
    back: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockImplementation(() => mockRouter)
  })

  it('renders correctly', () => {
    render(<BackButton>Back</BackButton>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Back')
  })

  it('calls router.back when clicked', () => {
    render(<BackButton>Back</BackButton>)
    fireEvent.click(screen.getByRole('button'))
    expect(mockRouter.back).toHaveBeenCalledTimes(1)
  })

  it('applies custom className when provided', () => {
    render(<BackButton className="custom-class">Back</BackButton>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('forwards additional props', () => {
    render(<BackButton data-testid="test-button">Back</BackButton>)
    expect(screen.getByTestId('test-button')).toBeInTheDocument()
  })

  it('handles keyboard navigation', () => {
    render(<BackButton>Back</BackButton>)
    const button = screen.getByRole('button')
    fireEvent.keyDown(button, { key: 'Enter' })
    expect(mockRouter.back).toHaveBeenCalledTimes(1)
  })
}) 