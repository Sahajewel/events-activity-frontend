// components/payment/StripePaymentForm.tsx
"use client";

import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useConfirmPayment } from "@/hooks/usePayment";
import { useState } from "react";

interface StripePaymentFormProps {
  paymentIntentId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export function StripePaymentForm({
  paymentIntentId,
  onSuccess,
  onClose,
}: StripePaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const confirmPayment = useConfirmPayment();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/my-bookings`, // success হলে কোথায় যাবে
      },
      redirect: "if_required", // আমরা নিজে হ্যান্ডেল করবো
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setIsProcessing(false);
    } else {
      // Payment successful on Stripe
      try {
        await confirmPayment.mutateAsync(paymentIntentId);
        toast.success("Payment successful!");
        onSuccess();
      } catch (err) {
        toast.error("Payment confirmed but failed to update booking");
      }
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onClose}
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="flex-1"
          disabled={isProcessing || !stripe}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Pay Now"
          )}
        </Button>
      </div>
    </form>
  );
}
