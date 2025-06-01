# Imperium-Luxwall

A modern, AI-powered analytics dashboard for window replacement and energy efficiency optimization, featuring advanced data visualization, migration insights, and automated email outreach capabilities.

![Preview](preview-optimized.gif)

## 🏢 Overview

Imperium-Luxwall is a comprehensive SaaS platform designed to help businesses optimize their window replacement strategies through:

- **AI-Driven Analytics**: Advanced algorithms analyze building energy profiles and Section 179D tax eligibility
- **Migration Insights**: Comprehensive assessment of window replacement potential and ROI calculations
- **Energy Efficiency Tracking**: Real-time monitoring of HVAC cost reductions and energy savings
- **Automated Outreach**: AI-powered email campaigns and lead conversion optimization
- **Financial Modeling**: Section 179D tax benefit calculations and payback period analysis

## ✨ Features

- 🎯 **Modern Dashboard**: Glassmorphic UI with dark theme and responsive design
- 📊 **Advanced Visualizations**: Interactive charts powered by Recharts and D3
- 🤖 **AI Analytics**: Smart building assessment and recommendation engine
- 💰 **Section 179D Integration**: Automated tax benefit calculations and compliance tracking
- 📧 **Email Automation**: Intelligent outreach campaigns with conversion tracking
- 🏗️ **Migration Planning**: Comprehensive timeline and resource planning tools
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- ⚡ **High Performance**: Built with React 18, TypeScript, and Vite

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for lightning-fast development
- **Tailwind CSS** + **DaisyUI** for styling
- **Material-UI** for complex components
- **Framer Motion** for animations
- **React Query** for data management
- **React Router** for navigation
- **Recharts** for data visualization

