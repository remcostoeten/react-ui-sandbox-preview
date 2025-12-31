"use client"
import { EvaluatorWorkspace } from "@/features/evaluator"

const EXAMPLE_CODE = `import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Counter() {
  const [count, setCount] = useState(0)
  
  return (
    <Card className="w-64">
      <CardHeader>
        <CardTitle>Counter</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 items-center">
        <span className="text-4xl font-bold">{count}</span>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setCount(c => c - 1)}>-</Button>
          <Button variant="outline" onClick={() => setCount(c => c + 1)}>+</Button>
        </div>
      </CardContent>
    </Card>
  )
}`

export default function Page() {
  return <EvaluatorWorkspace />
}
