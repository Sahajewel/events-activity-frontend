/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CheckCircle2,
  AlertCircle,
  Edit,
  Minus,
  Plus,
  Tag,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import { useValidateCoupon } from "@/hooks/useBooking";
import Link from "next/link";

interface BookingFormProps {
  event: any;
  isHost: boolean;
  hasJoined: boolean;
  isFull: boolean;
  spotsLeft: number;
  joining: boolean;
  onJoinEvent: (quantity: number, couponCode?: string) => void;
}

export function BookingForm({
  event,
  isHost,
  hasJoined,
  isFull,
  spotsLeft,
  joining,
  onJoinEvent,
}: BookingFormProps) {
  const [quantity, setQuantity] = useState(1);
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState("");

  const validateCoupon = useValidateCoupon();

  const basePrice = event.joiningFee || 0;
  const subtotal = basePrice * quantity;

  // Calculate discount from validated coupon
  const discount = appliedCoupon?.discount || 0;
  const finalPrice = appliedCoupon?.finalAmount || subtotal;

  // Handle quantity change
  const incrementQuantity = () => {
    if (quantity < spotsLeft) {
      setQuantity(quantity + 1);
      // Reset coupon when quantity changes
      if (appliedCoupon) {
        setAppliedCoupon(null);
        setCouponCode("");
        toast.info("Coupon removed. Please reapply with new quantity.");
      }
    } else {
      toast.error(`Only ${spotsLeft} spots available!`);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      // Reset coupon when quantity changes
      if (appliedCoupon) {
        setAppliedCoupon(null);
        setCouponCode("");
        toast.info("Coupon removed. Please reapply with new quantity.");
      }
    }
  };

  // Handle coupon application
  const applyCoupon = async () => {
    setCouponError("");

    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }

    try {
      const result = await validateCoupon.mutateAsync({
        code: couponCode.trim().toUpperCase(),
        eventId: event.id,
        quantity,
      });

      setAppliedCoupon(result);
      toast.success(`Coupon "${result.coupon.code}" applied successfully! 🎉`);
    } catch (error: any) {
      setCouponError(error.response?.data?.message || "Invalid coupon code");
      setAppliedCoupon(null);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.info("Coupon removed");
  };

  const handleBooking = () => {
    onJoinEvent(quantity, appliedCoupon?.coupon?.code);
  };

  return (
    <Card className="shadow-xl">
      <CardContent className="p-6 space-y-6">
        {/* Price Display */}
        <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-xl">
          <p className="text-4xl font-bold text-primary mb-1">
            {basePrice === 0 ? "Free" : formatCurrency(basePrice)}
          </p>
          <p className="text-sm text-muted-foreground">per person</p>
        </div>

        <Separator />

        {/* Quantity Selector */}
        {!isHost && !hasJoined && !isFull && (
          <div className="space-y-3">
            <Label className="text-sm font-medium">Number of People</Label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={decrementQuantity}
                disabled={quantity <= 1 || joining}
                className="h-12 w-12 rounded-xl"
              >
                <Minus className="h-5 w-5" />
              </Button>

              <div className="flex-1 text-center">
                <div className="text-3xl font-bold">{quantity}</div>
                <div className="text-xs text-muted-foreground">
                  {quantity === 1 ? "person" : "people"}
                </div>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={incrementQuantity}
                disabled={quantity >= spotsLeft || joining}
                className="h-12 w-12 rounded-xl"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground">
              Maximum {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} available
            </p>
          </div>
        )}

        {/* Coupon Section */}
        {!isHost && !hasJoined && !isFull && basePrice > 0 && (
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Have a Coupon Code?
            </Label>

            {appliedCoupon ? (
              <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-semibold text-green-700 dark:text-green-300">
                        {appliedCoupon.coupon.code}
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {appliedCoupon.coupon.type === "PERCENTAGE"
                          ? `${appliedCoupon.coupon.discount}% off`
                          : `${formatCurrency(
                              appliedCoupon.coupon.discount
                            )} off`}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeCoupon}
                    disabled={joining}
                    className="h-8 w-8 text-green-600 hover:text-green-700 dark:text-green-400"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter code (e.g., WELCOME20)"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                      }}
                      className={couponError ? "border-red-500" : ""}
                      disabled={joining || validateCoupon.isPending}
                    />
                    {couponError && (
                      <p className="text-xs text-red-500 mt-1">{couponError}</p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    onClick={applyCoupon}
                    disabled={
                      joining || !couponCode.trim() || validateCoupon.isPending
                    }
                    className="px-6"
                  >
                    {validateCoupon.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Apply"
                    )}
                  </Button>
                </div>

                {/* স্পেশাল অফার ব্যানার */}
                <div
                  className="relative overflow-hidden group cursor-pointer border border-primary/20 bg-primary/5 hover:bg-primary/10 p-3 rounded-xl transition-all"
                  onClick={() => setCouponCode("WELCOME20")}
                >
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="bg-primary text-white p-1 rounded-md">
                        <Sparkles className="h-3 w-3" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-wider font-bold text-primary/70">
                          Special Offer
                        </p>
                        <p className="text-sm font-bold">
                          Use <span className="text-primary">WELCOME20</span>{" "}
                          for 20% OFF!
                        </p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-xs hover:bg-primary hover:text-white transition-colors"
                    >
                      Apply
                    </Button>
                  </div>
                  {/* Background decoration */}
                  <div className="absolute -right-2 -top-2 opacity-10 group-hover:scale-110 transition-transform">
                    <Tag className="h-12 w-12 rotate-12" />
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <Separator />

        {/* Price Breakdown */}
        {!isHost && !hasJoined && !isFull && basePrice > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Subtotal ({quantity} × {formatCurrency(basePrice)})
              </span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600 dark:text-green-400">
                  Discount ({appliedCoupon.coupon.code})
                </span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  -{formatCurrency(discount)}
                </span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(finalPrice)}</span>
            </div>

            {appliedCoupon && discount > 0 && (
              <p className="text-xs text-center text-muted-foreground">
                You saved {formatCurrency(discount)}! 🎉
              </p>
            )}
          </div>
        )}

        {/* Status Info */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Status</span>
            <Badge variant={isFull ? "destructive" : "default"}>
              {isFull ? "Full" : "Available"}
            </Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Spots Left</span>
            <span className="font-semibold text-lg">{spotsLeft}</span>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        {isHost ? (
          <Link href={`/events/${event.id}/edit`}>
            {" "}
            {/* ← এই line add করুন */}
            <Button className="w-full h-12 gap-2 shadow-lg" size="lg">
              <Edit className="h-5 w-5" />
              Edit Event
            </Button>
          </Link>
        ) : hasJoined ? (
          <Button className="w-full h-12" disabled size="lg">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            Already Joined
          </Button>
        ) : isFull ? (
          <Button
            className="w-full h-12"
            disabled
            variant="secondary"
            size="lg"
          >
            <AlertCircle className="h-5 w-5 mr-2" />
            Event Full
          </Button>
        ) : (
          <Button
            className="w-full h-12 gap-2 shadow-lg hover:shadow-xl transition-all"
            disabled={joining}
            onClick={handleBooking}
            size="lg"
          >
            {joining ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Join Event {quantity > 1 && `(${quantity} people)`}
              </>
            )}
          </Button>
        )}

        {/* Trust Badges */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Secure booking</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Instant confirmation</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>24/7 support</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
