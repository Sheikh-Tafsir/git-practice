import React from 'react'

import { Button } from "@/components/ui/button.jsx";
import { Loader2 } from "lucide-react"

const ButtonLoading = () => {
  return (
    <Button disabled className="w-full" style={{ backgroundColor: 'rgb(24,62,139)' }}>
        <Loader2 className="animate-spin" />
        Please wait
    </Button>
  )
}

export default ButtonLoading
