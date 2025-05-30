import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Use | Vinylovers',
  description: 'Terms of Use for Vinylovers - Your Vinyl Collection Community',
}

export default function TermsOfUsePage() {
  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>
      <div className="prose max-w-none">
        <b><h2>1. Acceptance of Terms</h2></b>
        <p>By accessing and using Vinylovers, you accept and agree to be bound by the terms and provision of this agreement.</p>
        <br/>
        <b><h2>2. Description of Service</h2></b>
        <p>Vinylovers is a platform that allows users to share images of their vinyl collections, discover new music, and connect with other vinyl enthusiasts.</p>
        <br/>
        <b><h2>3. User Conduct</h2></b>
        <p>You agree to use Vinylovers only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else&apos;s use and enjoyment of the website.</p>
        <br/>
        <b> <h2>4. User Content</h2></b>
        <p>You are solely responsible for the content that you publish or display on Vinylovers, or transmit to other users.</p>
        <br/>
        <b><h2>5. Intellectual Property</h2></b>
        <p>The content on Vinylovers, except all User Content, including without limitation, the text, software, scripts, graphics, photos, sounds, music, videos, interactive features and the like and the trademarks, service marks and logos contained therein, are owned by or licensed to Vinylovers.</p>
        <br/>
        <b><h2>6. Limitation of Liability</h2></b>
        <p>Vinylovers shall not be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service.</p>
        <br/>
        <b><h2>7. Changes to Terms</h2></b>
        <p>Vinylovers reserves the right to modify or replace these Terms at any time. It is your responsibility to check the Terms periodically for changes.</p>
        <br/>
        <b><h2>8. Contact</h2></b>
        <p>If you have any questions about these Terms, please contact us at: <a aria-label='contact@vinylovers.net - contact email' href="mailto:contact@vinylovers.net">contact@vinylovers.net</a></p>
      </div>
    </div>
    </>
  )
}

