import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Copyright Policy | Vinylovers',
  description: 'Copyright Policy for Vinylovers - Your Vinyl Collection Community',
}

export default function CopyrightPolicyPage() {
  return (
    <>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Copyright Policy</h1>
        <div className="prose max-w-none">
          <b><h2>1. Respect for Intellectual Property</h2></b>
          <p>Vinylovers respects the intellectual property rights of others and expects its users to do the same. We will respond to notices of alleged copyright infringement that comply with applicable law and are properly provided to us.</p>
          <br />
          <b><h2>2. User-Generated Content</h2></b>
          <p>Users are responsible for ensuring they have the necessary rights to post any content on Vinylovers. This includes images of vinyl records, album artwork, and any other copyrighted material.</p>
          <br />
          <b><h2>3. DMCA Notices</h2></b>
          <p>If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on Vinylovers, you may notify our copyright agent in accordance with the Digital Millennium Copyright Act (DMCA).</p>
          <br />
          <b><h2>4. Counter-Notification</h2></b>
          <p>If you believe your content was removed in error, you may file a counter-notification. Please note that there are legal and financial consequences for fraudulent submissions.</p>
          <br />
          <b><h2>5. Repeat Infringers</h2></b>
          <p>Vinylovers will, in appropriate circumstances, disable and/or terminate the accounts of users who are repeat infringers.</p>
          <br />
          <b>  <h2>6. Fair Use</h2></b>
          <p>Vinylovers respects fair use principles. If you believe your use of copyrighted material falls under fair use, please provide an explanation in any counter-notification.</p>
          <br />
          <b> <h2>7. Changes to this Policy</h2></b>
          <p>We may update this Copyright Policy from time to time. We will notify you of any changes by posting the new Copyright Policy on this page.</p>
          <br />
          <b><h2>8. Contact Us</h2></b>
          <p>If you have any questions about this Copyright Policy or to report copyright infringement, please contact our designated copyright agent at: copyright@vinylovers.com</p>

        </div>
      </div>
    </>

  )
}

