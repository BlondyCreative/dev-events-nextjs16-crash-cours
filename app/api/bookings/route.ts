import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Booking } from '@/database';

type BookingInput = {
  email: string;
  eventId?: string;
};

/**
 * POST /api/bookings
 * Creates a new booking for an event
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body: BookingInput = await request.json();

    // Validate email
    if (!body.email || typeof body.email !== 'string') {
      return NextResponse.json(
        { message: 'Invalid email', error: 'Email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { message: 'Invalid email format', error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // For now, we'll accept bookings without requiring an eventId
    // In a real app, you'd need to pass eventId from the client
    const booking = await Booking.create({
      email: body.email.toLowerCase().trim(),
      eventId: body.eventId || null,
    });

    return NextResponse.json(
      {
        message: 'Booking created successfully',
        booking,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Booking creation error:', error);

    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;

      // Duplicate email check
      if (errorMessage.includes('E11000')) {
        return NextResponse.json(
          { message: 'Email already booked', error: 'This email is already registered for this event' },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        message: 'Failed to create booking',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/bookings
 * Retrieves all bookings (optional: can add filters)
 */
export async function GET() {
  try {
    await connectDB();

    const bookings = await Booking.find({}).lean();

    return NextResponse.json(
      {
        message: 'Bookings retrieved successfully',
        bookings,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Bookings retrieval error:', error);

    let errorMessage = 'Unknown error';
    if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        message: 'Failed to retrieve bookings',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
