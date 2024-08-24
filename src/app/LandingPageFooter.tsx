
import React from "react";
import Image from "next/image";

const LandingPageFooter = () => {
  return (
    <footer className="bg-surface" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <Image src="/kakrola_text.svg" width={130} height={0} alt="Kakrola" />
            <p className="text-text-700 ">
              Making the world more productive, one task at a time.
            </p>
            {/* <div className="flex space-x-6">
              {["Facebook", "Twitter", "GitHub", "LinkedIn"].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="text-text-700 hover:text-text-600"
                >
                  <span className="sr-only">{social}</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              ))}
            </div> */}
          </div>
          {/* <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-text-800 tracking-wider uppercase">
                  Product
                </h3>
                <ul className="mt-4 space-y-4">
                  {[
                    "Features",
                    "Templates",
                    "Integrations",
                    "Pricing",
                    "Security",
                  ].map((item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className=" text-text-700 hover:text-text-900"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-text-800 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  {[
                    "Help Center",
                    "API Documentation",
                    "Guides",
                    "Status",
                    "Contact Us",
                  ].map((item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className=" text-text-700 hover:text-text-900"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-text-800 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  {["About", "Blog", "Careers", "Press", "Partners"].map(
                    (item) => (
                      <li key={item}>
                        <Link
                          href="#"
                          className=" text-text-700 hover:text-text-900"
                        >
                          {item}
                        </Link>
                      </li>
                    )
                  )}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-text-800 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  {[
                    "Privacy",
                    "Terms",
                    "Cookie Policy",
                    "GDPR",
                    "Accessibility",
                  ].map((item) => (
                    <li key={item}>
                      <Link
                        href="#"
                        className=" text-text-700 hover:text-text-900"
                      >
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div> */}
        </div>
        <div className="mt-12 border-t border-text-400 pt-8">
          <p className=" text-text-700 text-center sm:text-left xl:text-center">
            &copy; 2024 Kakrola, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingPageFooter;
