import '@testing-library/jest-dom'

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveClass(...expected: string[]): R
      toHaveAttribute(attr: string, value?: string): R
      toBeDisabled(): R
      toHaveTextContent(text: string): R
    }
  }
}

export {} 