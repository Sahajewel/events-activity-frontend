export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

export interface Booking {
  id: string;
  userId: string;
  eventId: string;
  status: BookingStatus;
  amount: number;
  createdAt: string;
  updatedAt: string;

  event: {
    id: string;
    name: string;
    date: string;
    location: string;
    imageUrl?: string | null;
    type: string;
    hostId: string;
    joiningFee: number;

    host: {
      id: string;
      fullName: string;
      profileImage?: string | null;
    };
  };

  payment?: {
    id: string;
    amount: number;
    status: "PENDING" | "SUCCESS" | "FAILED";
    transactionId?: string;
    createdAt: string;
  } | null;
}

export interface Event {
  id: string;
  name: string;
  type: string;
  description: string;
  date: string;
  location: string;
  minParticipants: number;
  maxParticipants: number;
  joiningFee: number;
  imageUrl?: string;
  status: "OPEN" | "FULL" | "CANCELLED" | "COMPLETED";
  host: {
    id: string;
    fullName: string;
    profileImage?: string;
  };
  _count?: {
    bookings: number;
  };
}
