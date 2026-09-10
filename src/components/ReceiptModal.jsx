import React from 'react';
import { X, Printer, CheckCircle, Package } from 'lucide-react';

export default function ReceiptModal({ donation, onClose }) {
  if (!donation) return null;

  const handlePrint = () => {
    window.print();
  };

  const isItem = donation.donationType === 'Item' || Boolean(donation.itemName);
  const promised = Number(donation.promisedAmount !== undefined ? donation.promisedAmount : donation.amount) || 0;
  const paid = Number(donation.paidAmount !== undefined ? donation.paidAmount : donation.amount) || 0;
  const due = Math.max(0, promised - paid);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-red-200 overflow-hidden relative">
        
        {/* Header bar - No print controls */}
        <div className="no-print bg-rose-50 px-6 py-4 border-b border-rose-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-red-900 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-red-600" /> Donation Receipt Voucher
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg shadow-sm flex items-center gap-2 transition"
            >
              <Printer className="w-4 h-4" /> Print Receipt
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-rose-100/50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="receipt-printable" className="p-8 bg-white text-slate-800">
          
          {/* Top Decorative Border */}
          <div className="h-2.5 bg-gradient-to-r from-red-600 via-rose-500 to-red-700 rounded-t-sm mb-6"></div>

          {/* Receipt Header */}
          <div className="text-center pb-6 border-b border-red-100">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-700 rounded-full mb-2 text-3xl shadow-sm border border-red-200">
              🕉️
            </div>
            <h2 className="text-2xl font-black text-red-950 tracking-tight">
              Sri Vinayaka Chavithi Utsav Committee
            </h2>
            <p className="text-xs text-red-700 font-bold tracking-widest uppercase mt-1">
              Devotional Donation Receipt & Acknowledgment
            </p>
          </div>

          {/* Meta Information */}
          <div className="flex justify-between items-center my-6 text-sm">
            <div className="bg-red-50 px-3 py-1.5 rounded-md border border-red-200">
              <span className="text-xs text-red-800 font-semibold uppercase">Receipt No: </span>
              <span className="font-bold text-slate-900 font-mono">{donation.receiptNo}</span>
            </div>
            <div className="text-slate-600">
              <span className="font-semibold text-slate-700">Date: </span>
              {new Date(donation.date).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Details Box */}
          <div className="space-y-4 bg-rose-50/30 p-5 rounded-xl border border-rose-100 shadow-sm text-sm">
            <div className="flex justify-between border-b border-rose-100 pb-2">
              <span className="text-slate-500">Donor / Pilgrim Name:</span>
              <span className="font-bold text-slate-900 text-base">{donation.donorName}</span>
            </div>

            <div className="flex justify-between border-b border-rose-100 pb-2">
              <span className="text-slate-500">Contact / Phone:</span>
              <span className="font-medium text-slate-800">{donation.phone || 'N/A'}</span>
            </div>

            {isItem ? (
              <>
                <div className="flex justify-between border-b border-rose-100 pb-2">
                  <span className="text-slate-500">Donated Item:</span>
                  <span className="font-bold text-purple-900 flex items-center gap-1">
                    <Package className="w-4 h-4 text-purple-600" /> {donation.itemName}
                  </span>
                </div>

                <div className="flex justify-between border-b border-rose-100 pb-2">
                  <span className="text-slate-500">Quantity / Unit:</span>
                  <span className="font-bold text-slate-800">{donation.itemQuantity || '1'}</span>
                </div>

                {donation.estimatedValue > 0 && (
                  <div className="flex justify-between border-b border-rose-100 pb-2">
                    <span className="text-slate-500">Estimated Item Value:</span>
                    <span className="font-bold text-slate-700">₹ {Number(donation.estimatedValue).toLocaleString('en-IN')}</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between border-b border-rose-100 pb-2">
                  <span className="text-slate-500">Pledged Donation:</span>
                  <span className="font-bold text-slate-900">₹ {promised.toLocaleString('en-IN')}</span>
                </div>

                <div className="flex justify-between border-b border-rose-100 pb-2">
                  <span className="text-slate-500">Amount Paid Upfront:</span>
                  <span className="font-bold text-emerald-600 text-base">₹ {paid.toLocaleString('en-IN')}</span>
                </div>

                {due > 0 ? (
                  <div className="flex justify-between border-b border-rose-100 pb-2 bg-amber-50 p-2 rounded-lg border border-amber-200">
                    <span className="text-amber-800 font-bold">Remaining Due Balance:</span>
                    <span className="font-black text-amber-900 text-base">₹ {due.toLocaleString('en-IN')}</span>
                  </div>
                ) : (
                  <div className="flex justify-between border-b border-rose-100 pb-2">
                    <span className="text-slate-500">Payment Status:</span>
                    <span className="font-bold text-emerald-600">✓ Fully Paid</span>
                  </div>
                )}

                <div className="flex justify-between border-b border-rose-100 pb-2">
                  <span className="text-slate-500">Payment Mode:</span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800">
                    {donation.paymentMode}
                  </span>
                </div>
              </>
            )}

            {donation.notes && (
              <div className="flex justify-between pt-1">
                <span className="text-slate-500">Notes:</span>
                <span className="font-medium text-slate-700 italic">{donation.notes}</span>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-dashed border-red-200 flex justify-between items-end text-xs text-slate-500">
            <div>
              <p className="font-bold text-red-900">May Lord Vinayaka Bless You & Your Family! 🙏</p>
              <p className="text-[11px] mt-1 text-slate-400">Thank you for your pious contribution.</p>
            </div>
            <div className="text-center">
              <div className="w-28 border-b border-slate-400 mb-1"></div>
              <p className="font-semibold text-slate-700">Authorized Signatory</p>
              <p className="text-[10px] text-slate-400">Treasurer / President</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
