# FinTracker - Personal Bookkeeping App

A Next.js application for tracking personal finances, similar to Quicken.

## Features

1. **Account Management**

   - Create, read, update, and delete bank accounts
   - Each account has detailed information including:
     - Account name and number
     - Initial balance
     - Contact information (person, address, phone, email, etc.)
     - Active/inactive status (inactive accounts are grayed out)

2. **Transaction Tracking**

   - Add, edit, and delete transactions for each account
   - Transaction fields include:
     - Date
     - Check number
     - Payee
     - Category
     - Description
     - Debit/Credit amounts
     - Running balance calculation
   - Toggle between showing all transactions or only uncleared ones
   - Reconciliation features (mark transactions as cleared)

3. **Financial Overview**

   - Dashboard showing all accounts with current balances
   - Total balance across all accounts
   - Quick access to account details

4. **Reporting**

   - Pie chart showing spending by category
   - Line graph comparing account balances
   - Visual representations of financial data

5. **Security**

   - Login/logout functionality
   - Automatic logout after 20 minutes of inactivity

6. **Data Formatting**
   - Currency values displayed in thousands format ($#,###,###.00)
   - Clear distinction between all transactions and cleared transactions using colors

## Project Structure

```
├── app/                    # Next.js app router pages
│   ├── accounts/           # Account-related pages
│   │   ├── [id]/           # Individual account pages
│   │   │   ├── edit/       # Edit account page
│   │   │   ├── transactions/
│   │   │   │   └── new/    # New transaction page
│   │   │   └── page.tsx    # Account details page
│   │   └── new/            # New account page
│   ├── login/              # Login page
│   ├── reports/            # Reports page
│   ├── layout.tsx          # Root layout with header
│   └── page.tsx            # Dashboard page
├── components/             # React components
│   ├── accounts/           # Account-related components
│   ├── layout/             # Layout components (header, etc.)
│   └── transactions/       # Transaction-related components
├── data/                   # Mock data
├── types/                  # TypeScript type definitions
└── utils/                  # Utility functions
```

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom components with Tailwind styling
- **Data**: Mock data (in a real application, this would connect to a database)

## Getting Started

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

2. Run the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages

- `/` - Dashboard with account overview
- `/login` - Login page
- `/accounts/new` - Create a new account
- `/accounts/[id]` - View account details and transactions
- `/accounts/[id]/edit` - Edit an account
- `/accounts/[accountId]/transactions/new` - Add a new transaction
- `/reports` - Financial reports and visualizations

## Data Models

### Account

- id: string
- name: string
- accountNumber: string
- initialBalance: number
- contactPerson: string
- address: string
- city: string
- state: string
- zipCode: string
- contactName: string
- email: string
- phone: string
- fax: string
- isActive: boolean

### Transaction

- id: string
- accountId: string
- date: Date
- checkNumber: string
- payee: string
- category: string
- description: string
- debit: number
- credit: number
- isCleared: boolean

## Development Notes

This is a frontend-only implementation with mock data. In a production environment, you would:

1. Connect to a backend API for data persistence
2. Implement proper authentication and authorization
3. Add data validation and error handling
4. Implement proper state management (Redux, Context API, etc.)
5. Add unit and integration tests
6. Implement proper form validation
7. Add accessibility features
8. Optimize for performance and SEO
