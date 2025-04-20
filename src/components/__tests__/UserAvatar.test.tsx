import { render, screen } from '@testing-library/react'
import UserAvatar from '../UserAvatar'
import { cn } from '@/lib/utils'

// Mock avatar placeholder
jest.mock('@/assets/avatar-placeholder.png', () => 'mocked-avatar-placeholder.png')

// Mock cn utility
jest.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
}))

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, width, height, className }: {
    src: string | { src: string }
    alt: string
    width: number
    height: number
    className?: string
  }) => {
    const combinedClassName = cn(
      'aspect-square h-fit flex-none rounded-full bg-secondary object-cover',
      className
    )
    return (
      <img
        src={typeof src === 'string' ? src : src.src}
        alt={alt}
        width={width}
        height={height}
        className={combinedClassName}
      />
    )
  },
}))

describe('UserAvatar', () => {
  const defaultProps = {
    avatarUrl: 'https://example.com/avatar.jpg',
    size: 48,
  }

  it('renders correctly with default props', () => {
    render(<UserAvatar {...defaultProps} />)
    const avatar = screen.getByRole('img')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('alt', 'User avatar')
    expect(avatar).toHaveAttribute('width', '48')
    expect(avatar).toHaveAttribute('height', '48')
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg')
  })

  it('renders with custom className', () => {
    render(<UserAvatar {...defaultProps} className="custom-avatar" />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveClass('custom-avatar')
  })

  it('renders with fallback when avatarUrl is null', () => {
    render(<UserAvatar avatarUrl={null} />)
    const avatar = screen.getByRole('img')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', 'mocked-avatar-placeholder.png')
  })

  it('applies custom size', () => {
    render(<UserAvatar {...defaultProps} size={64} />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveAttribute('width', '64')
    expect(avatar).toHaveAttribute('height', '64')
  })

  it('uses default size when not provided', () => {
    render(<UserAvatar avatarUrl={defaultProps.avatarUrl} />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveAttribute('width', '48')
    expect(avatar).toHaveAttribute('height', '48')
  })

  it('has correct default styles', () => {
    render(<UserAvatar {...defaultProps} />)
    const avatar = screen.getByRole('img')
    expect(avatar).toHaveClass('aspect-square')
    expect(avatar).toHaveClass('rounded-full')
    expect(avatar).toHaveClass('bg-secondary')
    expect(avatar).toHaveClass('object-cover')
  })
}) 