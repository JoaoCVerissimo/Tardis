'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

interface CalculationResult {
  year: number
  totalInvested: number
  interestEarned: number
  totalBalance: number
}

export default function AccountingPage() {
  const [initialInvestment, setInitialInvestment] = useState<number>(1000)
  const [depositAmount, setDepositAmount] = useState<number>(100)
  const [depositFrequency, setDepositFrequency] = useState<
    'monthly' | 'weekly'
  >('monthly')
  const [annualRate, setAnnualRate] = useState<number>(7) // Percentage
  const [results, setResults] = useState<CalculationResult[]>([])
  const [error, setError] = useState<string | null>(null)

  const calculateCompoundInterest = () => {
    setError(null) // Clear previous errors
    const calculatedResults: CalculationResult[] = []
    let currentBalance = initialInvestment
    let totalInvested = initialInvestment
    const rateDecimal = annualRate / 100

    const periodsPerYear = depositFrequency === 'monthly' ? 12 : 52
    const ratePerPeriod = rateDecimal / periodsPerYear
    const depositPerPeriod = depositAmount

    if (
      initialInvestment < 0 ||
      depositAmount < 0 ||
      annualRate < 0 ||
      isNaN(initialInvestment) ||
      isNaN(depositAmount) ||
      isNaN(annualRate)
    ) {
      setError('Please enter valid positive numbers for amounts and rate.')
      setResults([])
      return
    }

    for (let year = 1; year <= 40; year++) {
      // let yearlyInterestEarned = 0 // Removed unused variable
      let yearlyDeposits = 0

      for (let period = 0; period < periodsPerYear; period++) {
        // Add deposit at the start of the period
        currentBalance += depositPerPeriod
        yearlyDeposits += depositPerPeriod

        // Calculate interest for the period
        const interestThisPeriod = currentBalance * ratePerPeriod
        currentBalance += interestThisPeriod
        // yearlyInterestEarned += interestThisPeriod // Removed unused variable increment
      }

      totalInvested += yearlyDeposits

      calculatedResults.push({
        year: year,
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        interestEarned: parseFloat((currentBalance - totalInvested).toFixed(2)),
        totalBalance: parseFloat(currentBalance.toFixed(2)),
      })
    }

    setResults(calculatedResults)
  }

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    calculateCompoundInterest()
  }

  return (
    <div className="space-y-8">
      <h1 className="sr-only">Compound Interest Calculator</h1>

      <form
        onSubmit={handleCalculate}
        className="space-y-6 rounded-md border p-6"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Initial Investment */}
          <div>
            <label
              htmlFor="initialInvestment"
              className="text-foreground mb-2 block text-sm font-medium"
            >
              Initial Investment ($)
            </label>
            <Input
              id="initialInvestment"
              type="number"
              value={initialInvestment}
              onChange={(e) => setInitialInvestment(parseFloat(e.target.value))}
              min="0"
              step="any"
              required
              className="w-full"
            />
          </div>

          {/* Annual Interest Rate */}
          <div>
            <label
              htmlFor="annualRate"
              className="text-foreground mb-2 block text-sm font-medium"
            >
              Annual Interest Rate (%)
            </label>
            <Input
              id="annualRate"
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(parseFloat(e.target.value))}
              min="0"
              step="any"
              required
              className="w-full"
            />
          </div>

          {/* Deposit Amount */}
          <div>
            <label
              htmlFor="depositAmount"
              className="text-foreground mb-2 block text-sm font-medium"
            >
              Deposit Amount ($)
            </label>
            <Input
              id="depositAmount"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(parseFloat(e.target.value))}
              min="0"
              step="any"
              required
              className="w-full"
            />
          </div>

          {/* Deposit Frequency */}
          <div>
            <label
              htmlFor="depositFrequency"
              className="text-foreground mb-2 block text-sm font-medium"
            >
              Deposit Frequency
            </label>
            <select
              id="depositFrequency"
              value={depositFrequency}
              onChange={(e) =>
                setDepositFrequency(e.target.value as 'monthly' | 'weekly')
              }
              required
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
            </select>
          </div>
        </div>

        {error && <p className="text-destructive text-sm">{error}</p>}

        <Button type="submit" className="w-full md:w-auto">
          Calculate
        </Button>
      </form>

      {results.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Results</h2>
          <div className="overflow-x-auto rounded-md border">
            <table className="divide-border min-w-full divide-y">
              <thead className="bg-muted">
                <tr>
                  <th className="text-muted-foreground px-4 py-2 text-left text-sm font-medium">
                    Year
                  </th>
                  <th className="text-muted-foreground px-4 py-2 text-left text-sm font-medium">
                    Total Invested ($)
                  </th>
                  <th className="text-muted-foreground px-4 py-2 text-left text-sm font-medium">
                    Interest Earned ($)
                  </th>
                  <th className="text-muted-foreground px-4 py-2 text-left text-sm font-medium">
                    Total Balance ($)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border bg-background divide-y">
                {results.map((result) => (
                  <tr key={result.year}>
                    <td className="px-4 py-2 text-sm">{result.year}</td>
                    <td className="px-4 py-2 text-sm">
                      {result.totalInvested.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {result.interestEarned.toLocaleString()}
                    </td>
                    <td className="px-4 py-2 text-sm font-medium">
                      {result.totalBalance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* TODO: Implement graph here */}
          <div className="bg-muted text-muted-foreground mt-4 rounded-md border p-4 text-center">
            Graph placeholder - // TODO: Implement graph here
          </div>
        </div>
      )}
    </div>
  )
}
