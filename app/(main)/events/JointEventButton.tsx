// /* eslint-disable @typescript-eslint/no-explicit-any */
// // components/events/JoinEventButton.tsx
// import { useState } from "react";
// import { loadStripe } from "@stripe/stripe-js";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// // Stripe public key
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// export function JoinEventButton({ event }: { event: any }) {
//   const [loading, setLoading] = useState(false);

//   const handleJoin = async () => {
//     if (!event) return;
//     setLoading(true);

//     try {
//       // Step 1: Create booking (backend e payment intent o create hoy)
//       const res = await fetch("/api/v1/bookings", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ eventId: event.id }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         throw new Error(data.message || "Failed to create booking");
//       }

//       // Free event → direct success
//       if (!data.data.requiresPayment) {
//         toast.success("Successfully joined the event!");
//         window.location.reload(); // or use query invalidation
//         return;
//       }

//       // Paid event → Stripe Payment
//       const stripe = await stripePromise;
//       if (!stripe) throw new Error("Stripe failed to load");

//       // Ei line ta perfect — Payment Intent er client_secret diye redirect kore
//       const { error } = await stripe.redirectToCheckout({
//         sessionId: data.data.sessionId, // ← tui backend e Stripe Checkout Session create korbi
//       });

//       if (error) {
//         toast.error(error.message || "Payment failed");
//       }
//     } catch (err: any) {
//       toast.error(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isBooked = event.currentUserBooking; // tui event e ei field add korbi
//   const isFull = event.bookings?.length >= event.maxParticipants;

//   return (
//     <Button
//       onClick={handleJoin}
//       disabled={loading || isBooked || isFull || event.status !== "OPEN"}
//       className="w-full"
//       size="lg"
//     >
//       {loading ? (
//         "Processing..."
//       ) : isBooked ? (
//         "Already Joined"
//       ) : isFull ? (
//         "Event Full"
//       ) : event.joiningFee > 0 ? (
//         `Join - ৳${event.joiningFee}`
//       ) : (
//         "Join Free"
//       )}
//     </Button>
//   );
// }

// export default JoinEventButton;
