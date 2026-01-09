import React from "react";

const faqs = [
  {
    question: "How can I purchase physical copies of Shalom's music?",
    answer:
      "Physical copies including CDs and vinyl records are available through our online store with worldwide shipping. Limited edition signed copies are also available for select releases.",
  },
  {
    question: "Are Shalom's albums available in lossless audio format?",
    answer:
      "Yes, all of Shalom's music is available in high-quality lossless formats through platforms like Bandcamp and our official website. We offer FLAC, WAV, and other audiophile-grade formats.",
  },
  {
    question: "Does Shalom offer sheet music for his compositions?",
    answer:
      "Sheet music for selected compositions is available for purchase in our online store. We offer both digital (PDF) and printed versions for musicians interested in performing Shalom's work.",
  },
  {
    question: "Can I license Shalom's music for my project?",
    answer:
      "Yes, Shalom's music is available for licensing for films, commercials, and other media projects. Please contact our management team with details about your project for licensing information.",
  },
];

export default function FAQ_Section() {
  return (
    <>
      <section className="py-16 px-4 md:px-8 bg-gradient-to-br from-blue-950 via-slate-800 to-blue-900 text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
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
                  className="border-b border-blue-500/20 pb-6 bg-slate-800/30 backdrop-blur-sm p-6 rounded-lg"
                >
                  <h3 className="text-xl font-semibold mb-3 text-blue-100">
                    {faq.question}
                  </h3>
                  <p className="text-blue-200/80">{faq.answer}</p>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
