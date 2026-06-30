import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Returns | Street Style",
  description: "Returns and exchanges policy for Street Style",
};

const lastUpdated = "June 30, 2026";

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-2 text-3xl font-bold text-black">
          Returns &amp; Exchanges
        </h1>
        <p className="mb-10 text-sm text-black/60">
          Last updated: {lastUpdated}
        </p>

        <div className="space-y-10">
          <section>
            <p className="leading-relaxed text-black">
              We want you to love what you ordered. If something isn't
              right, we make returns and exchanges as straightforward as
              possible. Please review the policy below before starting a
              return.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              1. Return Window
            </h2>
            <p className="leading-relaxed text-black">
              You may request a return within 14 days of the delivery date
              shown on your tracking confirmation. Returns requested after
              this window cannot be accepted, except where required by
              local law.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              2. Eligibility for Return
            </h2>
            <p className="mb-3 leading-relaxed text-black">
              To be eligible for a return, items must meet all of the
              following conditions:
            </p>
            <ul className="list-disc space-y-2 pl-6 text-black">
              <li>Unworn, unwashed, and in the same condition you received them.</li>
              <li>All original tags, labels, and packaging attached and intact.</li>
              <li>Free of stains, odors, makeup marks, or signs of wear.</li>
              <li>Accompanied by the original order number or proof of purchase.</li>
            </ul>
            <p className="mt-3 leading-relaxed text-black">
              Items marked "Final Sale" at checkout, underwear, swimwear,
              and accessories such as earrings are not eligible for return
              for hygiene reasons, unless defective.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              3. How to Start a Return
            </h2>
            <ol className="list-decimal space-y-2 pl-6 text-black">
              <li>
                Go to "My Orders" in your account and select the order
                containing the item you want to return.
              </li>
              <li>
                Click "Request Return" and select the item(s) and reason for
                return.
              </li>
              <li>
                Print the prepaid return label we email to you and attach it
                securely to the outside of the package.
              </li>
              <li>
                Pack the item(s) in their original packaging along with all
                tags and accessories.
              </li>
              <li>
                Drop the package off at the designated carrier location
                within 7 days of generating your label.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              4. Refunds
            </h2>
            <p className="leading-relaxed text-black">
              Once your return is received, our team will inspect the
              item(s) within 2–3 business days. If approved, your refund
              will be issued to your original payment method within 5–7
              business days. You will receive an email confirmation once
              your refund has been processed. Original shipping fees are
              non-refundable unless the return is due to our error or a
              defective item.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              5. Exchanges
            </h2>
            <p className="leading-relaxed text-black">
              Need a different size or color? Select "Exchange" instead of
              "Return" when starting your request. Once we receive your
              original item and confirm it meets our return conditions,
              we'll ship your replacement at no additional cost, subject to
              availability. If the item you want is out of stock, we'll
              issue a full refund instead.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              6. Damaged or Incorrect Items
            </h2>
            <p className="leading-relaxed text-black">
              If you receive an item that is damaged, defective, or
              different from what you ordered, please contact us within 7
              days of delivery with your order number and a photo of the
              item. We'll arrange a free return and send a replacement or
              full refund, including original shipping costs.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              7. Return Shipping Costs
            </h2>
            <p className="leading-relaxed text-black">
              Return shipping is free for domestic orders using our prepaid
              label. For international orders, a flat return shipping fee
              will be deducted from your refund unless the return is due to
              our error or a defective item.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              8. Questions About Your Return
            </h2>
            <p className="leading-relaxed text-black">
              If you have any questions about a return or exchange, visit
              our{" "}
              <a
                href="/contact-us"
                className="cursor-pointer font-medium underline underline-offset-2"
              >
                Contact Us
              </a>{" "}
              page and our support team will help you sort it out.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}