### Design System
- **Glassmorphic UI** with dark theme
- **Responsive grid system**
- **Accessible components** (WCAG 2.1 AA compliant)
- **Micro-interactions** and smooth animations

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ LTS
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alexparkay/Imperium-Luxwall.git
   cd Imperium-Luxwall
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:5173](http://localhost:5173)

### Building for Production

```bash
cd frontend
npm run build
```

The build output will be in the `frontend/dist` directory.

## 📁 Project Structure

```
Imperium-Luxwall/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   │   ├── images/          # Image assets (Luxwall, SAP, solar)
│   │   └── external-software/ # External integrations
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── api/            # API integration
│   │   ├── utils/          # Utility functions
│   │   ├── types/          # TypeScript type definitions
│   │   └── contexts/       # React contexts
│   ├── vercel.json         # Vercel deployment config
│   └── package.json        # Frontend dependencies
├── backend/                 # Node.js backend (optional)
└── README.md               # Project documentation
```

## 🎨 Design Principles

### Color Palette
```css
/* Background Colors */
--bg-primary: #0A0A0A;     /* Near-black base */
--bg-secondary: #1A1A1A;   /* Card background */
--bg-accent: #2A2A2A;      /* Hover states */

/* Text Colors */
--text-primary: #FFFFFF;    /* Headings */
--text-secondary: #B3B3B3;  /* Body text */
--text-muted: #666666;     /* Less important text */

/* Accent Colors */
--accent-primary: #3B82F6;  /* Blue */
--accent-secondary: #10B981; /* Green */
--accent-warning: #F59E0B;  /* Orange */
```

### Glassmorphism Effects
```css
.glass-panel {
  background: rgba(26, 26, 26, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.37);
}
```

## 🚀 Deployment

This project is optimized for deployment on **Vercel**:

1. **Connect your GitHub repository** to Vercel
2. **Set the root directory** to `frontend`
3. **Deploy** - Vercel will automatically detect the Vite configuration

### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

## 📊 Key Features Overview

### 1. Migration Insights
- Building energy assessment and analysis
- Window replacement potential calculations
- ROI and payback period modeling
- Section 179D tax benefit optimization

### 2. AI Analytics
- Smart building profiling
- Energy efficiency predictions
- Cost reduction forecasting
- Implementation timeline planning

### 3. Email Automation
- Automated outreach campaigns
- Lead scoring and qualification
- Conversion rate optimization
- Follow-up sequence management

### 4. Financial Modeling
- Section 179D compliance tracking
- Tax deduction calculations
- Cash flow projections
- Investment analysis tools

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run e2e tests
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support, email support@imperiumluxwall.com or create an issue on GitHub.

## 🌟 Acknowledgments

- **Luxwall** for energy-efficient glass technology
- **Section 179D** tax incentive program
- **React** and **Vite** communities for excellent tooling
- **Tailwind CSS** for the utility-first CSS framework

<br/>
<p align="center">
    <a href="https://react-admin-ui-v1.vercel.app/" target="_blank">
        <img width="60%" src="logo.jpg" alt="Logo">
    </a>
</p>

<br/>
<p align="center">
    <a href="LICENSE" target="_blank"><img src="https://img.shields.io/github/license/fransachmadhw/react_admin_ui_v1" alt="GitHub license"></a>
    <a><img src="https://img.shields.io/badge/version-1.0.0-blue" alt="version"></a>
    <a><img src="https://img.shields.io/github/stars/fransachmadhw/react_admin_ui_v1" alt="GitHub stars"></a>
    <a><img src="https://img.shields.io/github/languages/top/fransachmadhw/react_admin_ui_v1" alt="language"></a>
    <a><img src="https://img.shields.io/github/forks/fransachmadhw/react_admin_ui_v1" alt="forks"></a>
</p>
<br/>

[React Admin UI](https://react-admin-ui-v1.vercel.app/) is a beautiful and open-source **Dashboard User Interface Prototype** built with TypeScript and React based. Surprisingly, this is my first time building a User Interface prototype with a bit complex components. So, my goal is IT agencies or even individual developers could use this prototype to brings insight for their future projects.

Have a look at the preview of [React Admin UI](https://react-admin-ui-v1.vercel.app/) for a comprehensive list of prototype's features, core values and use cases.

<br/>
<p align="center">
    <img width="80%" src="preview-optimized.gif" alt="preview">
</p>
<br/>

This repository contains the **core system of React Admin UI Prototype**, splitted into two different directories. Backend is for the JSON API (It is already configured for Vercel deployment), and Frontend is for the whole User Interface prototype.

## 💎&nbsp; Features and Consist of

- ⚡️ React 18 TypeScript with Vite
- 🎯 Declarative Routing with React Router v6
- 📋 Seamless Data Fetching with React Query v5
- ✨ Optimized Icons with React Icons v5
- 🎨 Tailwind CSS v3 as the Styling Foundation
- 👓 Daisy UI v4 as the Base Design System
- 🕶 Material UI v5 for optimized Data Grid
- 📊 Beautiful Charts with Recharts v2
- 🤯 And many more...

## 🚀&nbsp; Installation and How to use

See below for a quickstart installation and usage examples.

<details open>
<summary>Backend</summary>

Install all dependencies listed in `package.json` inside backend directory.

```bash
cd backend
```

```bash
npm install
```

By default, I already deployed the API to run in Vercel environment. The live API can be accessed from [https://react-admin-ui-v1-api.vercel.app/](https://react-admin-ui-v1-api.vercel.app/). However, in case you would like to configure the backend by yourself, you can run below.

```bash
nodemon ./src/index.ts
```

And the API can be accessed locally from [http://localhost:5000](http://localhost:5000).

</details>

<details open>
<summary>Frontend</summary>

Install all dependencies listed in `package.json` inside frontend directory.

```bash
cd frontend
```

```bash
npm install
```

```bash
npm run dev
```

If you would like to change the default API endpoint, you can go to [ApiCollection.tsx](/frontend/src/api/ApiCollection.tsx).

And then, the app can be accessed from [http://localhost:5173/](http://localhost:5173/).

</details>

## 📫&nbsp; Have a question? Would like to chat? Ran into a problem?

Obviously you can always **reach out to me directly** via a formal approach such as [Email](mailto:franswinata6@gmail.com) or [LinkedIn](https://www.linkedin.com/in/fransachmadhw/).

## 🤝&nbsp; Found a bug? Suggesting a specific feature?

Feel free to **file a new issue** with a respective title and description on the the [fransachmadhw/react_admin_ui_v1](https://github.com/fransachmadhw/react_admin_ui_v1/issues) repository. If you already found a solution to your problem, **we would love to review your pull request**!

## ✅&nbsp; Requirements

React Admin UI requires a **Node version higher or equal to 20.11.0 LTS**. Have a look at the `dependencies` and `devDependencies` section in the _package.json_ inside [backend](/backend/package.json) and [frontend](/frontend/package.json) to find the **current list of the requirements** of React Admin UI.

## 📘&nbsp; License

React Admin Dashboard UI Prototype is released under the terms of the [BSD-3-Clause](LICENSE).
