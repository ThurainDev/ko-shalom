import React from "react";

const faqs = [
  {
    id: 1,
    question: "How can I book Shalom for a performance?",
    answer:
      "You can use the booking request form above or contact our management team directly. Please provide details about your event, including date, location, and type of performance required.",
  },
  {
    id: 2,
    question: "Does Shalom offer music lessons or workshops?",
    answer:
      "Yes, Shalom offers both private lessons and group workshops on various instruments and composition techniques. Please contact us with your specific interests for more information.",
  },
  {
    id: 3,
    question: "Is Shalom available for interviews or media appearances?",
    answer:
      "Yes, for press inquiries, please use the contact form above and select 'Press Inquiry' or reach out to our management team directly.",
  },
  {
    id: 4,
    question:
      "How can I get updates about new music releases and upcoming events?",
    answer:
      "You can follow Ko on social media platforms or sign up for our newsletter to receive regular updates about new releases, performances, and other news.",
  },
];

export default function FAQ_Section() {
  return (
    <>
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-slate-900 via-blue-900/50 to-slate-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-200 via-white to-blue-200 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-transparent via-blue-400 to-transparent mx-auto"></div>
          </div>

          <div className="space-y-6">
            {faqs.length &&
              faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-blue-500/30 pb-6 bg-slate-800/20 backdrop-blur-sm p-6 rounded-lg hover:bg-slate-800/30 transition-all duration-300"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  <h3 className="text-xl font-semibold mb-3 text-blue-200">
                    {faq.question}
                  </h3>
                  <p className="text-blue-300/80">{faq.answer}</p>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
