import Link from "next/link";

const companyLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact us" },
  { href: "/privacy", label: "Privacy policy" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">

      <div className="flex flex-col md:flex-row items-start justify-center px-4 sm:px-6 md:px-10 lg:px-6 gap-8 sm:gap-10 md:gap-12 py-10 sm:py-12 md:py-14 border-b border-slate-700">

        {/* Brand */}
        <div className="md:w-2/5">
          <Link href="/" className="font-display font-bold text-2xl text-white">
            Electro<span className="text-[var(--color-brand)]">Zone</span>
          </Link>

          <p className="mt-4 sm:mt-6 text-sm text-slate-400 leading-relaxed md:pr-8 lg:pr-12">
            ElectroZone is a modern e-commerce platform offering smartphones,
            laptops, accessories and smart gadgets with fast delivery and secure checkout.
          </p>
        </div>

        {/* Company */}
        <div className="md:w-1/5">
          <h2 className="font-medium text-white mb-4 sm:mb-5">Company</h2>
          <ul className="text-sm space-y-2">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-white transition"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="md:w-1/5">
          <h2 className="font-medium text-white mb-4 sm:mb-5">Get in touch</h2>
          <div className="text-sm space-y-2 text-slate-400">
            <p>+1 (555) 123-4567</p>
            <p>support@electrozone.com</p>
          </div>
        </div>

      </div>

      <p className="py-3 sm:py-4 text-center text-xs md:text-sm text-slate-500">
        © {new Date().getFullYear()} ElectroZone. All rights reserved.
      </p>

    </footer>
  );
}
