/* eslint-disable @typescript-eslint/no-explicit-any */
// components/payment/PaymentDialog.tsx
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreatePaymentIntent, useConfirmPayment } from "@/hooks/usePayment";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

// Stripe Promise (Ensure your hook is configured correctly for this)
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Stripe Payment Form (আলাদা কম্পোনেন্ট)
function StripePaymentForm({
  paymentIntentId,
  onSuccess,
  onClose,
}: {
  paymentIntentId: string;
  onSuccess: () => void;
  onClose: () => void;
}) {
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
        return_url: `${window.location.origin}/my-bookings`,
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message || "Payment failed");
      setIsProcessing(false);
    } else {
      try {
        // Confirm payment on your backend only after Stripe confirmation
        await confirmPayment.mutateAsync(paymentIntentId);
        toast.success("Payment successful!");
        onSuccess();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Booking update failed");
      }
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
            <PaymentElement />     {" "}
      <div className="flex gap-3">
               {" "}
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
        >
                    Cancel        {" "}
        </Button>
               {" "}
        <Button type="submit" disabled={isProcessing || !stripe || !elements}>
                   {" "}
          {isProcessing ? (
            <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />   
                        Processing...            {" "}
            </>
          ) : (
            "Pay Now"
          )}
                 {" "}
        </Button>
             {" "}
      </div>
         {" "}
    </form>
  );
}

// Main PaymentDialog
interface PaymentDialogProps {
  bookingId: string;
  amount: number;
  eventName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PaymentDialog({
  bookingId,
  amount,
  eventName,
  open,
  onOpenChange,
  onSuccess,
}: PaymentDialogProps) {
  const createIntent = useCreatePaymentIntent();
  const confirmPayment = useConfirmPayment();

  const [paymentIntentId, setPaymentIntentId] = useState<string>("");
  const [clientSecret, setClientSecret] = useState<string>("");
  const [isDemoMode, setIsDemoMode] = useState(false); // 👇 FIX 1: DEDICATED FUNCTION FOR CLEANUP/RESET // This solves the React state warning and ensures a clean state on close.

  const handleDialogChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        setPaymentIntentId("");
        setClientSecret("");
        setIsDemoMode(false); // Reset the query state for a fresh start next time
        createIntent.reset();
      }
      onOpenChange(isOpen);
    },
    [onOpenChange, createIntent]
  ); // Dialog খোলা হলে Payment Intent তৈরি করো

  useEffect(() => {
    // 👇 FIX 2: PREVENT DUPLICATE CALLS
    // Only run if the dialog is open, we don't have an intent yet, and no request is pending/successful.
    if (
      open &&
      !paymentIntentId &&
      !createIntent.isPending &&
      !createIntent.isSuccess
    ) {
      createIntent.mutate(bookingId, {
        onSuccess: (data) => {
          setPaymentIntentId(data.paymentIntentId);
          setClientSecret(data.clientSecret || "");
          setIsDemoMode(data.paymentIntentId.startsWith("demo_pi_"));
        },
        onError: (err: any) => {
          const msg = err.response?.data?.message || "Failed to setup payment";
          toast.error(msg); // 409 (Conflict/Duplicate Key) means an intent exists. // We don't close the dialog immediately, we wait for the user to try to pay again
          if (msg.includes("already exists") || err.response?.status === 409) {
            // 💡 NOTE: Ideally, the backend should return the existing PI data on 409/duplicate
            // but since it's failing, we just prevent closing the dialog here.
            return;
          }
          handleDialogChange(false); // Close the dialog for other errors
        },
      });
    }
  }, [open, bookingId, paymentIntentId, createIntent, handleDialogChange]); // Demo Mode Confirm

  const handleDemoConfirm = async () => {
    if (!paymentIntentId) return;
    try {
      await confirmPayment.mutateAsync(paymentIntentId);
      toast.success("Joined successfully! (Demo)");
      onSuccess();
    } catch (err) {
      // error already shown in hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
           {" "}
      <DialogContent className="sm:max-w-md">
               {" "}
        <DialogHeader>
                    <DialogTitle>Complete Payment</DialogTitle>         {" "}
          <DialogDescription>
                        Join <span className="font-semibold">{eventName}</span> 
                   {" "}
          </DialogDescription>
                 {" "}
        </DialogHeader>
               {" "}
        <div className="space-y-6 py-4">
                   {" "}
          <div className="text-center">
                       {" "}
            <p className="text-sm text-muted-foreground">Total Amount</p>       
               {" "}
            <p className="text-4xl font-bold text-primary">
                            ৳{amount.toLocaleString()}           {" "}
            </p>
                     {" "}
          </div>
                    {/* Demo Mode Notice */}         {" "}
          {isDemoMode && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                           {" "}
              <p className="text-sm font-medium text-yellow-800">
                                Demo Mode Active              {" "}
              </p>
                           {" "}
              <p className="text-xs text-yellow-700 mt-1">
                                Click below to simulate payment              {" "}
              </p>
                         {" "}
            </div>
          )}
                    {/* Loading */}         {" "}
          {createIntent.isPending ? (
            <div className="flex flex-col items-center py-12">
                           {" "}
              <Loader2 className="h-10 w-10 animate-spin text-primary" />       
                   {" "}
              <p className="mt-4 text-sm text-muted-foreground">
                                Preparing payment...              {" "}
              </p>
                         {" "}
            </div>
          ) : isDemoMode ? (
            <Button
              size="lg"
              className="w-full"
              onClick={handleDemoConfirm}
              disabled={confirmPayment.isPending}
            >
                           {" "}
              {confirmPayment.isPending ? (
                <>
                                   {" "}
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />             
                      Processing...                {" "}
                </>
              ) : (
                "Confirm Payment (Demo)"
              )}
                         {" "}
            </Button>
          ) : clientSecret && paymentIntentId ? (
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: { theme: "stripe" },
              }}
            >
                           {" "}
              <StripePaymentForm
                paymentIntentId={paymentIntentId}
                onSuccess={onSuccess}
                onClose={() => handleDialogChange(false)}
              />
                         {" "}
            </Elements>
          ) : null}
                   {" "}
          {!isDemoMode && !createIntent.isPending && (
            <div className="text-center text-xs text-muted-foreground">
                            Secured by              {" "}
              <span className="font-semibold text-primary">Stripe</span>       
                 {" "}
            </div>
          )}
                 {" "}
        </div>
             {" "}
      </DialogContent>
         {" "}
    </Dialog>
  );
}
