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
import { useTheme } from "next-themes"; // ✅ Import next-themes hook

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// --- Stripe Payment Form Component ---
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
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Loading payment form...
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
        <Shield className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        <p className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
          Secured by 256-bit SSL encryption
        </p>
      </div>

      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
        <span className="text-sm font-medium text-foreground">
          Total Amount
        </span>
        <span className="text-2xl font-bold text-primary">
          ${amount.toLocaleString()}
        </span>
      </div>

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
          className="w-full sm:flex-1 gap-2 order-1 sm:order-2 shadow-lg font-bold"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Processing...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" /> Pay ${amount.toLocaleString()}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}

// --- Main PaymentDialog Component ---
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
  const { theme } = useTheme(); // ✅ Detect current theme (dark/light)
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
      });
    }
  }, [open, bookingId, paymentIntentId, createIntent]);

  const handleDemoConfirm = async () => {
    if (!paymentIntentId) return;
    try {
      await confirmPayment.mutateAsync(paymentIntentId);
      toast.success("Joined successfully! 🎉");
      onSuccess();
    } catch (err) {
      toast.error("Failed to confirm payment");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-card text-foreground border-border">
        <DialogHeader className="space-y-3">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center mx-auto shadow-lg">
            <CreditCard className="h-7 w-7 text-white" />
          </div>
          <DialogTitle className="text-2xl text-center font-bold">
            Complete Your Booking
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            You&apos;re joining{" "}
            <span className="font-semibold text-foreground underline decoration-primary/30">
              {eventName}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center p-6 bg-muted/30 rounded-2xl border border-border">
            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
            <p className="text-5xl font-bold text-foreground">
              ${amount.toLocaleString()}
            </p>
          </div>

          {createIntent.isPending ? (
            <div className="flex flex-col items-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="mt-4 text-sm font-medium">
                Initializing secure gateway...
              </p>
            </div>
          ) : isDemoMode ? (
            <div className="space-y-3">
              <Button
                size="lg"
                className="w-full font-bold"
                onClick={handleDemoConfirm}
                disabled={confirmPayment.isPending}
              >
                {confirmPayment.isPending
                  ? "Confirming..."
                  : "Confirm Demo Payment"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => handleDialogChange(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            clientSecret && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    // ✅ Dynamic appearance logic for Dark/Light Mode
                    theme: theme === "dark" ? "night" : "stripe",
                    variables: {
                      colorPrimary: "#3b82f6",
                      colorBackground: theme === "dark" ? "#1e293b" : "#ffffff",
                      colorText: theme === "dark" ? "#f8fafc" : "#0f172a",
                      colorDanger: "#ef4444",
                      fontFamily: "Inter, system-ui, sans-serif",
                    },
                    rules: {
                      // ✅ Specifically fix Label colors (Card number, Country etc.)
                      ".Label": {
                        color: theme === "dark" ? "#94a3b8" : "#475569",
                        fontWeight: "500",
                        marginBottom: "8px",
                      },
                      ".Input": {
                        backgroundColor:
                          theme === "dark" ? "#0f172a" : "#ffffff",
                        color: theme === "dark" ? "#ffffff" : "#0f172a",
                        borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
                      },
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
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
