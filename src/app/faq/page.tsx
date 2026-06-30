"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type FAQItem = {
  question: string;
  answer: string[];
};

const faqs: FAQItem[] = [
  {
    question: "How do I return a product?",
    answer: [
      "1. Go to 'My Orders' in your account and select the order containing the item you want to return.",
      "2. Click 'Request Return' and choose a reason for the return (wrong size, damaged item, changed mind, etc.).",
      "3. Pack the item securely in its original packaging, including any tags, manuals, or accessories that came with it.",
      "4. Print the prepaid return label we email you and attach it to the outside of the package.",
      "5. Drop the package off at the designated carrier within 14 days of receiving your order.",
      "6. Once we receive and inspect the item, your refund will be processed to your original payment method within 5–7 business days.",
    ],
  },
  {
    question: "How do I buy a product?",
    answer: [
      "1. Browse our catalog and select the item you want, choosing the correct size, color, or variant.",
      "2. Click 'Add to Cart', then go to your cart to review your selections and quantities.",
      "3. Click 'Checkout' and enter or confirm your shipping address.",
      "4. Choose a payment method (credit/debit card, PayPal, or other supported option) and enter your payment details.",
      "5. Review your order summary, including taxes and shipping costs, then click 'Place Order' to confirm your purchase.",
      "6. You will receive an order confirmation email with your order number and estimated delivery date.",
    ],
  },
  {
    question: "What do I need to do after purchasing for the transfer to complete successfully?",
    answer: [
      "1. Check your email inbox (and spam folder) for the payment confirmation message we send immediately after checkout.",
      "2. Make sure your payment has been fully authorized by your bank or payment provider — this can sometimes take a few minutes.",
      "3. If asked, complete any additional verification step required by your bank (such as 3D Secure or a one-time code) to confirm the transaction.",
      "4. Once payment is confirmed, you will receive a second email confirming your order has been processed and is being prepared for shipment.",
      "5. Track your order status at any time from the 'My Orders' section of your account.",
      "6. If you do not receive a confirmation email within 30 minutes of purchase, contact our support team so we can verify the transfer and ensure your product is shipped.",
    ],
  },
];

function FAQAccordionItem({ item }: { item: FAQItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-black">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-lg font-medium text-black">{item.question}</span>
        <ChevronDown
          className={`ml-4 h-5 w-5 shrink-0 text-black transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-5 pr-8">
              <ol className="space-y-2 text-base leading-relaxed text-black">
                {item.answer.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-2 text-3xl font-bold text-black">
          Frequently Asked Questions
        </h1>
        <p className="mb-10 text-black/70">
          Everything you need to know about buying, returning, and completing
          your purchase.
        </p>

        <div className="border-t border-black">
          {faqs.map((item) => (
            <FAQAccordionItem key={item.question} item={item} />
          ))}
        </div>

        <p className="mt-10 text-sm text-black/60">
          Still have questions? Contact our support team and we&apos;ll be
          happy to help.
        </p>
      </div>
    </main>
  );
}