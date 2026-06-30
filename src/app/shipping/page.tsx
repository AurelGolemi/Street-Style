import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Info | Street Style",
  description: "Shipping information for Street Style",
};

const lastUpdated = "June 30, 2026";

type ShippingOption = {
  method: string;
  estimate: string;
  cost: string;
};

const domesticOptions: ShippingOption[] = [
  { method: "Standard Shipping", estimate: "3–5 business days", cost: "€4.99 (free over €60)" },
  { method: "Express Shipping", estimate: "1–2 business days", cost: "€9.99" },
  { method: "Same-Day Pickup", estimate: "Same day, select locations", cost: "Free" },
];

const internationalOptions: ShippingOption[] = [
  { method: "Standard International", estimate: "7–14 business days", cost: "€14.99" },
  { method: "Express International", estimate: "3–6 business days", cost: "€24.99" },
];

export default function ShippingInfoPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-2 text-3xl font-bold text-black">Shipping Info</h1>
        <p className="mb-10 text-sm text-black/60">
          Last updated: {lastUpdated}
        </p>

        <div className="space-y-10">
          <section>
            <p className="leading-relaxed text-black">
              We want your Street Style order to reach you as quickly and
              reliably as possible. Below you'll find everything you need
              to know about processing times, shipping methods, costs, and
              how to track your package once it's on its way.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              1. Order Processing Time
            </h2>
            <p className="leading-relaxed text-black">
              Orders are processed and prepared for shipment within 1–2
              business days of payment confirmation. Orders placed on
              weekends or public holidays will begin processing on the next
              business day. During high-demand periods (such as new
              releases or sales), processing may take up to 3 business days.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              2. Domestic Shipping
            </h2>
            <p className="mb-4 leading-relaxed text-black">
              The following options are available for orders shipped within
              the country:
            </p>
            <div className="overflow-hidden rounded-lg border border-black">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-black bg-black/5">
                    <th className="px-4 py-3 text-sm font-semibold text-black">
                      Method
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-black">
                      Estimated Delivery
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-black">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {domesticOptions.map((option, index) => (
                    <tr
                      key={option.method}
                      className={
                        index !== domesticOptions.length - 1
                          ? "border-b border-black/20"
                          : ""
                      }
                    >
                      <td className="px-4 py-3 text-sm text-black">
                        {option.method}
                      </td>
                      <td className="px-4 py-3 text-sm text-black">
                        {option.estimate}
                      </td>
                      <td className="px-4 py-3 text-sm text-black">
                        {option.cost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              3. International Shipping
            </h2>
            <p className="mb-4 leading-relaxed text-black">
              We currently ship to a wide range of countries worldwide. The
              following options are available for international orders:
            </p>
            <div className="overflow-hidden rounded-lg border border-black">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-black bg-black/5">
                    <th className="px-4 py-3 text-sm font-semibold text-black">
                      Method
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-black">
                      Estimated Delivery
                    </th>
                    <th className="px-4 py-3 text-sm font-semibold text-black">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {internationalOptions.map((option, index) => (
                    <tr
                      key={option.method}
                      className={
                        index !== internationalOptions.length - 1
                          ? "border-b border-black/20"
                          : ""
                      }
                    >
                      <td className="px-4 py-3 text-sm text-black">
                        {option.method}
                      </td>
                      <td className="px-4 py-3 text-sm text-black">
                        {option.estimate}
                      </td>
                      <td className="px-4 py-3 text-sm text-black">
                        {option.cost}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 leading-relaxed text-black">
              Please note that international orders may be subject to
              customs duties, import taxes, and fees levied by the
              destination country. These charges are the responsibility of
              the customer and are not included in the shipping cost or
              product price at checkout.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              4. Order Tracking
            </h2>
            <p className="leading-relaxed text-black">
              Once your order has shipped, you will receive a shipping
              confirmation email containing your tracking number and a link
              to track your package. You can also view tracking information
              at any time from the "My Orders" section of your account.
              Please allow up to 24 hours for tracking information to
              update after you receive your confirmation email.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              5. Delayed or Missing Packages
            </h2>
            <p className="leading-relaxed text-black">
              If your package has not arrived within the estimated delivery
              window, please check your tracking link first for the latest
              carrier updates. If your tracking has not updated in more than
              5 business days, or your package is marked as delivered but
              you have not received it, please contact our support team so
              we can investigate and assist you.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              6. Address Accuracy
            </h2>
            <p className="leading-relaxed text-black">
              Please double-check your shipping address before completing
              checkout. We are not responsible for orders shipped to an
              incorrect address provided by the customer. If you notice an
              error immediately after placing your order, contact us as
              soon as possible — we can only update the address before the
              order has shipped.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-black">
              7. Need Help?
            </h2>
            <p className="leading-relaxed text-black">
              If you have any questions about your shipment, visit our{" "}
              <a
                href="/contact-us"
                className="cursor-pointer font-medium underline underline-offset-2"
              >
                Contact Us
              </a>{" "}
              page and our team will be happy to help.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}