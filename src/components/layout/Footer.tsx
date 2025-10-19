import Container from '@/components/ui/Container'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white text-white py-12">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">SS</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Street Style</span>
            </Link>
            <p className="text-gray-700 max-w-md">
              Your ultimate destination for streetwear fashion. Discover the latest trends from top brands.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link href="/men" className="text-gray-700 hover:text-gray-900 transition">Men</Link></li>
              <li><Link href="/women" className="text-gray-700 hover:text-gray-900 transition">Women</Link></li>
              <li><Link href="/kids" className="text-gray-700 hover:text-gray-900 transition">Kids</Link></li>
              <li><Link href="/brands" className="text-gray-700 hover:text-gray-900 transition">Brands</Link></li>
              <li><Link href="/sales" className="text-gray-400 dark:text-slate-700 hover:text-gray-900 transition">Sales</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/contact" className="text-gray-700 hover:text-gray-900 transition">Contact Us</Link></li>
              <li><Link href="/shipping" className="text-gray-700 hover:text-gray-900 transition">Shipping Info</Link></li>
              <li><Link href="/returns" className="text-gray-700 hover:text-gray-900 transition">Returns</Link></li>
              <li><Link href="/faq" className="text-gray-700 hover:text-gray-900 transition">FAQ</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-800 text-sm">
            © 2025 Street Style. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-800 hover:text-white text-sm transition">Privacy Policy</Link>
            <Link href="/terms" className="text-gray-800 hover:text-white text-sm transition">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
