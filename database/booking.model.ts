import { Schema, model, models, type Model, type HydratedDocument, Types } from "mongoose";
import { Event } from "./event.model";

export interface IBooking {
  eventId: Types.ObjectId; // ref -> Event
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type BookingDocument = HydratedDocument<IBooking>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const BookingSchema = new Schema<IBooking>(
  {
    eventId: { type: Schema.Types.ObjectId, ref: "Event", required: true, index: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v: string) => EMAIL_RE.test(v),
        message: "Invalid email format",
      },
    },
  },
  { timestamps: true }
);

// Index to speed up lookups by eventId
BookingSchema.index({ eventId: 1 });

// Pre-save validation: verify event existence and re-validate email
BookingSchema.pre<BookingDocument>("save", async function preSave(next) {
  try {
    if (!this.eventId) throw new Error("eventId is required");

    // Ensure referenced Event exists to avoid dangling bookings
    const exists = await Event.exists({ _id: this.eventId }).lean();
    if (!exists) throw new Error("Referenced event does not exist");

    if (!EMAIL_RE.test(this.email)) throw new Error("Invalid email format");

    next();
  } catch (err) {
    next(err as Error);
  }
});

export const Booking: Model<IBooking> = (models.Booking as Model<IBooking>) || model<IBooking>("Booking", BookingSchema);
export default Booking;
