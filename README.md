#  Modern Portfolio Website

A sleek, modern portfolio website built with Next.js 15, featuring stunning 3D animations, responsive design, and a functional contact form.

![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)

##  Features

###  **Modern Design**
- Responsive layout optimized for all devices
- Dark theme with vibrant accent colors
- Smooth animations and transitions
- Professional typography using Geist font

###  **3D Visualization**
- Interactive 3D wave animation using React Three Fiber
- Particle system with realistic physics
- Device-optimized performance (mobile/tablet/desktop)
- Bloom post-processing effects

###  **Contact System**
- Functional contact form with real-time validation
- Email delivery via Resend API
- Auto-hiding success messages
- Professional HTML email templates

###  **Technical Excellence**
- Built with Next.js 15 App Router
- TypeScript for type safety
- Tailwind CSS 4 for styling
- ESLint + Prettier for code quality
- Optimized performance and SEO



## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/TheBasol/portfolio-nextjs.git
cd portfolio-nextjs
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Resend Email Configuration
RESEND_API_KEY=your_resend_api_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
CONTACT_EMAIL=your_contact_email@example.com
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

##  Email Setup

The portfolio includes a functional contact form powered by [Resend](https://resend.com):

1. **Create a Resend account** at [resend.com](https://resend.com)
2. **Generate an API key** from your dashboard
3. **Add your API key** to `.env.local`
4. **Configure your contact email** where you want to receive messages

### Email Features
- ✅ Client & server-side validation
- ✅ Professional HTML email templates
- ✅ Auto-reply configuration
- ✅ Rate limiting and spam protection
- ✅ 3,000 free emails per month

##  Project Structure

```
portfolio-nextjs/
├── src/
│   ├── app/                 # Next.js 15 App Router
│   │   ├── (portfolio)/     # Portfolio pages
│   │   ├── api/contact/     # Contact form API
│   │   └── globals.css      # Global styles
│   ├── components/          # React components
│   │   ├── portfolio/       # Portfolio-specific components
│   │   │   ├── About.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Portfolio.tsx
│   │   │   └── ...
│   │   └── three/           # 3D components
│   │       ├── Wave.tsx
│   │       ├── Particles.tsx
│   │       └── ...
│   └── hooks/               # Custom React hooks
├── public/                  # Static assets
│   └── portfolio/           # Project images
├── .env.example            # Environment variables template
└── README.md              # You are here!
```

##  Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **React 19** - UI library with latest features
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework

### **3D Graphics**
- **React Three Fiber** - React renderer for Three.js
- **Three.js** - 3D graphics library
- **@react-three/drei** - Useful helpers for R3F
- **@react-three/postprocessing** - Post-processing effects

### **Backend & Services**
- **Resend** - Modern email delivery service
- **Vercel** - Deployment and hosting platform

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

##  Responsive Design

The portfolio is fully responsive and optimized for:

-  **Mobile** (320px+) - Touch-optimized navigation
-  **Tablet** (768px+) - Adapted layouts and interactions
-  **Desktop** (1024px+) - Full feature experience
-  **Large screens** (1440px+) - Enhanced visuals

##  Customization

### **Colors & Branding**
Edit `src/app/globals.css` and Tailwind config for your brand colors:

```css
:root {
  --primary: #3545d4;
  --secondary: #482ebb;
  --accent: #AAB2FF;
}
```

### **Content**
Update your information in:
- `src/components/portfolio/About.tsx` - About section
- `src/components/portfolio/Portfolio.tsx` - Projects showcase
- `src/components/portfolio/Header.tsx` - Hero section

### **3D Scene**
Customize the 3D elements in:
- `src/components/three/Wave.tsx` - Wave animation
- `src/components/three/Particles.tsx` - Particle system
- `src/components/three/SceneWave.tsx` - Main 3D scene

##  Deployment

### **Vercel (Recommended)**
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### **Other Platforms**
The portfolio can be deployed on any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- Google Cloud Platform

##  License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

##  Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - 3D graphics
- [Tailwind CSS](https://tailwindcss.com) - Styling
- [Resend](https://resend.com) - Email delivery
- [Vercel](https://vercel.com) - Hosting platform

---

Built with ❤️ by [Enrique Vazquez](https://github.com/TheBasol)
