import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import Button from "../../components/common/Button";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

const ContactPage: React.FC = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Contact form:", formData);
  };

  return (
    <Layout>
      <Helmet>
        <title>{t('contact_title')}</title>
        <meta
          name="description"
          content="Reach out to us for inquiries, support, or feedback."
        />
      </Helmet>
      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-[#1A2531] py-24">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold text-white sm:text-5xl">
                {t('contact_us')}
              </h1>
              <p className="text-lg text-gray-300">
                {t('have_question')}
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#3B546A]">
                  <Mail className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t('email')}</h3>
                <p className="text-gray-600">cpromart1@gmail.com</p>
              </div>

              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#3B546A]">
                  <Phone className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t('phone')}</h3>
                <p className="text-gray-600">+237 6 74 77 25 69</p>
              </div>

              <div className="rounded-lg bg-white p-8 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#3B546A]">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{t('address')}</h3>
                <p className="text-gray-600">
                  Mile 18 Junction, Buea, South West Region, Cameroon
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="mt-20">
              <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-sm">
                <h2 className="mb-8 text-center text-2xl font-bold text-gray-900">
                  {t('send_message')}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#3B546A] focus:outline-none focus:ring-1 focus:ring-[#3B546A]"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#3B546A] focus:outline-none focus:ring-1 focus:ring-[#3B546A]"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('subject')}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#3B546A] focus:outline-none focus:ring-1 focus:ring-[#3B546A]"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      {t('message')}
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      required
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#3B546A] focus:outline-none focus:ring-1 focus:ring-[#3B546A]"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      icon={<Send size={18} />}
                    >
                      {t('send_message')}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
