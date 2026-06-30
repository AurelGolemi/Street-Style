import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Street Style",
  description: "Terms of Service for Street Style",
};

const lastUpdated = "June 30, 2026";

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-2 text-3xl font-bold text-black">
          Terms of Service
        </h1>
        <p className="mb-10 text-sm text-black/60">
          Last updated: {lastUpdated}
        </p>

        <div className="space-y-10">
          <section>
            <p className="leading-relaxed text-black">
              These Terms of Service ("Terms") govern your access to and use
              of the Street Style website, including any purchases made
              through it (collectively, the "Service"). By accessing or
              using the Service, you agree to be bound by these Terms. If
              you do not agree to these Terms, please do not use the
              Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              1. Eligibility
            </h2>
            <p className="leading-relaxed text-black">
              You must be at least 18 years old, or the age of majority in
              your jurisdiction, to create an account and make purchases on
              Street Style. By using the Service, you represent and warrant
              that you meet this requirement and that all information you
              provide is accurate and complete.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              2. Account Registration
            </h2>
            <p className="leading-relaxed text-black">
              To place an order, you may need to create an account. You are
              responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under
              your account. You agree to notify us immediately of any
              unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              3. Products and Pricing
            </h2>
            <p className="leading-relaxed text-black">
              We strive to display product details, including images,
              descriptions, and pricing, as accurately as possible. However,
              we do not warrant that product descriptions, colors, or other
              content are entirely accurate, complete, or error-free. Prices
              for products are subject to change without notice. We reserve
              the right to limit quantities, refuse orders, or discontinue
              any product at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              4. Orders and Payment
            </h2>
            <p className="leading-relaxed text-black">
              By placing an order, you are making an offer to purchase the
              selected products subject to these Terms. We reserve the
              right to accept or decline your order for any reason,
              including suspected fraud, pricing errors, or unavailability
              of stock. Payment must be received and authorized in full
              before an order is processed for shipment. You agree to
              provide current, complete, and accurate purchase and account
              information for all purchases made through the Service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              5. Shipping and Delivery
            </h2>
            <p className="leading-relaxed text-black">
              Estimated shipping and delivery times provided on the Service
              are approximate and not guaranteed. Risk of loss and title for
              products purchased pass to you upon our delivery to the
              shipping carrier. We are not responsible for delays caused by
              the carrier, customs processing, or other factors outside of
              our reasonable control.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              6. Returns and Refunds
            </h2>
            <p className="leading-relaxed text-black">
              Products may be returned in accordance with our Returns
              policy, available on our FAQ page. Items must generally be
              returned within 14 days of delivery, in their original,
              unworn condition with all tags and packaging intact. Refunds
              are issued to the original payment method once the returned
              item has been received and inspected. Certain items may be
              marked as final sale and ineligible for return.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              7. Intellectual Property
            </h2>
            <p className="leading-relaxed text-black">
              All content on the Service, including text, graphics, logos,
              images, and software, is the property of Street Style or its
              licensors and is protected by copyright, trademark, and other
              intellectual property laws. You may not reproduce, distribute,
              modify, or create derivative works from any content on the
              Service without our prior written consent.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              8. Prohibited Conduct
            </h2>
            <p className="mb-3 leading-relaxed text-black">
              When using the Service, you agree not to:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-black">
              <li>Violate any applicable law or regulation.</li>
              <li>Use the Service for any fraudulent or unauthorized purpose.</li>
              <li>Attempt to gain unauthorized access to our systems or another user's account.</li>
              <li>Interfere with or disrupt the operation of the Service.</li>
              <li>Use any automated system, including bots or scrapers, to access the Service without our permission.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              9. Limitation of Liability
            </h2>
            <p className="leading-relaxed text-black">
              To the fullest extent permitted by law, Street Style and its
              affiliates shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of
              profits or revenues, arising out of or related to your use of
              the Service or any products purchased through it, even if we
              have been advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              10. Disclaimer of Warranties
            </h2>
            <p className="leading-relaxed text-black">
              The Service and all products are provided on an "as is" and
              "as available" basis, without warranties of any kind, either
              express or implied, including but not limited to implied
              warranties of merchantability, fitness for a particular
              purpose, and non-infringement.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              11. Termination
            </h2>
            <p className="leading-relaxed text-black">
              We reserve the right to suspend or terminate your account and
              access to the Service at any time, without notice, for
              conduct that we believe violates these Terms or is otherwise
              harmful to other users, us, or third parties.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              12. Changes to These Terms
            </h2>
            <p className="leading-relaxed text-black">
              We may revise these Terms at any time by updating this page.
              By continuing to access or use the Service after revisions
              become effective, you agree to be bound by the revised Terms.
              We encourage you to review these Terms periodically.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              13. Governing Law
            </h2>
            <p className="leading-relaxed text-black">
              These Terms shall be governed and construed in accordance with
              applicable local law, without regard to its conflict of law
              provisions.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              14. Contact Us
            </h2>
            <p className="leading-relaxed text-black">
              If you have any questions about these Terms, please contact us
              at <span className="font-medium">support@streetstyle.com</span>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}