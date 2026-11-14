import React from 'react';
import { X, Ruler, Truck, RotateCcw, Shield, FileText, HelpCircle, Mail } from 'lucide-react';
import { useStore } from '../../context/StoreContext.tsx';

export function PolicyModals() {
  const { policyModal, setPolicyModal, sizeGuideOpen, setSizeGuideOpen } = useStore();

  const activeModal = policyModal || (sizeGuideOpen ? 'sizeguide' : null);

  if (!activeModal) return null;

  const handleClose = () => {
    setPolicyModal(null);
    setSizeGuideOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" onClick={handleClose} />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-[#F2EFE7] rounded-sm border border-[#353630/20] shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto space-y-6 z-10">
        <div className="flex items-center justify-between border-b border-[#353630/20] pb-4">
          <div className="flex items-center gap-2">
            {activeModal === 'sizeguide' && <Ruler size={18} className="text-[#777B5A]" />}
            {activeModal === 'shipping' && <Truck size={18} className="text-[#777B5A]" />}
            {activeModal === 'returns' && <RotateCcw size={18} className="text-[#777B5A]" />}
            {activeModal === 'privacy' && <Shield size={18} className="text-[#777B5A]" />}
            {activeModal === 'terms' && <FileText size={18} className="text-[#777B5A]" />}
            {activeModal === 'faq' && <HelpCircle size={18} className="text-[#777B5A]" />}
            {activeModal === 'contact' && <Mail size={18} className="text-[#777B5A]" />}

            <h2 className="text-sm font-bold uppercase tracking-wider text-[#20211E]">
              {activeModal === 'sizeguide' && 'OffGrid Standard Size & Fit Guide'}
              {activeModal === 'shipping' && 'Shipping & Doorstep Delivery Policy'}
              {activeModal === 'returns' && '7-Day Return & Exchange Guidelines'}
              {activeModal === 'privacy' && 'Customer Privacy & Data Protection'}
              {activeModal === 'terms' && 'Terms of Service & Conditions'}
              {activeModal === 'faq' && 'Frequently Asked Questions (FAQs)'}
              {activeModal === 'contact' && 'Contact OffGrid OG Client Support'}
            </h2>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="p-1 text-gray-500 hover:text-[#20211E] rounded-full hover:bg-[#D6C7AE]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="text-xs text-[#A6A49C] leading-relaxed space-y-4">
          {activeModal === 'sizeguide' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-[#20211E] uppercase text-xs mb-2">Tops &amp; Outerwear (Chest / Length in Inches)</h3>
                <div className="border border-[#353630/20] overflow-x-auto rounded-xs">
                  <table className="w-full text-left">
                    <thead className="bg-[#D6C7AE]/60 font-bold text-[#20211E]">
                      <tr>
                        <th className="p-2.5">Size</th>
                        <th className="p-2.5">Chest (Inches)</th>
                        <th className="p-2.5">Length (Inches)</th>
                        <th className="p-2.5">Shoulder (Inches)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#353630/20]">
                      <tr><td className="p-2 font-bold text-[#20211E]">XS</td><td className="p-2">38"</td><td className="p-2">27"</td><td className="p-2">18.5"</td></tr>
                      <tr><td className="p-2 font-bold text-[#20211E]">S</td><td className="p-2">40"</td><td className="p-2">28"</td><td className="p-2">19.5"</td></tr>
                      <tr><td className="p-2 font-bold text-[#20211E]">M</td><td className="p-2">42"</td><td className="p-2">29"</td><td className="p-2">20.5"</td></tr>
                      <tr><td className="p-2 font-bold text-[#20211E]">L</td><td className="p-2">44"</td><td className="p-2">30"</td><td className="p-2">21.5"</td></tr>
                      <tr><td className="p-2 font-bold text-[#20211E]">XL</td><td className="p-2">46"</td><td className="p-2">31"</td><td className="p-2">22.5"</td></tr>
                      <tr><td className="p-2 font-bold text-[#20211E]">XXL</td><td className="p-2">48"</td><td className="p-2">31.5"</td><td className="p-2">23.5"</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-[#20211E] uppercase text-xs mb-2">Trousers &amp; Pants (Waist / Inseam)</h3>
                <div className="border border-[#353630/20] overflow-x-auto rounded-xs">
                  <table className="w-full text-left">
                    <thead className="bg-[#D6C7AE]/60 font-bold text-[#20211E]">
                      <tr>
                        <th className="p-2.5">Size</th>
                        <th className="p-2.5">Waist Range</th>
                        <th className="p-2.5">Inseam (Inches)</th>
                        <th className="p-2.5">Thigh Width</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#353630/20]">
                      <tr><td className="p-2 font-bold text-[#20211E]">S (28-30)</td><td className="p-2">28" - 30"</td><td className="p-2">30"</td><td className="p-2">25"</td></tr>
                      <tr><td className="p-2 font-bold text-[#20211E]">M (31-33)</td><td className="p-2">31" - 33"</td><td className="p-2">31"</td><td className="p-2">26.5"</td></tr>
                      <tr><td className="p-2 font-bold text-[#20211E]">L (34-36)</td><td className="p-2">34" - 36"</td><td className="p-2">31.5"</td><td className="p-2">28"</td></tr>
                      <tr><td className="p-2 font-bold text-[#20211E]">XL (37-39)</td><td className="p-2">37" - 39"</td><td className="p-2">32"</td><td className="p-2">29.5"</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeModal === 'shipping' && (
            <div className="space-y-3">
              <p>
                <strong>Domestic India Shipping:</strong> All orders are dispatched from our fulfillment center in
                Mumbai within 24 to 48 hours of payment authorization or Cash on Delivery verification.
              </p>
              <p>
                <strong>Free Shipping Eligibility:</strong> All domestic orders with a net subtotal of ₹1,999 or
                greater qualify for complimentary express courier shipping. For orders below ₹1,999, a flat standard
                courier fee of ₹149 is applied at checkout.
              </p>
              <p>
                <strong>Estimated Delivery Windows:</strong>
                <br />&bull; Metro regions (Mumbai, Delhi NCR, Bangalore, Pune, Hyderabad, Chennai): 2–4 business days.
                <br />&bull; Tier 2 &amp; Regional PIN codes: 4–6 business days.
              </p>
              <p>
                <strong>Courier Partners:</strong> We partner with Blue Dart Express, Delhivery, and DTDC to guarantee
                secure doorstep handling with SMS &amp; WhatsApp tracking.
              </p>
            </div>
          )}

          {activeModal === 'returns' && (
            <div className="space-y-3">
              <p>
                <strong>7-Day Unconditional Exchange Policy:</strong> We want you to feel confident in your uniform.
                If the sizing or silhouette is not ideal, you may request a size exchange or store return within 7 calendar
                days from the recorded delivery date.
              </p>
              <p>
                <strong>Garment Condition Requirements:</strong>
                <br />&bull; Pieces must be unwashed, unworn, and free from perfume or staining.
                <br />&bull; Original hang tags and garment dust bags must remain attached and intact.
              </p>
              <p>
                <strong>Reverse Pickup:</strong> Our courier agent will coordinate a complimentary reverse pickup from
                your doorstep once your request is logged in the member dashboard.
              </p>
            </div>
          )}

          {activeModal === 'privacy' && (
            <div className="space-y-3">
              <p>
                <strong>Data Privacy Commitment:</strong> OffGrid OG respects your privacy. We collect only the
                essential details necessary to process your clothing orders, arrange courier delivery, and provide client
                support.
              </p>
              <p>
                <strong>Payment Credentials:</strong> We never store credit card numbers, CVVs, or NetBanking passwords.
                All online transactions are processed through Razorpay's PCI-DSS compliant payment infrastructure.
              </p>
              <p>
                <strong>Zero Spam Guarantee:</strong> Your phone number and email are used strictly for order tracking
                updates and drop notifications if you subscribed. We do not sell customer data to third-party advertisers.
              </p>
            </div>
          )}

          {activeModal === 'terms' && (
            <div className="space-y-3">
              <p>
                <strong>Acceptance of Terms:</strong> By browsing OffGrid OG or placing an order, you agree to these
                terms and our operational guidelines.
              </p>
              <p>
                <strong>Inventory &amp; Pricing:</strong> All prices listed are in Indian Rupees (INR) and inclusive of
                all applicable Goods and Services Taxes (GST). We reserve the right to correct typographical pricing
                errors and adjust inventory levels atomically.
              </p>
              <p>
                <strong>Jurisdiction:</strong> All commercial transactions and agreements are governed in accordance
                with the laws of India, under the jurisdiction of the courts of Mumbai, Maharashtra.
              </p>
            </div>
          )}

          {activeModal === 'faq' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-[#20211E] text-xs">How long does shipping and delivery take?</h4>
                <p className="mt-1">
                  Orders dispatched from our Mumbai studio take 2–4 business days for major metropolitan areas (Mumbai, Delhi NCR, Bangalore, Pune, Hyderabad, Chennai) and 4–6 business days for regional PIN codes across India.
                </p>
              </div>
              <div className="border-t border-[#353630/20]/60 pt-3">
                <h4 className="font-bold text-[#20211E] text-xs">Do I qualify for free shipping?</h4>
                <p className="mt-1">
                  Yes. All domestic orders above ₹1,999 qualify for complimentary express courier shipping automatically. Orders under ₹1,999 carry a flat ₹149 standard courier fee.
                </p>
              </div>
              <div className="border-t border-[#353630/20]/60 pt-3">
                <h4 className="font-bold text-[#20211E] text-xs">What is the return and exchange window?</h4>
                <p className="mt-1">
                  We offer a 7-day hassle-free return and exchange policy from the date of recorded doorstep delivery. Our courier arranges reverse pickup directly from your address.
                </p>
              </div>
              <div className="border-t border-[#353630/20]/60 pt-3">
                <h4 className="font-bold text-[#20211E] text-xs">How do I track my active order?</h4>
                <p className="mt-1">
                  Real-time tracking links are dispatched via SMS & WhatsApp as soon as your parcel is handed to Blue Dart or Delhivery. You can also view status anytime in the "Track Your Order" section.
                </p>
              </div>
              <div className="border-t border-[#353630/20]/60 pt-3">
                <h4 className="font-bold text-[#20211E] text-xs">Which payment methods are accepted?</h4>
                <p className="mt-1">
                  We accept UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit Cards, NetBanking via secure Razorpay checkout, as well as Cash on Delivery (COD) for eligible domestic PIN codes.
                </p>
              </div>
            </div>
          )}

          {activeModal === 'contact' && (
            <div className="space-y-4">
              <p>
                Our concierge support team is here to assist with garment sizing inquiries, order status updates, and styling advice.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 bg-white border border-[#353630/20] rounded-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#777B5A] block">Email Support</span>
                  <a href="mailto:support@offgridog.in" className="text-xs font-bold text-[#20211E] hover:underline">
                    support@offgridog.in
                  </a>
                  <p className="text-[10px] text-[#A6A49C]">Response within 24 business hours</p>
                </div>
                <div className="p-3.5 bg-white border border-[#353630/20] rounded-xs space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[#777B5A] block">Direct Phone Line</span>
                  <a href="tel:+919876543210" className="text-xs font-bold text-[#20211E] hover:underline">
                    +91 98765 43210
                  </a>
                  <p className="text-[10px] text-[#A6A49C]">Mon – Sat, 10:00 AM – 7:00 PM IST</p>
                </div>
              </div>
              <div className="p-3.5 bg-white border border-[#353630/20] rounded-xs space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#777B5A] block">Studio & Fulfillment HQ</span>
                <p className="text-xs font-semibold text-[#20211E]">
                  402, Sunset Boulevard, Bandra West, Mumbai, Maharashtra 400050, India
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 border-t border-[#353630/20] text-right">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2 bg-[#20211E] text-white text-xs font-bold uppercase rounded-xs hover:bg-[#777B5A] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
