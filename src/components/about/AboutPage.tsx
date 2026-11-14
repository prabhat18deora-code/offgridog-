import React, { useEffect } from 'react';
import { ArrowRight, Compass, Shield, Feather, Sparkles, Mail, Phone, MapPin, HelpCircle } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export function AboutPage() {
  const { navigateTo, currentSlug, setPolicyModal } = useStore();

  useEffect(() => {
    if (currentSlug) {
      const el = document.getElementById(currentSlug);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, [currentSlug]);

  return (
    <div className="min-h-screen bg-[#F2EFE7] py-12 lg:py-20 text-[#20211E]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header Hero & Story */}
        <section id="story" className="text-center space-y-4 pt-4">
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#777B5A]">The Manifesto</span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase font-brand-display text-[#20211E] tracking-tight">
            Outside the ordinary.
            <br />
            Beyond the grid.
          </h1>
          <p className="text-base sm:text-lg text-[#A6A49C] max-w-xl mx-auto leading-relaxed pt-2">
            OffGrid OG was built to solve a modern dilemma: why should understated clothing feel disposable,
            and why should premium garments feel fussy?
          </p>

          {/* Official Brand Statement */}
          <div className="mt-8 p-6 sm:p-8 bg-white border border-[#353630/20] rounded-xs shadow-xs max-w-2xl mx-auto">
            <p className="text-sm sm:text-base italic text-[#20211E] font-medium leading-relaxed">
              &ldquo;OffGrid OG is built for those who define their own path. We create everyday essentials with a focus on individuality, comfort, and timeless style.&rdquo;
            </p>
            <span className="block mt-3 text-[11px] font-bold uppercase tracking-widest text-[#777B5A]">
              &mdash; OffGrid OG Design Ethos
            </span>
          </div>
        </section>

        {/* Editorial Story Image */}
        <div className="aspect-[16/9] w-full rounded-sm overflow-hidden border border-[#353630/20] bg-[#D6C7AE]">
          <img
            src="/src/assets/images/hero_find_your_way_1792064208834.jpg"
            alt="OffGrid OG Editorial Story"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* 3 Core Principles / Philosophy */}
        <section id="philosophy" className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#777B5A]">Our Philosophy</span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase font-brand-display text-[#20211E]">
              Built for Enduring Composure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            <div className="space-y-3 p-5 bg-white border border-[#353630/20] rounded-xs shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#D6C7AE] text-[#777B5A] flex items-center justify-center">
                <Feather size={20} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#20211E]">01. Considered Weights</h3>
              <p className="text-xs text-[#A6A49C] leading-relaxed">
                We engineer with 240+ GSM combed cottons, heavyweight French terry, and dense selvedge weaves that hold their shape across years of wear.
              </p>
            </div>

            <div className="space-y-3 p-5 bg-white border border-[#353630/20] rounded-xs shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#D6C7AE] text-[#777B5A] flex items-center justify-center">
                <Compass size={20} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#20211E]">02. Modular Wardrobe</h3>
              <p className="text-xs text-[#A6A49C] leading-relaxed">
                Every tone—from warm ivory to earthy olive, sand, and charcoal—is calibrated to seamlessly interlock, eliminating morning hesitation.
              </p>
            </div>

            <div className="space-y-3 p-5 bg-white border border-[#353630/20] rounded-xs shadow-xs">
              <div className="w-10 h-10 rounded-full bg-[#D6C7AE] text-[#777B5A] flex items-center justify-center">
                <Shield size={20} />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#20211E]">03. Tailored in India</h3>
              <p className="text-xs text-[#A6A49C] leading-relaxed">
                Crafted in collaboration with artisanal textile mills across Gujarat and Tamil Nadu with honest fair-wage standards and rigorous quality control.
              </p>
            </div>
          </div>
        </section>

        {/* Brand Information Section */}
        <section id="brand" className="p-8 sm:p-10 bg-white rounded-sm border border-[#353630/20] space-y-4 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#777B5A]">About OffGrid OG</span>
          <h2 className="text-2xl font-bold uppercase font-brand-display text-[#20211E]">NOT HERE TO FIT IN.</h2>
          <p className="text-xs sm:text-sm text-[#A6A49C] leading-relaxed">
            Style should never be dictated by the algorithm of the week. At OffGrid OG, our garments don&apos;t scream for
            attention with loud logos or fake rarity. Instead, they earn respect through the texture of the cloth,
            the drape of the forward pleat, and the confidence of a silhouette that stays true to who you are.
          </p>
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigateTo('shop', 'men')}
              className="px-6 py-3 bg-[#20211E] text-white text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-[#777B5A] transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Men&apos;s</span>
              <ArrowRight size={14} />
            </button>
            <button
              type="button"
              onClick={() => navigateTo('women')}
              className="px-6 py-3 bg-white border border-[#20211E] text-[#20211E] text-xs font-bold uppercase tracking-wider rounded-xs hover:bg-[#F2EFE7] transition-colors inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Explore Women&apos;s</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </section>

        {/* Contact Support Section */}
        <section id="contact" className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#777B5A]">Concierge Service</span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase font-brand-display text-[#20211E]">
              Contact Client Support
            </h2>
            <p className="text-xs sm:text-sm text-[#A6A49C] max-w-md mx-auto">
              Questions regarding sizing, orders, or private drops? Our Mumbai team is here to assist.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-white border border-[#353630/20] rounded-xs shadow-xs space-y-2">
              <Mail size={18} className="text-[#777B5A]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#20211E]">Email Inquiries</h3>
              <a href="mailto:support@offgridog.in" className="text-xs font-bold text-[#20211E] hover:underline block">
                support@offgridog.in
              </a>
              <p className="text-[11px] text-[#A6A49C]">Direct reply within 24 business hours</p>
            </div>

            <div className="p-6 bg-white border border-[#353630/20] rounded-xs shadow-xs space-y-2">
              <Phone size={18} className="text-[#777B5A]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#20211E]">Direct Line</h3>
              <a href="tel:+919876543210" className="text-xs font-bold text-[#20211E] hover:underline block">
                +91 98765 43210
              </a>
              <p className="text-[11px] text-[#A6A49C]">Mon – Sat, 10:00 AM – 7:00 PM IST</p>
            </div>

            <div className="p-6 bg-white border border-[#353630/20] rounded-xs shadow-xs space-y-2">
              <MapPin size={18} className="text-[#777B5A]" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#20211E]">Studio HQ</h3>
              <p className="text-xs font-semibold text-[#20211E]">
                402, Sunset Boulevard, Bandra West
              </p>
              <p className="text-[11px] text-[#A6A49C]">Mumbai, Maharashtra 400050, India</p>
            </div>
          </div>
        </section>

        {/* FAQs Section */}
        <section id="faq" className="space-y-6 pt-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#777B5A]">Knowledge Base</span>
            <h2 className="text-2xl sm:text-3xl font-bold uppercase font-brand-display text-[#20211E]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'How long does domestic shipping take across India?',
                a: 'Orders dispatched from our Mumbai studio take 2–4 business days for major metropolitan areas (Mumbai, Delhi NCR, Bangalore, Pune, Hyderabad, Chennai) and 4–6 business days for regional PIN codes across India.',
              },
              {
                q: 'What are the free shipping requirements?',
                a: 'All domestic orders above ₹1,999 qualify for complimentary express courier delivery automatically. Orders under ₹1,999 carry a flat ₹149 standard courier fee.',
              },
              {
                q: 'What is your return and size exchange policy?',
                a: 'We offer a 7-day unconditional return and exchange window from the recorded doorstep delivery date. Our courier coordinates reverse pickup directly from your address.',
              },
              {
                q: 'How do I know which size to select?',
                a: 'Refer to our interactive Size & Fit Guide for precise chest, shoulder, waist, and inseam measurements for each silhouette.',
                action: () => setPolicyModal('sizeguide'),
                actionText: 'View Size Guide',
              },
              {
                q: 'Which payment methods are accepted at checkout?',
                a: 'We accept UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit Cards, NetBanking via secure Razorpay checkout, as well as Cash on Delivery (COD) for eligible domestic PIN codes.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="p-5 bg-white border border-[#353630/20] rounded-xs shadow-xs space-y-1.5">
                <h4 className="text-xs font-bold text-[#20211E] uppercase tracking-wide flex items-center gap-2">
                  <span className="text-[#777B5A]">Q.</span>
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-[#A6A49C] leading-relaxed pl-5">
                  {faq.a}
                </p>
                {faq.action && (
                  <div className="pl-5 pt-1">
                    <button
                      type="button"
                      onClick={faq.action}
                      className="text-xs font-bold text-[#777B5A] hover:underline cursor-pointer"
                    >
                      {faq.actionText} &rarr;
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
