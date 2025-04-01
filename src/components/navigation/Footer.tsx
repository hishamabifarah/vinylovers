import Link from "next/link"
import { Instagram, X, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-black py-12">
      <div className="container text-center px-4">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
          {/* <div>
        <h3 className="text-lg font-semibold mb-4">Company</h3>
        <ul className="space-y-2">
          <li><Link href="#" className="text-gray-400 hover:text-white">About</Link></li>
        </ul>
      </div> */}
          {/* <div>
        <h3 className="text-lg font-semibold mb-4">Community</h3>
        <ul className="space-y-2">
          <li><Link href="#" className="text-gray-400 hover:text-white">Blog</Link></li>
          <li><Link href="#" className="text-gray-400 hover:text-white">Forum</Link></li>
          <li><Link href="#" className="text-gray-400 hover:text-white">Help</Link></li>
        </ul>
      </div> */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/terms-of-use" aria-label="Terms of use - Vinylovers" className="text-gray-400 hover:text-white">Terms of Use</Link></li>
              <li><Link href="/privacy-policy" aria-label="Privacy Policy - Vinylovers"  className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link href="/copyright-policy" aria-label="Copyright Policy - Vinylovers"  className="text-gray-400 hover:text-white">Copyright Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="space-x-4 flex justify-center">
              <Link aria-label="Follow Vinylovers on Instagram" target="_blank" href="https://www.instagram.com/vinyloversapp/">
                <Instagram />
              </Link>
              <Link aria-label="Follow Vinylovers on X" target="_blank" href="https://x.com/VinyloversApp">
                <Twitter />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-12 text-center text-gray-400">
          © 2025 Vinylovers Ltd. All rights reserved
        </div>
      </div>
    </footer>
  )
}