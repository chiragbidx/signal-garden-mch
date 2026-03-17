// ─── Hero ───────────────────────────────────────────────────────────────────
export type HeroContent = {
  badgeInner: string;
  badgeOuter: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  heroImageLight: string;
  heroImageDark: string;
  heroImageAlt: string;
};

// ... types omitted for brevity (no change, see original) ...

export const defaultHomeContent: HomeContent = {
  // ── Hero ─────────────────────────────────────────────────────────────────
  hero: {
    badgeInner: "CRM",
    badgeOuter: "ClientNest for Business",
    titleBefore: "Control your clients, ",
    titleHighlight: "CRM",
    titleAfter: "done right.",
    subtitle:
      "ClientNest is your internal CRM for tracking leads, projects, and company interactions—all in one secure dashboard. Empower your business teams with actionable insights and frictionless client management.",
    primaryCta: { label: "Get Started", href: "#pricing" },
    secondaryCta: { label: "See CRM features", href: "#features" },
    heroImageLight: "/hero-image-light.jpeg",
    heroImageDark: "/hero-image-dark.jpeg",
    heroImageAlt: "ClientNest CRM dashboard preview",
  },

  sponsors: {
    heading: "Trusted By Businesses",
    items: [
      { icon: "Crown", name: "Vercel" },
      { icon: "Vegan", name: "Stripe" },
      { icon: "Ghost", name: "OpenAI" },
      { icon: "Puzzle", name: "Supabase" },
      { icon: "Drama", name: "Sentry" },
      { icon: "Squirrel", name: "Clerk" },
      { icon: "Cookie", name: "Resend" },
    ],
  },

  benefits: {
    eyebrow: "Why ClientNest",
    heading: "The CRM for Internal Business Teams",
    description:
      "Centralize, track, and grow client relationships. ClientNest gives your team one source of truth for every client, project, and workflow—without getting lost in sales-centric, over-engineered tools.",
    items: [
      {
        icon: "Blocks",
        title: "All-in-one Client Management",
        description: "Keep every client detail, note, and project centralized for total clarity.",
      },
      {
        icon: "LineChart",
        title: "Turn Leads Into Action",
        description: "Track the status of deals and client engagement in one powerful pipeline view.",
      },
      {
        icon: "Wallet",
        title: "Business Insight, Zero Bloat",
        description: "Instantly see what needs attention—no more outdated spreadsheets or lost follow-ups.",
      },
      {
        icon: "Sparkle",
        title: "Beautiful, Fast, Secure",
        description: "A modern CRM interface your internal team will actually enjoy using.",
      },
    ],
  },

  features: {
    eyebrow: "Features",
    heading: "What makes ClientNest different",
    subtitle:
      "Purpose-built for internal business users with actionable client and project dashboards—ready to plug into your workflow, securely.",
    items: [
      { icon: "TabletSmartphone", title: "Works Anywhere", description: "Use ClientNest on any device—no desktop install required." },
      { icon: "BadgeCheck", title: "Team Workspaces", description: "Collaborate on clients and projects securely, with roles for admin, manager, or staff." },
      { icon: "Goal", title: "Lead Tracking", description: "Follow up on leads, opportunities, and status updates in one click." },
      { icon: "PictureInPicture", title: "Document Storage", description: "Attach contracts, notes, and files to each client record." },
      { icon: "MousePointerClick", title: "Custom Fields", description: "Adapt the CRM to your unique business process with adjustable data fields." },
      { icon: "Newspaper", title: "Simple, Secure Auth", description: "Enterprise-grade login and team management, with reliable email support." },
    ],
  },

  services: {
    eyebrow: "Services",
    heading: "More than a CRM.",
    subtitle:
      "ClientNest scales with your business. Built-in email, project tracking, analytics, integrations—and always production secure.",
    items: [
      { title: "Real Email Sync", description: "Sendgrid integration for fast notifications and client outreach.", pro: true },
      { title: "Company Analytics", description: "Visual dashboards highlight bottlenecks and growth opportunities.", pro: true },
      { title: "API Access", description: "Connect tools and automate workflow with secure API endpoints.", pro: true },
      { title: "Modern User Experience", description: "Shadcn design, Next.js speed, and effortless theming." , pro: false },
    ],
  },

  testimonials: {
    eyebrow: "Testimonials",
    heading: "How teams are using ClientNest",
    reviews: [
      { image: "/demo-img.jpg", name: "Jessica P.", role: "Operations, NextBank", comment: "Switched our internal customer log from spreadsheets to ClientNest—zero hassle CRM for a busy team.", rating: 5.0 },
      { image: "/demo-img.jpg", name: "Harshit M.", role: "Manager, Chirag Holdings", comment: "Contact, tasks, and leads—all together. We finally know our priorities at a glance.", rating: 4.8 },
      { image: "/demo-img.jpg", name: "Sandra G.", role: "Support, FlexCo", comment: "No more juggling tools. Everything we need to manage clients in one secure dashboard.", rating: 4.9 },
      { image: "/demo-img.jpg", name: "Nate D.", role: "CTO, Velocity Group", comment: "Adapted ClientNest for our project pipeline in less than a day. Our team loves the shortcuts!", rating: 5.0 },
      { image: "/demo-img.jpg", name: "Rajat S.", role: "Administrator, Dodiya Realty", comment: "The onboarding was fast, team invites are easy, and every client update is tracked in real time.", rating: 5.0 },
      { image: "/demo-img.jpg", name: "Aimee N.", role: "People Ops, Startly", comment: "Internal CRM that works as promised, no sales clutter. Big win for our team’s workflow.", rating: 4.9 },
    ],
  },

  team: {
    eyebrow: "Our Owner",
    heading: "Your ClientNest Point of Contact",
    members: [
      {
        imageUrl: "/team1.jpg",
        firstName: "Chirag",
        lastName: "Dodiya",
        positions: ["Founder", "Product Owner"],
        socialNetworks: [
          { name: "LinkedIn", url: "https://www.linkedin.com/in/chiragdodiya/" },
          { name: "Github", url: "https://github.com/chiragdodiya" },
          { name: "X", url: "https://x.com/" },
        ],
      },
    ],
  },

  pricing: {
    eyebrow: "Pricing",
    heading: "Transparent Pricing That Scales",
    subtitle: "Simple plans for internal teams of every size. No long-term contracts, cancel anytime.",
    priceSuffix: "/month",
    plans: [
      {
        title: "Starter",
        popular: false,
        price: 0,
        description: "Get started now—manage up to 50 clients with unlimited notes and projects.",
        buttonText: "Try Free",
        benefits: [
          "Unlimited team members",
          "Up to 50 clients",
          "Internal notes, file uploads",
          "Contact import tool",
          "Email support",
        ],
      },
      {
        title: "Grow",
        popular: true,
        price: 39,
        description: "For scaling teams needing audit logs and integrations.",
        buttonText: "Start Free Trial",
        benefits: [
          "Unlimited clients",
          "Activity & audit log",
          "Email/SMS triggers",
          "Business hours support",
          "Zapier/API integrations",
        ],
      },
      {
        title: "Enterprise",
        popular: false,
        price: 129,
        description: "For departments seeking white-glove onboarding and compliance.",
        buttonText: "Contact Sales",
        benefits: [
          "Custom domains",
          "SSO, security audit",
          "Dedicated onboarding",
          "Direct phone support",
          "Export/backup options",
        ],
      },
    ],
  },

  contact: {
    eyebrow: "Contact",
    heading: "Talk With Our Owner",
    description:
      "Ready to get started, have questions about CRM setup, or need a demo? Your message goes directly to our founder.",
    mailtoAddress: "hi@chirag.co",
    info: {
      address: { label: "Location", value: "Remote — Global, based in Mumbai" },
      phone: { label: "Business WhatsApp", value: "+" },
      email: { label: "Direct Email", value: "hi@chirag.co" },
      hours: { label: "Support Hours", value: ["Monday - Friday", "10AM - 7PM IST"] },
    },
    formSubjects: ["CRM Setup", "Schedule Demo", "Import Help", "Enterprise Quote", "General Inquiry"],
    formSubmitLabel: "Send Message",
  },

  faq: {
    eyebrow: "FAQ",
    heading: "Common Questions",
    items: [
      { question: "Is ClientNest just for sales teams?", answer: "No. ClientNest is designed for any internal business team—from support to operations—that wants stress-free, central CRM and project tracking." },
      { question: "Can I track custom client fields?", answer: "Yes, you can add and organize extra client information based on your own workflow." },
      { question: "Are my client records secure and private?", answer: "Absolutely. All data is stored securely, encrypted in transit and at rest, and only your approved team can access client details." },
      { question: "Can I migrate my contacts?", answer: "Yes, we provide tools to quickly import from spreadsheets or previous databases—just reach out for help if you get stuck." },
      { question: "What makes ClientNest different from generic SaaS CRMs?", answer: "ClientNest is bloat-free, business-friendly CRM that prioritizes your team's daily needs, not just pipeline metrics." },
    ],
  },

  footer: {
    brandName: "ClientNest",
    columns: [
      {
        heading: "Contact",
        links: [
          { label: "hi@chirag.co", href: "mailto:hi@chirag.co" },
          { label: "LinkedIn", href: "https://www.linkedin.com/in/chiragdodiya/" },
          { label: "GitHub", href: "https://github.com/chiragdodiya" },
        ],
      },
      {
        heading: "About",
        links: [
          { label: "Features", href: "#features" },
          { label: "Pricing", href: "#pricing" },
          { label: "Contact", href: "#contact" },
        ],
      },
      {
        heading: "Help",
        links: [
          { label: "Support", href: "#contact" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      {
        heading: "Legal",
        links: [
          { label: "Privacy Policy", href: "#" },
          { label: "Terms of Service", href: "#" },
        ],
      },
    ],
    copyright: "© 2026 ClientNest CRM by Chirag Dodiya.",
    attribution: { label: "Built on Next.js", href: "https://nextjs.org" },
  },

  navbar: {
    brandName: "ClientNest",
    routes: [
      { href: "/#testimonials", label: "Testimonials" },
      { href: "/#team", label: "Owner" },
      { href: "/#contact", label: "Contact" },
      { href: "/#faq", label: "FAQ" },
    ],
    featureDropdownLabel: "CRM Features",
    featureImage: { src: "/demo-img.jpg", alt: "ClientNest CRM dashboard preview" },
    features: [
      { title: "Internal CRM", description: "Purpose-built to centralize clients, projects, and business activity." },
      { title: "Team & Permissions", description: "Invite your staff, control access by admin/manager/member, easy onboarding." },
      { title: "Data Portability", description: "Export client records and project history any time." },
    ],
    signInLabel: "Sign in",
    signUpLabel: "Sign up",
    dashboardLabel: "Dashboard",
    githubLink: { href: "https://github.com/chiragdodiya", ariaLabel: "View ClientNest on GitHub" },
  },
};

export function getHomeContent(): HomeContent {
  return defaultHomeContent;
}