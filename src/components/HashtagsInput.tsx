'use client'

import React, { useState, KeyboardEvent, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from 'lucide-react'

interface HashtagsInputProps {
  value?: string
  onChange: (value: string) => void
}

export function HashtagsInput({ value, onChange }: HashtagsInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])

  useEffect(() => {
    // Initialize hashtags from the value prop
    if (value) {
      setHashtags(value.split(',').filter(tag => tag.trim() !== ''))
    }
  }, [value])

  const updateHashtags = (newHashtags: string[]) => {
    setHashtags(newHashtags)
    onChange(newHashtags.join(','))
  }

  const addHashtag = (tag: string) => {
    const formattedTag = tag.startsWith('#') ? tag : `#${tag}`
    if (formattedTag.length > 1 && !hashtags.includes(formattedTag)) {
      const newHashtags = [...hashtags, formattedTag]
      updateHashtags(newHashtags)
      setInputValue('')
    }
  }

  const removeHashtag = (tagToRemove: string) => {
    const newHashtags = hashtags.filter(tag => tag !== tagToRemove)
    updateHashtags(newHashtags)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInputValue(value)

    if (value.includes(' ') || value.includes(',')) {
      const tags = value.split(/[\s,]+/)
      tags.forEach(tag => tag && addHashtag(tag.trim()))
    }
  }

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue) {
      e.preventDefault()
      addHashtag(inputValue)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {hashtags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button
              onClick={() => removeHashtag(tag)}
              className="text-xs hover:text-destructive focus:outline-none"
              aria-label={`Remove ${tag}`}
            >
              <X size={14} />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        type="text"
        placeholder="Add hashtags (separate with space or comma)"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className="w-full"
      />
    </div>
  )
}