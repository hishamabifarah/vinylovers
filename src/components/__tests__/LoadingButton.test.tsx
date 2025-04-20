import { render, screen, fireEvent } from '@testing-library/react'
import LoadingButton from '../LoadingButton'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'

// Mock lucide-react Loader2 component
jest.mock('lucide-react', () => ({
  Loader2: () => <div data-testid="loader" className="size-5 animate-spin" />,
}))

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
}))

// Mock Button component
jest.mock('../ui/button', () => {
  const buttonVariants = () => 'button-base-styles'
  return {
    Button: ({ className, disabled, onClick, children, ...props }: any) => {
      const combinedClassName = cn('flex items-center gap-2 text-white', className)
      return (
        <button
          onClick={onClick}
          className={combinedClassName}
          disabled={disabled}
          {...props}
        >
          {children}
        </button>
      )
    },
    buttonVariants,
  }
})

describe('LoadingButton', () => {
  const defaultProps = {
    loading: false,
    children: 'Test Button',
  }

  it('renders correctly in default state', () => {
    render(<LoadingButton {...defaultProps} />)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Test Button')
    expect(button).not.toBeDisabled()
  })

  it('renders loading state correctly', () => {
    render(<LoadingButton loading>Loading...</LoadingButton>)
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Loading...')
    expect(button).toBeDisabled()
  })

  it('applies custom className', () => {
    render(
      <LoadingButton {...defaultProps} className="custom-class" />
    )
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })

  it('is disabled when loading', () => {
    render(<LoadingButton loading>Test Button</LoadingButton>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('shows loading spinner when loading', () => {
    render(<LoadingButton loading>Test Button</LoadingButton>)
    const spinner = screen.getByTestId('loader')
    expect(spinner).toBeInTheDocument()
    expect(spinner).toHaveClass('animate-spin')
  })

  it('does not show loading spinner when not loading', () => {
    render(<LoadingButton {...defaultProps} />)
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
  })

  it('forwards additional props', () => {
    render(
      <LoadingButton {...defaultProps} data-testid="test-button" />
    )
    expect(screen.getByTestId('test-button')).toBeInTheDocument()
  })

  it('handles click events when not loading', () => {
    const handleClick = jest.fn()
    render(
      <LoadingButton {...defaultProps} onClick={handleClick} />
    )
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not handle click events when loading', () => {
    const handleClick = jest.fn()
    render(
      <LoadingButton loading onClick={handleClick}>
        Test Button
      </LoadingButton>
    )
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('has correct default styles', () => {
    render(<LoadingButton {...defaultProps} />)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('flex')
    expect(button).toHaveClass('items-center')
    expect(button).toHaveClass('gap-2')
    expect(button).toHaveClass('text-white')
  })
}) 