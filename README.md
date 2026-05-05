# 🎮 GameCube BIOS Portfolio

A high-performance, 3D interactive portfolio experience inspired by the legendary Nintendo GameCube BIOS menu. Built with **Next.js 15**, **React 19**, and **Three.js**, this project pushes the boundaries of modern web portfolios with a retro-tech aesthetic.

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=three.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## ✨ Features

### 🕹️ **Interactive 3D Navigation**
- **GameCube BIOS Logic**: Seamless transitions between navigation states (Projects, About, Experience, Contact).
- **Multimodal Controls**:
  - ⌨️ **Keyboard**: WASD or Arrow Keys.
  - 📱 **Touch**: Swipe gestures for mobile devices.
  - 🖱️ **D-Pad**: On-screen interactive navigation guide.
- **Glassmorphism Materials**: Premium physical-based rendering (PBR) materials with realistic transparency and blur.

### 🌌 **Advanced 3D Graphics**
- **React Three Fiber & Drei**: Optimized 3D scene management.
- **Post-processing Engine**: Real-time Bloom, Selective Glow, and Contact Shadows.
- **Instanced Mesh Background**: High-performance background particles using instanced rendering for 60FPS on mobile.
- **Responsive 3D Engine**: Dynamic scene scaling that adapts to portrait and landscape orientations.

### 🛠️ **Modern Architecture**
- **Next.js 15 App Router**: Leveraging the latest server components and streaming features.
- **React 19 Ready**: Utilizing the latest React hooks and performance improvements.
- **Tailwind CSS 4**: Next-generation styling with CSS variables and optimized build times.
- **Resend Integration**: Fully functional contact form with HTML email templates.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17+
- npm / yarn / pnpm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/TheBasol/portfolio-nextjs.git
cd portfolio-nextjs
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Resend Email Configuration
RESEND_API_KEY=re_your_api_key
RESEND_FROM_EMAIL=onboarding@resend.dev
CONTACT_EMAIL=your_email@example.com
```

4. **Run the development server**
```bash
npm run dev
```

5. **Initialize System**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🎮 Controls

| Action | Keyboard | Touch | UI |
| :--- | :--- | :--- | :--- |
| **Projects** | `W` / `↑` | Swipe Up | D-Pad Up |
| **About** | `S` / `↓` | Swipe Down | D-Pad Down |
| **Experience** | `A` / `←` | Swipe Left | D-Pad Left |
| **Contact** | `D` / `→` | Swipe Right | D-Pad Right |
| **Enter Section** | `Enter` | Tap Cube | Click Cube |
| **Return Home** | `Opposite Key` | Swipe Opposite | Back Button |

---

## 📂 Project Structure

```text
portfolio-nextjs/
├── src/
│   ├── app/                 # Next.js 15 App Router (Pages & API)
│   ├── components/
│   │   ├── GameCube/        # 3D Logic (Cube, Modal, Scene)
│   │   ├── portfolio/       # UI Components (D-Pad, Contact Form)
│   │   └── ui/              # Reusable UI primitives
│   ├── data/                # Content definitions (portfolioContent.ts)
│   ├── hooks/               # Custom animation & interaction hooks
│   └── styles/              # Tailwind 4 & Global CSS
├── public/                  # 3D models and static assets
└── ...
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Runtime**: [React 19](https://react.dev/)
- **3D Engine**: [Three.js](https://threejs.org/) / [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Email**: [Resend](https://resend.com/)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with 💜 by [Enrique Vazquez](https://github.com/TheBasol)
