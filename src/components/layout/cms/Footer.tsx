import Link from "next/link";
import { Globe, AtSign, Share2 } from "lucide-react";
import Logo from "@/components/shared/logo";

const Footer = () => {
  return (
    <footer className="bg-background-light border-t border-slate-200 py-12 mt-auto">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Logo className="mb-4 inline-block" />
            <p className="text-sm text-slate-500 leading-relaxed">
              Empowering SEO professionals with the world&apos;s most advanced link building and authority analysis tools.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-400">Product</h5>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="#" className="hover:text-primary transition-colors">Authority Audit</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Link Prospector</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">API Access</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-400">Resources</h5>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="#" className="hover:text-primary transition-colors">SEO Blog</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Case Studies</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Masterclass</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-sm mb-6 uppercase tracking-widest text-slate-400">Support</h5>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href='/terms-conditions' className="hover:text-primary transition-colors">Terms</Link></li>
              <li><Link href='/shipping-delivery' className="hover:text-primary transition-colors">Shipping</Link></li>
              <li><Link href='/privacy-policy' className="hover:text-primary transition-colors">Privacy</Link></li>
              <li><Link href='/cancellation-refund' className="hover:text-primary transition-colors">Cancellation</Link></li>
              <li><Link href="/contact-us" className="hover:text-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-slate-200">
          <p className="text-xs text-slate-400 mb-4 md:mb-0">&copy; {new Date().getFullYear()} Butterscribe SEO SaaS. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="text-slate-400 hover:text-primary transition-colors">
              <Globe className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-primary transition-colors">
              <AtSign className="w-5 h-5" />
            </Link>
            <Link href="#" className="text-slate-400 hover:text-primary transition-colors">
              <Share2 className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer
