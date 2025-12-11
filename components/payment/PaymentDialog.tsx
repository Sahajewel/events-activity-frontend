/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  Shield,
  Zap,
  Calendar,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { useCreatePaymentIntent, useConfirmPayment } from "@/hooks/usePayment";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// Stripe Payment Form Component
function StripePaymentForm({
  paymentIntentId,
  amount,
  onSuccess,
  onClose,
}: {
  paymentIntentId: string;
  amount: number;
  onSuccess: () => void;
  onClose: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const confirmPayment = useConfirmPayment();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentReady, setPaymentReady] = useState(false);

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
        await confirmPayment.mutateAsync(paymentIntentId);
        toast.success("Payment successful! 🎉");
        onSuccess();
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Booking update failed");
      }
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Element with loading indicator */}
      <div className="relative">
        <PaymentElement
          onReady={() => setPaymentReady(true)}
          options={{
            layout: {
              type: "tabs",
              defaultCollapsed: false,
            },
          }}
        />
        {!paymentReady && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Loading payment form...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
        <Shield className="h-4 w-4 text-green-600" />
        <p className="text-xs text-green-800 font-medium">
          Secured by 256-bit SSL encryption
        </p>
      </div>

      {/* Amount Summary */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
        <span className="text-sm font-medium">Total Amount</span>
        <span className="text-2xl font-bold text-primary">
          ${amount.toLocaleString()}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isProcessing}
          className="w-full sm:w-auto order-2 sm:order-1"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isProcessing || !stripe || !elements || !paymentReady}
          className="w-full sm:flex-1 gap-2 order-1 sm:order-2 shadow-lg hover:shadow-xl transition-all"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" />
              Pay ${amount.toLocaleString()}
            </>
          )}
        </Button>
      </div>

      {/* Trust Indicators */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
        <div className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          <span>Instant Confirmation</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3 text-green-500" />
          <span>Refund Available</span>
        </div>
      </div>
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
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleDialogChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        setPaymentIntentId("");
        setClientSecret("");
        setIsDemoMode(false);
        createIntent.reset();
      }
      onOpenChange(isOpen);
    },
    [onOpenChange, createIntent]
  );

  useEffect(() => {
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
          toast.error(msg);
          if (msg.includes("already exists") || err.response?.status === 409) {
            return;
          }
          handleDialogChange(false);
        },
      });
    }
  }, [open, bookingId, paymentIntentId, createIntent, handleDialogChange]);

  const handleDemoConfirm = async () => {
    if (!paymentIntentId) return;
    try {
      await confirmPayment.mutateAsync(paymentIntentId);
      toast.success("Joined successfully! (Demo) 🎉");
      onSuccess();
    } catch (err) {
      toast.error("Failed to confirm demo payment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          {/* Icon Badge */}
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mx-auto shadow-lg">
            <CreditCard className="h-7 w-7 text-white" />
          </div>

          <DialogTitle className="text-2xl text-center">
            Complete Your Booking
          </DialogTitle>
          <DialogDescription className="text-center">
            You&apos;re joining{" "}
            <span className="font-semibold text-foreground">{eventName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Amount Display */}
          <div className="text-center p-6 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl border border-primary/20">
            <p className="text-sm text-muted-foreground mb-2 flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              Total Amount
            </p>
            <p className="text-5xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              ${amount.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              One-time payment • No hidden fees
            </p>
          </div>

          {/* Demo Mode Notice */}
          {isDemoMode && (
            <div className="relative overflow-hidden rounded-xl border border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50 p-4">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-300/20 rounded-full blur-3xl" />
              <div className="relative flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-yellow-900 mb-1">
                    Demo Mode Active
                  </p>
                  <p className="text-xs text-yellow-700">
                    This is a test payment. No real charges will be made.
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-yellow-200 text-yellow-900"
                >
                  TEST
                </Badge>
              </div>
            </div>
          )}

          {/* Loading State */}
          {createIntent.isPending ? (
            <div className="flex flex-col items-center py-12">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <CreditCard className="absolute inset-0 m-auto h-6 w-6 text-primary" />
              </div>
              <p className="mt-6 text-sm font-medium text-foreground">
                Setting up secure payment...
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                This will only take a moment
              </p>
            </div>
          ) : isDemoMode ? (
            /* Demo Mode Payment */
            <div className="space-y-4">
              {/* Info Box */}
              <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Demo Payment Instructions</p>
                  <p className="text-xs">
                    Click the button below to simulate a successful payment.
                    Your booking will be confirmed instantly.
                  </p>
                </div>
              </div>

              {/* Demo Confirm Button */}
              <Button
                size="lg"
                className="w-full gap-2 shadow-lg hover:shadow-xl transition-all"
                onClick={handleDemoConfirm}
                disabled={confirmPayment.isPending}
              >
                {confirmPayment.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing Demo Payment...
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    Confirm Demo Payment
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleDialogChange(false)}
                disabled={confirmPayment.isPending}
              >
                Cancel
              </Button>
            </div>
          ) : clientSecret && paymentIntentId ? (
            /* Real Stripe Payment */
            <Elements
              stripe={stripePromise}
              options={{
                clientSecret,
                appearance: {
                  theme: "stripe",
                  variables: {
                    colorPrimary: "#0F172A",
                    colorBackground: "#ffffff",
                    colorText: "#0F172A",
                    colorDanger: "#df1b41",
                    fontFamily: "system-ui, sans-serif",
                    spacingUnit: "4px",
                    borderRadius: "8px",
                  },
                },
              }}
            >
              <StripePaymentForm
                paymentIntentId={paymentIntentId}
                amount={amount}
                onSuccess={onSuccess}
                onClose={() => handleDialogChange(false)}
              />
            </Elements>
          ) : createIntent.isError ? (
            /* Error State */
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <p className="font-medium text-foreground mb-2">
                Payment Setup Failed
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                We couldn&apos;t initialize the payment. Please try again.
              </p>
              <Button
                onClick={() => handleDialogChange(false)}
                variant="outline"
              >
                Close
              </Button>
            </div>
          ) : null}

          {/* Stripe Branding */}
          {!isDemoMode && !createIntent.isPending && clientSecret && (
            <div className="text-center pt-4 border-t">
              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                <span>Secured and powered by</span>
                <span className="font-bold text-[#635BFF]">Stripe</span>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
