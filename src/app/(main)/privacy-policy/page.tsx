import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Vinylovers',
  description: 'Privacy Policy for Vinylovers - Your Vinyl Collection Community',
}

export default function PrivacyPolicyPage() {
  return (
    <>
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="prose max-w-none">
        <b><h2>1. Information We Collect</h2></b>
        <p>We collect information you provide directly to us, such as when you create or modify your account, request services, contact customer support, or otherwise communicate with us.</p>
        <br/>
        <b><h2>2. How We Use Your Information</h2></b>
        <p>We use the information we collect to provide, maintain, and improve our services, to develop new ones, and to protect Vinylovers and our users.</p>
        <br/>
        <b><h2>3. Sharing of Information</h2></b>
        <p>We may share the information we collect with third parties as required by law, to protect our rights, or with your consent.</p>
        <br/>
        <b><h2>4. Data Retention</h2></b>
        <p>We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy.</p>
        <br/>
        <b><h2>5. Security</h2></b>
        <p>We use reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.</p>
        <br/>
        <b><h2>6. Your Rights</h2></b>
        <p>You have the right to access, correct, or delete your personal information. You may also have the right to object to or restrict certain types of processing.</p>
        <br/>
        <b> <h2>7. Changes to this Policy</h2></b>
        <p>We may change this Privacy Policy from time to time. If we make changes, we will notify you by revising the date at the top of the policy.</p>
        <br/>
        <b><h2>8. Contact Us</h2></b>
        <p>If you have any questions about this Privacy Policy, please contact us at: <a aria-label='contact@vinylovers.net - contact email' href="mailto:contact@vinylovers.net">contact@vinylovers.net</a></p>
      </div>
    </div>
    </>
  )
}

