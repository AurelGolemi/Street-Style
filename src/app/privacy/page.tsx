import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Street Style",
  description: "Privacy Policy for Street Style",
};

const lastUpdated = "June 30, 2026";

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-2 text-3xl font-bold text-black">Privacy Policy</h1>
        <p className="mb-10 text-sm text-black/60">
          Last updated: {lastUpdated}
        </p>

        <div className="space-y-10">
          <section>
            <p className="leading-relaxed text-black">
              Street Style ("we," "us," or "our") respects your privacy and
              is committed to protecting it through this Privacy Policy. This
              policy explains how we collect, use, disclose, and safeguard
              your information when you visit our website or make a purchase
              from us. Please read this policy carefully. If you do not
              agree with the terms of this policy, please do not access the
              site.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              1. Information We Collect
            </h2>
            <p className="mb-3 leading-relaxed text-black">
              We may collect information about you in a variety of ways. The
              information we may collect includes:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-black">
              <li>
                <span className="font-medium">Personal Data:</span> Your
                name, shipping address, billing address, email address, and
                phone number that you voluntarily give us when you create an
                account, place an order, or contact customer support.
              </li>
              <li>
                <span className="font-medium">Payment Data:</span> Payment
                details (such as card information) necessary to process your
                purchases. Payment information is collected and stored by
                our third-party payment processor, and we do not store full
                payment card numbers on our servers.
              </li>
              <li>
                <span className="font-medium">Order Data:</span> Details
                about products you have purchased, browsed, or added to your
                cart or wishlist, including size, color, and quantity
                preferences.
              </li>
              <li>
                <span className="font-medium">Device and Usage Data:</span>{" "}
                Information automatically collected when you access our
                site, such as your IP address, browser type, operating
                system, access times, and pages viewed.
              </li>
              <li>
                <span className="font-medium">Cookies and Tracking Data:</span>{" "}
                Information collected through cookies, web beacons, and
                similar tracking technologies to enhance your browsing
                experience and analyze site traffic.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              2. How We Use Your Information
            </h2>
            <p className="mb-3 leading-relaxed text-black">
              We use the information we collect to:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-black">
              <li>Process and fulfill your orders, including payment, shipping, and returns.</li>
              <li>Create and manage your account.</li>
              <li>Send you order confirmations, shipping updates, and transactional emails.</li>
              <li>Respond to customer service requests and support needs.</li>
              <li>Send promotional communications, where you have opted in to receive them.</li>
              <li>Improve our website, products, and overall shopping experience.</li>
              <li>Detect, prevent, and address fraud, security issues, or technical problems.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              3. Sharing Your Information
            </h2>
            <p className="mb-3 leading-relaxed text-black">
              We do not sell your personal information. We may share
              information we have collected about you in certain situations,
              including with:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-black">
              <li>
                <span className="font-medium">Service Providers:</span>{" "}
                Third parties that perform services on our behalf, such as
                payment processing, order fulfillment, shipping and
                logistics, email delivery, and hosting services.
              </li>
              <li>
                <span className="font-medium">Legal Obligations:</span> If
                required to do so by law or in response to valid requests by
                public authorities.
              </li>
              <li>
                <span className="font-medium">Business Transfers:</span> In
                connection with, or during negotiations of, any merger, sale
                of company assets, financing, or acquisition of all or a
                portion of our business.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              4. Cookies
            </h2>
            <p className="leading-relaxed text-black">
              We use cookies and similar tracking technologies to track
              activity on our site and store certain information. Cookies
              help us remember your cart contents, preferences, and login
              status, and allow us to analyze how our site is used so we can
              improve it. You can instruct your browser to refuse all
              cookies or to indicate when a cookie is being sent, though
              some parts of our site may not function properly without
              cookies.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              5. Data Retention
            </h2>
            <p className="leading-relaxed text-black">
              We retain your personal information only for as long as is
              necessary for the purposes set out in this Privacy Policy,
              including for the purposes of satisfying any legal,
              accounting, or reporting requirements, such as records related
              to order history, returns, and tax obligations.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              6. Data Security
            </h2>
            <p className="leading-relaxed text-black">
              We use administrative, technical, and physical security
              measures designed to help protect your personal information.
              While we have taken reasonable steps to secure the personal
              information you provide to us, please be aware that no method
              of transmission over the internet or method of electronic
              storage is 100% secure, and we cannot guarantee absolute
              security.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              7. Your Privacy Rights
            </h2>
            <p className="mb-3 leading-relaxed text-black">
              Depending on your location, you may have certain rights
              regarding your personal information, including the right to:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-black">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate or incomplete data.</li>
              <li>Request deletion of your personal information.</li>
              <li>Object to or restrict certain processing of your data.</li>
              <li>Withdraw consent to marketing communications at any time.</li>
            </ul>
            <p className="mt-3 leading-relaxed text-black">
              To exercise any of these rights, please contact us using the
              details below.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              8. Children's Privacy
            </h2>
            <p className="leading-relaxed text-black">
              Our site is not directed to individuals under the age of 16,
              and we do not knowingly collect personal information from
              children. If we become aware that we have collected personal
              data from a child without verification of parental consent, we
              will take steps to remove that information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              9. Changes to This Privacy Policy
            </h2>
            <p className="leading-relaxed text-black">
              We may update this Privacy Policy from time to time. The
              updated version will be indicated by a revised "Last updated"
              date, and the updated version will be effective as soon as it
              is accessible. We encourage you to review this Privacy Policy
              periodically.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              10. Contact Us
            </h2>
            <p className="leading-relaxed text-black">
              If you have questions or comments about this Privacy Policy,
              please contact us at{" "}
              <span className="font-medium">support@streetstyle.com</span>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}