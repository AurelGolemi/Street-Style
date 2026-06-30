"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, MapPin, Phone, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  orderNumber: z.string().optional(),
  topic: z.enum(["order", "returns", "shipping", "product", "other"], {
    message: "Please select a topic.",
  }),
  message: z
    .string()
    .min(10, "Please provide a bit more detail (at least 10 characters)."),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const topicOptions: { value: ContactFormValues["topic"]; label: string }[] = [
  { value: "order", label: "Order Status" },
  { value: "returns", label: "Returns & Exchanges" },
  { value: "shipping", label: "Shipping" },
  { value: "product", label: "Product Question" },
  { value: "other", label: "Other" },
];

export default function ContactUsPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      orderNumber: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    // Replace with your actual API route / Resend or Supabase call.
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Contact form submitted:", values);
    setSubmitted(true);
    reset();
  };

  return (
    <main className="min-h-screen bg-white text-black">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="mb-2 text-3xl font-bold text-black">Contact Us</h1>
        <p className="mb-10 leading-relaxed text-black/70">
          Have a question about an order, return, or product? Fill out the
          form below and our team will get back to you within 1–2 business
          days.
        </p>

        <div className="mb-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-black" />
            <div>
              <p className="text-sm font-medium text-black">Email</p>
              <p className="text-sm text-black/70">support@streetstyle.com</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-5 w-5 shrink-0 text-black" />
            <div>
              <p className="text-sm font-medium text-black">Phone</p>
              <p className="text-sm text-black/70">+30 210 000 0000</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-black" />
            <div>
              <p className="text-sm font-medium text-black">Location</p>
              <p className="text-sm text-black/70">Athens, Greece</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {submitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-start gap-3 rounded-lg border border-black p-6"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-black" />
                <p className="text-lg font-semibold text-black">
                  Message sent
                </p>
              </div>
              <p className="leading-relaxed text-black/70">
                Thanks for reaching out. Our team will reply to your email
                within 1–2 business days.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="cursor-pointer rounded-md border border-black px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-black hover:text-white"
              >
                Send another message
              </button>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-6"
            >
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-medium text-black"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    {...register("name")}
                    className="w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
                    placeholder="Jane Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-black/70">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-black"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register("email")}
                    className="w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
                    placeholder="jane@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-black/70">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="orderNumber"
                    className="mb-1.5 block text-sm font-medium text-black"
                  >
                    Order Number{" "}
                    <span className="font-normal text-black/50">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="orderNumber"
                    type="text"
                    {...register("orderNumber")}
                    className="w-full rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
                    placeholder="#SS-10293"
                  />
                </div>

                <div>
                  <label
                    htmlFor="topic"
                    className="mb-1.5 block text-sm font-medium text-black"
                  >
                    Topic
                  </label>
                  <select
                    id="topic"
                    {...register("topic")}
                    defaultValue=""
                    className="w-full cursor-pointer rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="" disabled>
                      Select a topic
                    </option>
                    {topicOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.topic && (
                    <p className="mt-1 text-sm text-black/70">
                      {errors.topic.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-medium text-black"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  {...register("message")}
                  className="w-full resize-none rounded-md border border-black bg-white px-3 py-2 text-black outline-none focus:ring-2 focus:ring-black"
                  placeholder="Tell us how we can help..."
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-black/70">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}