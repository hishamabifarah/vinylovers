import Link from "next/link"

export default function Footer() {
    return(
<footer className="bg-black py-12">
  <div className="container mx-auto px-4">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Company</h3>
        <ul className="space-y-2">
          <li><Link href="#" className="text-gray-400 hover:text-white">About</Link></li>
          <li><Link href="#" className="text-gray-400 hover:text-white">Jobs</Link></li>
          <li><Link href="#" className="text-gray-400 hover:text-white">Press</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Community</h3>
        <ul className="space-y-2">
          <li><Link href="#" className="text-gray-400 hover:text-white">Blog</Link></li>
          <li><Link href="#" className="text-gray-400 hover:text-white">Forum</Link></li>
          <li><Link href="#" className="text-gray-400 hover:text-white">Help</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Legal</h3>
        <ul className="space-y-2">
          <li><Link href="/terms-of-use" className="text-gray-400 hover:text-white">Terms of Use</Link></li>
          <li><Link href="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
          <li><Link href="/copyright-policy" className="text-gray-400 hover:text-white">Copyright Policy</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
        <div className="flex space-x-4">
          {/* Add social media icons here */}
        </div>
      </div>
    </div>
    <div className="mt-12 text-center text-gray-400">
      © 2024 Vinylovers Ltd. All rights reserved
    </div>
  </div>
</footer>
    )
}

