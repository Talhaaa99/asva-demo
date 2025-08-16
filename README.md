# Swap Demo - Web3 DApp

A modern, responsive Web3 DApp for token swapping built with Next.js 15, TypeScript, TailwindCSS, and Web3 technologies.

## 🚀 Features

- **Token Swapping**: ETH ↔ USDC swaps on Base network
- **Multi-Network Support**: Base, Ethereum, and Sepolia testnets
- **Real-time Pricing**: Live token prices from CoinGecko API
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **Mobile Responsive**: Optimized for all device sizes
- **Toast Notifications**: Real-time transaction status updates
- **Modern UI**: Crypto-style design with animations and micro-interactions

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles and Tailwind directives
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── Dashboard.tsx  # Main dashboard layout
│   │   ├── SwapCard.tsx   # Token swap interface
│   │   ├── WalletInfo.tsx # Wallet and balance display
│   │   └── NetworkSelector.tsx # Network switching
│   ├── ui/                # Reusable UI components
│   │   └── toast.tsx      # Toast notifications
│   ├── theme-provider.tsx # Theme context provider
│   └── theme-toggle.tsx   # Theme toggle component
├── hooks/                 # Custom React hooks
│   ├── useSwap.ts         # Swap logic and state management
│   ├── useEstimate.ts     # Swap estimation hook
│   ├── usePrices.ts       # Token price fetching
│   ├── useWallet.ts       # Wallet operations
│   └── use-toast.ts       # Toast utilities
├── lib/                   # Utility libraries
│   ├── types.ts           # TypeScript type definitions
│   ├── constants.ts       # Application constants
│   ├── utils.ts           # Utility functions
│   ├── contracts.ts       # Contract ABIs and addresses
│   ├── prices.ts          # Price calculation utilities
│   └── services/          # Business logic services
│       ├── swapService.ts # Swap-related operations
│       ├── toastService.ts # Toast notification service
│       └── configService.ts # Configuration management
├── context/               # React context providers
│   └── index.tsx          # Wagmi and AppKit context
└── config/                # Configuration files
    └── index.tsx          # Project-wide configuration
```

## 🎯 Best Practices Implemented

### 1. **Type Safety**

- Centralized TypeScript types in `lib/types.ts`
- Strict type checking throughout the application
- Proper interface definitions for all data structures

### 2. **Separation of Concerns**

- **Services**: Business logic separated into service classes
- **Hooks**: Custom hooks for reusable logic
- **Components**: UI components focused on presentation
- **Utilities**: Pure functions for common operations

### 3. **Configuration Management**

- Environment variables with fallbacks
- Centralized constants in `lib/constants.ts`
- Configuration service for app-wide settings

### 4. **Error Handling**

- Comprehensive error boundaries
- User-friendly error messages
- Graceful fallbacks for API failures

### 5. **Performance Optimization**

- Debounced input handlers
- Memoized calculations
- Efficient re-renders with proper dependencies

### 6. **Code Organization**

- Modular file structure
- Consistent naming conventions
- Clear separation of concerns
- Reusable components and hooks

## 🛠️ Key Services

### SwapService

Handles all swap-related business logic:

- Swap estimation calculations
- Token decimal handling
- Swap path determination
- Function name resolution

### ToastService

Manages all toast notifications:

- Transaction status updates
- Error handling
- Explorer link generation
- Consistent styling

### ConfigService

Manages application configuration:

- Environment variables
- Contract configurations
- Chain support validation
- App-wide settings

## 🎨 UI/UX Features

### Design System

- **Colors**: Consistent color palette with dark/light mode support
- **Typography**: Sora font family for crypto-friendly aesthetics
- **Spacing**: Consistent spacing using Tailwind's spacing scale
- **Animations**: Smooth transitions and micro-interactions

### Components

- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Gradient backgrounds with hover effects
- **Inputs**: Focus states with gradient glows
- **Toasts**: Animated notifications with explorer links

## 🔧 Development

### Prerequisites

- Node.js 18+
- npm or pnpm
- MetaMask or compatible wallet

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_COINGECKO_API_KEY=your_coingecko_api_key
```

### Development Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

## 📱 Mobile Responsiveness

The application is fully responsive with:

- Mobile-first design approach
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements
- Optimized navigation for mobile devices

## 🌙 Theme System

Supports both dark and light modes:

- **Dark Mode**: Deep backgrounds with neon accents
- **Light Mode**: Clean off-white with subtle gradients
- **Smooth Transitions**: Animated theme switching
- **Persistent Storage**: Theme preference saved locally

## 🔗 Blockchain Integration

### Supported Networks

- **Base Mainnet** (Chain ID: 8453)
- **Ethereum Mainnet** (Chain ID: 1)
- **Sepolia Testnet** (Chain ID: 11155111)

### Contract Addresses

- Uniswap V2 Router addresses for each network
- Token contract addresses (ETH, USDC, WETH)
- Proper ABI definitions for all interactions

## 🚀 Deployment

The application is optimized for deployment on:

- Vercel (recommended)
- Netlify
- Any static hosting platform

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues, please open a GitHub issue or contact the development team.
