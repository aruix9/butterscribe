import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <section className="max-w-[1440px] w-full pt-8 px-6 mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 mb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {items.map((item, index) => (
            <div key={index} className="flex items-center gap-2">
              {item.href ? (
                <Link className="hover:text-primary transition-colors" href={item.href}>
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-600">{item.label}</span>
              )}
              {index < items.length - 1 && <span className="text-slate-300">/</span>}
            </div>
          ))}
        </nav>
      </div>
    </section>
  );
}

export default Breadcrumb
