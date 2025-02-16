import { Label } from '@/components/ui/label'
import React from 'react'

const StaredLabel = ({label}) => {
  return (
    <Label htmlFor="description" className="flex">{label}<p className="text-red-600">*</p></Label>
  )
}

export default StaredLabel
