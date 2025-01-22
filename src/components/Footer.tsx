import { Link } from "react-router-dom";

const Footer = () => {
  const footerSections = [
    {
      title: "Job Seekers",
      links: [
        { text: "Browse Jobs", href: "/jobs" },
        { text: "Career Advice", href: "/career-advice" },
        { text: "Search Companies", href: "/companies" },
        { text: "Salary Guide", href: "/salary" },
      ],
    },
    {
      title: "Employers",
      links: [
        { text: "Post a Job", href: "/post-job" },
        { text: "Recruiting Solutions", href: "/recruiting" },
        { text: "Pricing", href: "/pricing" },
        { text: "Resources", href: "/resources" },
      ],
    },
    {
      title: "Company",
      links: [
        { text: "About Us", href: "/about" },
        { text: "Contact", href: "/contact" },
        { text: "Blog", href: "/blog" },
        { text: "Press", href: "/press" },
      ],
    },
  ];

  return (
    <footer className="bg-zinc-50 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.text}>
                    <Link
                      to={link.href}
                      className="text-sm text-zinc-600 hover:text-primary transition-colors"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 pt-8 border-t">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-zinc-600">
              © {new Date().getFullYear()} JobBoard. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-zinc-600 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-zinc-600 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;