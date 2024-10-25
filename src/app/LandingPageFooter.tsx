import React from "react";
import Link from "next/link";
import { Twitter, Github, Linkedin, LucideProps } from "lucide-react";
import KakrolaLogo from "./kakrolaLogo";

const footerLinks = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Solutions", href: "/solutions" },
    { label: "Pricing", href: "/pricing" },
    { label: "Security", href: "/security" },
    { label: "What's New", href: "/updates" },
  ],
  resources: [
    // { label: "Documentation", href: "/docs" },
    // { label: "API Reference", href: "/api" },
    { label: "Community", href: "/community" },
    { label: "Templates", href: "/templates" },
    // { label: "Training", href: "/training" },
    // { label: "Success Stories", href: "/case-studies" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    // { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    // { label: "Press Kit", href: "/press" },
    // { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
    { label: "Cookie Settings", href: "/cookies" },
    { label: "Status", href: "/status" },
  ],
};

const socialLinks: {
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  href: string;
  label: string;
}[] = [
  // {
  //   icon: Twitter,
  //   href: "https://twitter.com/kakrola",
  //   label: "Follow us on Twitter",
  // },
  // {
  //   icon: Github,
  //   href: "https://github.com/kakrola",
  //   label: "Star us on GitHub",
  // },
  // {
  //   icon: Linkedin,
  //   href: "https://linkedin.com/company/kakrola",
  //   label: "Connect on LinkedIn",
  // },
];

const LandingPageFooter = () => {
  return (
    <>
      <footer className="bg-white border-t border-gray-50">
        <div className="wrapper py-16 lg:py-24">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-4">
              <div className="space-y-6">
                <KakrolaLogo size="lg" isTitle />
                <p className="text-gray-600 leading-relaxed">
                  Remember when work felt organized and actually got done? We're
                  bringing that back. Join thousands of teams who got their time
                  back.
                </p>
                <div className="flex items-center space-x-5">
                  {socialLinks.map((social) => (
                    <Link
                      key={social.label}
                      href={social.href}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" strokeWidth={1.5} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase mb-4">
                  Product
                </h3>
                <ul className="space-y-3">
                  {footerLinks.product.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-gray-500 hover:text-primary-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase mb-4">
                  Resources
                </h3>
                <ul className="space-y-3">
                  {footerLinks.resources.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-gray-500 hover:text-primary-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase mb-4">
                  Company
                </h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-gray-500 hover:text-primary-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wide uppercase mb-4">
                  Legal
                </h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-gray-500 hover:text-primary-600 transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-gray-50">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Kakrola, Inc. All rights reserved.
              </p>
              {/* <Link
                href="/careers"
                className="text-gray-500 hover:text-primary-600 text-sm transition-colors"
              >
                We're hiring!
              </Link> */}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingPageFooter;
