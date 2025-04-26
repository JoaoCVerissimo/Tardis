'use client'

import { AccountingAreaChart } from '@/components/charts/AccountingAreaChart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
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
  // Add state for compounding frequency
  const [compoundingFrequency, setCompoundingFrequency] = useState<
    'annually' | 'semi-annually' | 'quarterly' | 'monthly' | 'weekly' | 'daily'
  >('annually')
  const [numberOfYears, setNumberOfYears] = useState<number>(40)
  const [results, setResults] = useState<CalculationResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState<number>(1)

  const calculateCompoundInterest = () => {
    setError(null) // Clear previous errors
    const calculatedResults: CalculationResult[] = []
    let currentBalance = initialInvestment
    let totalInvested = initialInvestment
    const rateDecimal = annualRate / 100

    // Determine deposit periods and amount
    const depositPeriodsPerYear = depositFrequency === 'monthly' ? 12 : 52
    const depositPerPeriod = depositAmount

    // Determine compounding periods based on selection
    let compoundingPeriodsPerYear: number
    switch (compoundingFrequency) {
      case 'annually':
        compoundingPeriodsPerYear = 1
        break
      case 'semi-annually':
        compoundingPeriodsPerYear = 2
        break
      case 'quarterly':
        compoundingPeriodsPerYear = 4
        break
      case 'monthly':
        compoundingPeriodsPerYear = 12
        break
      case 'weekly':
        compoundingPeriodsPerYear = 52
        break
      case 'daily':
        compoundingPeriodsPerYear = 365 // Assuming 365 days
        break
      default:
        compoundingPeriodsPerYear = 1 // Default to annually
    }
    const ratePerCompoundingPeriod = rateDecimal / compoundingPeriodsPerYear

    if (
      initialInvestment < 0 ||
      depositAmount < 0 ||
      annualRate < 0 ||
      isNaN(initialInvestment) ||
      isNaN(depositAmount) ||
      isNaN(annualRate) ||
      numberOfYears <= 0 ||
      isNaN(numberOfYears)
    ) {
      setError(
        'Please enter valid positive numbers for amounts, rate, and years.'
      )
      setResults([])
      return
    }

    // Use numberOfYears from state
    for (let year = 1; year <= numberOfYears; year++) {
      let yearlyDeposits = 0
      // const balanceBeforeInterest = currentBalance // Removed unused variable

      // --- Handle Deposits for the year ---
      // This loop adds deposits based on depositFrequency
      // We assume deposits happen *before* interest is compounded within the year
      for (
        let depositPeriod = 0;
        depositPeriod < depositPeriodsPerYear;
        depositPeriod++
      ) {
        currentBalance += depositPerPeriod
        yearlyDeposits += depositPerPeriod
      }
      totalInvested += yearlyDeposits

      // --- Handle Interest Compounding for the year ---
      // Now apply interest based on compoundingFrequency
      // Start with the balance after deposits for the year
      let balanceToCompound = currentBalance
      for (
        let compoundPeriod = 0;
        compoundPeriod < compoundingPeriodsPerYear;
        compoundPeriod++
      ) {
        const interestThisCompoundingPeriod =
          balanceToCompound * ratePerCompoundingPeriod
        balanceToCompound += interestThisCompoundingPeriod
      }
      // Update the main currentBalance after all compounding for the year is done
      currentBalance = balanceToCompound

      const cumulativeInterest = currentBalance - totalInvested

      calculatedResults.push({
        year: year,
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        interestEarned: parseFloat(cumulativeInterest.toFixed(2)),
        totalBalance: parseFloat(currentBalance.toFixed(2)),
      })
    }

    setResults(calculatedResults)
  }

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // Reset to first page on new calculation
    calculateCompoundInterest()
  }

  // Pagination logic
  const itemsPerPage = 10
  const totalPages = Math.ceil(results.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedResults = results.slice(startIndex, endIndex)

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
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

          {/* Compounding Frequency */}
          <div>
            <label
              htmlFor="compoundingFrequency"
              className="text-foreground mb-2 block text-sm font-medium"
            >
              Compounding Frequency
            </label>
            <select
              id="compoundingFrequency"
              value={compoundingFrequency}
              onChange={(e) =>
                setCompoundingFrequency(
                  e.target.value as
                    | 'annually'
                    | 'semi-annually'
                    | 'quarterly'
                    | 'monthly'
                    | 'weekly'
                    | 'daily'
                )
              }
              required
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="annually">Annually</option>
              <option value="semi-annually">Semi-Annually</option>
              <option value="quarterly">Quarterly</option>
              <option value="monthly">Monthly</option>
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
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

          {/* Number of Years */}
          <div>
            <label
              htmlFor="numberOfYears"
              className="text-foreground mb-2 block text-sm font-medium"
            >
              Number of Years
            </label>
            <Input
              id="numberOfYears"
              type="number"
              value={numberOfYears}
              onChange={(e) => setNumberOfYears(parseInt(e.target.value, 10))}
              min="1"
              step="1"
              required
              className="w-full"
            />
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
                {/* Use paginatedResults for the table */}
                {paginatedResults.map((result, index) => {
                  // Calculate the index in the full results array
                  const fullIndex = startIndex + index
                  // Get the previous year's cumulative interest (if available)
                  const previousCumulativeInterest =
                    fullIndex > 0 ? results[fullIndex - 1].interestEarned : 0
                  // Calculate the interest earned *this* year
                  const annualInterest =
                    result.interestEarned - previousCumulativeInterest

                  return (
                    <tr key={result.year}>
                      <td className="px-4 py-2 text-sm">{result.year}</td>
                      <td className="px-4 py-2 text-sm">
                        {result.totalInvested.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-sm">
                        {/* Display cumulative interest */}
                        {result.interestEarned.toLocaleString()}
                        {/* Display annual interest in parentheses */}
                        <span className="text-muted-foreground ml-1 text-xs">
                          (+{annualInterest.toLocaleString()})
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm font-medium">
                        {result.totalBalance.toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Add Pagination Controls */}
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePreviousPage()
                    }}
                    aria-disabled={currentPage === 1}
                    className={
                      currentPage === 1
                        ? 'text-muted-foreground pointer-events-none opacity-50'
                        : undefined
                    }
                  />
                </PaginationItem>
                {/* Simple page number display - can be enhanced later */}
                <PaginationItem>
                  <span className="text-muted-foreground px-4 text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handleNextPage()
                    }}
                    aria-disabled={currentPage === totalPages}
                    className={
                      currentPage === totalPages
                        ? 'text-muted-foreground pointer-events-none opacity-50'
                        : undefined
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}

          <div className="mt-4">
            <AccountingAreaChart data={results} />
          </div>
        </div>
      )}
    </div>
  )
}
