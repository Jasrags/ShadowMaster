import { useState } from 'react'

export function useExample() {
  const [value, setValue] = useState<string>('')

  return {
    value,
    setValue,
  }
}

