import { Schema, model, models, type Model, type HydratedDocument } from "mongoose";

// Event domain model (strictly typed)
export interface IEvent {
  title: string;
  slug: string; // unique, generated from title
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string; // normalized ISO (YYYY-MM-DD)
  time: string; // normalized 24h HH:mm
  mode: "online" | "offline" | "hybrid" | (string & {});
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type EventDocument = HydratedDocument<IEvent>;

// Helpers kept local to file for deterministic behavior and easy testing
function slugify(input: string): string {
  return input
    .normalize("NFKD") // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeDateISO(input: string): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) throw new Error("Invalid date format");
  // Store canonical date component (YYYY-MM-DD)
  return d.toISOString().slice(0, 10);
}

function normalizeTimeHHmm(input: string): string {
  const raw = input.trim().toLowerCase();
  const m = raw.match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/);
  if (!m) throw new Error("Invalid time format");
  let hours = parseInt(m[1]!, 10);
  const minutes = parseInt(m[2] ?? "0", 10);
  const meridian = m[3];
  if (meridian === "am") {
    hours = hours % 12; // 12am -> 0
  } else if (meridian === "pm") {
    hours = hours % 12 + 12; // 12pm -> 12
  }
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error("Invalid time value");
  }
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${hh}:${mm}`;
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true, trim: true },
    overview: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, required: true, trim: true },
    audience: { type: String, required: true, trim: true },
    agenda: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0 && v.every((s) => typeof s === "string" && s.trim().length > 0),
        message: "Agenda must contain at least one non-empty string",
      },
    },
    organizer: { type: String, required: true, trim: true },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (v: string[]) => Array.isArray(v) && v.length > 0 && v.every((s) => typeof s === "string" && s.trim().length > 0),
        message: "Tags must contain at least one non-empty string",
      },
    },
  },
  { timestamps: true }
);

// Ensure unique index at schema level (in addition to field-level unique)
EventSchema.index({ slug: 1 }, { unique: true });

// Pre-save: generate slug only when title changes; normalize date & time; basic non-empty validation
EventSchema.pre<EventDocument>("save", function preSave(next) {
  try {
    if (this.isModified("title") || !this.slug) {
      this.slug = slugify(this.title);
    }

    // Validate and normalize date/time formats
    this.date = normalizeDateISO(this.date);
    this.time = normalizeTimeHHmm(this.time);

    // Extra guard for non-empty strings
    const requiredStrings: Array<keyof IEvent> = [
      "title",
      "slug",
      "description",
      "overview",
      "image",
      "venue",
      "location",
      "date",
      "time",
      "mode",
      "audience",
      "organizer",
    ];
    for (const key of requiredStrings) {
      const val = this[key];
      if (typeof val !== "string" || val.trim().length === 0) {
        throw new Error(`${String(key)} is required and must be a non-empty string`);
      }
    }

    next();
  } catch (err) {
    next(err as Error);
  }
});

export const Event: Model<IEvent> = (models.Event as Model<IEvent>) || model<IEvent>("Event", EventSchema);
export default Event;
