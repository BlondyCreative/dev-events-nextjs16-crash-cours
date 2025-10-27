import mongoose, { Types } from 'mongoose';
import { Booking, type IBooking } from '../booking.model';
import { Event } from '../event.model';

describe('Booking Model', () => {
  let testEventId: Types.ObjectId;

  beforeEach(async () => {
    const event = new Event({
      title: 'Test Event',
      description: 'Test Description',
      overview: 'Test Overview',
      image: 'https://example.com/image.jpg',
      venue: 'Test Venue',
      location: 'Test Location',
      date: '2025-12-15',
      time: '09:00',
      mode: 'online',
      audience: 'Test Audience',
      agenda: ['Item 1', 'Item 2'],
      organizer: 'Test Organizer',
      tags: ['test', 'event'],
    });
    const savedEvent = await event.save();
    testEventId = savedEvent._id as Types.ObjectId;
  });

  describe('Schema Validation', () => {
    it('should create a valid booking with all required fields', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });
      const savedBooking = await booking.save();

      expect(savedBooking._id).toBeDefined();
      expect(savedBooking.eventId.toString()).toBe(testEventId.toString());
      expect(savedBooking.email).toBe('test@example.com');
      expect(savedBooking.createdAt).toBeDefined();
      expect(savedBooking.updatedAt).toBeDefined();
    });

    it('should fail validation when eventId is missing', async () => {
      const booking = new Booking({
        email: 'test@example.com',
      } as IBooking);
      await expect(booking.save()).rejects.toThrow();
    });

    it('should fail validation when email is missing', async () => {
      const booking = new Booking({
        eventId: testEventId,
      } as IBooking);
      await expect(booking.save()).rejects.toThrow();
    });

    it('should convert email to lowercase', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'Test@Example.COM',
      });
      const savedBooking = await booking.save();
      expect(savedBooking.email).toBe('test@example.com');
    });

    it('should trim whitespace from email', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: '  test@example.com  ',
      });
      const savedBooking = await booking.save();
      expect(savedBooking.email).toBe('test@example.com');
    });

    it('should create index on eventId field', async () => {
      const indexes = await Booking.collection.getIndexes();
      const eventIdIndex = Object.keys(indexes).find(key => key.includes('eventId'));
      expect(eventIdIndex).toBeDefined();
    });
  });

  describe('Email Validation', () => {
    it('should accept valid email formats', async () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
        'test123@test-domain.com',
        'a@b.co',
      ];

      for (const email of validEmails) {
        const booking = new Booking({
          eventId: testEventId,
          email,
        });
        const savedBooking = await booking.save();
        expect(savedBooking.email).toBe(email.toLowerCase());
        await Booking.deleteOne({ _id: savedBooking._id });
      }
    });

    it('should reject email without @ symbol', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'invalidemail.com',
      });
      await expect(booking.save()).rejects.toThrow('Invalid email format');
    });

    it('should reject email without domain', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user@',
      });
      await expect(booking.save()).rejects.toThrow('Invalid email format');
    });

    it('should reject email without local part', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: '@example.com',
      });
      await expect(booking.save()).rejects.toThrow('Invalid email format');
    });

    it('should reject email with spaces', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user @example.com',
      });
      await expect(booking.save()).rejects.toThrow('Invalid email format');
    });

    it('should reject email without TLD', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user@domain',
      });
      await expect(booking.save()).rejects.toThrow('Invalid email format');
    });

    it('should reject email with invalid TLD (single character)', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user@example.c',
      });
      await expect(booking.save()).rejects.toThrow('Invalid email format');
    });

    it('should reject empty email', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: '',
      });
      await expect(booking.save()).rejects.toThrow();
    });

    it('should reject email with multiple @ symbols', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user@@example.com',
      });
      await expect(booking.save()).rejects.toThrow('Invalid email format');
    });

    it('should reject email with invalid characters', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user name@example.com',
      });
      await expect(booking.save()).rejects.toThrow('Invalid email format');
    });

    it('should accept email with plus sign', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user+tag@example.com',
      });
      const savedBooking = await booking.save();
      expect(savedBooking.email).toBe('user+tag@example.com');
    });

    it('should accept email with dots in local part', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'first.last@example.com',
      });
      const savedBooking = await booking.save();
      expect(savedBooking.email).toBe('first.last@example.com');
    });

    it('should accept email with numbers', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user123@example456.com',
      });
      const savedBooking = await booking.save();
      expect(savedBooking.email).toBe('user123@example456.com');
    });

    it('should accept email with subdomain', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user@mail.example.com',
      });
      const savedBooking = await booking.save();
      expect(savedBooking.email).toBe('user@mail.example.com');
    });
  });

  describe('Pre-save Hook - Event Existence Validation', () => {
    it('should fail when referenced event does not exist', async () => {
      const nonExistentId = new Types.ObjectId();
      const booking = new Booking({
        eventId: nonExistentId,
        email: 'test@example.com',
      });
      await expect(booking.save()).rejects.toThrow('Referenced event does not exist');
    });

    it('should succeed when referenced event exists', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });
      const savedBooking = await booking.save();
      expect(savedBooking._id).toBeDefined();
    });

    it('should fail when eventId is null', async () => {
      const booking = new Booking({
        eventId: null as any,
        email: 'test@example.com',
      });
      await expect(booking.save()).rejects.toThrow();
    });

    it('should fail when eventId is undefined', async () => {
      const booking = new Booking({
        email: 'test@example.com',
      } as IBooking);
      await expect(booking.save()).rejects.toThrow();
    });

    it('should validate email format in pre-save hook', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });
      booking.email = 'invalid-email';
      await expect(booking.save()).rejects.toThrow('Invalid email format');
    });

    it('should allow booking the same event multiple times with different emails', async () => {
      const booking1 = new Booking({
        eventId: testEventId,
        email: 'user1@example.com',
      });
      const booking2 = new Booking({
        eventId: testEventId,
        email: 'user2@example.com',
      });

      const saved1 = await booking1.save();
      const saved2 = await booking2.save();

      expect(saved1._id).toBeDefined();
      expect(saved2._id).toBeDefined();
      expect(saved1._id).not.toEqual(saved2._id);
    });

    it('should allow same email to book different events', async () => {
      const event2 = new Event({
        title: 'Another Test Event',
        description: 'Test Description',
        overview: 'Test Overview',
        image: 'https://example.com/image.jpg',
        venue: 'Test Venue',
        location: 'Test Location',
        date: '2025-12-20',
        time: '10:00',
        mode: 'offline',
        audience: 'Test Audience',
        agenda: ['Item 1'],
        organizer: 'Test Organizer',
        tags: ['test'],
      });
      const savedEvent2 = await event2.save();

      const booking1 = new Booking({
        eventId: testEventId,
        email: 'user@example.com',
      });
      const booking2 = new Booking({
        eventId: savedEvent2._id as Types.ObjectId,
        email: 'user@example.com',
      });

      const saved1 = await booking1.save();
      const saved2 = await booking2.save();

      expect(saved1._id).toBeDefined();
      expect(saved2._id).toBeDefined();
      expect(saved1.eventId.toString()).toBe(testEventId.toString());
      expect(saved2.eventId.toString()).toBe(savedEvent2._id.toString());
    });
  });

  describe('Timestamps', () => {
    it('should automatically add createdAt timestamp', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });
      const savedBooking = await booking.save();

      expect(savedBooking.createdAt).toBeDefined();
      expect(savedBooking.createdAt).toBeInstanceOf(Date);
    });

    it('should automatically add updatedAt timestamp', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });
      const savedBooking = await booking.save();

      expect(savedBooking.updatedAt).toBeDefined();
      expect(savedBooking.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt on modification', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });
      const savedBooking = await booking.save();
      const originalUpdatedAt = savedBooking.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 10));

      savedBooking.email = 'newemail@example.com';
      const updatedBooking = await savedBooking.save();

      expect(updatedBooking.updatedAt).toBeDefined();
      expect(updatedBooking.updatedAt!.getTime()).toBeGreaterThan(originalUpdatedAt!.getTime());
    });

    it('should not change createdAt on modification', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });
      const savedBooking = await booking.save();
      const originalCreatedAt = savedBooking.createdAt;

      await new Promise(resolve => setTimeout(resolve, 10));

      savedBooking.email = 'newemail@example.com';
      const updatedBooking = await savedBooking.save();

      expect(updatedBooking.createdAt).toEqual(originalCreatedAt);
    });
  });

  describe('EventId Reference', () => {
    it('should store eventId as ObjectId', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });
      const savedBooking = await booking.save();

      expect(savedBooking.eventId).toBeInstanceOf(Types.ObjectId);
    });

    it('should maintain reference to Event model', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });
      const savedBooking = await booking.save();

      const populatedBooking = await Booking.findById(savedBooking._id).populate('eventId');
      
      expect(populatedBooking).toBeDefined();
      expect(populatedBooking!.eventId).toBeDefined();
    });

    it('should accept string representation of ObjectId', async () => {
      const booking = new Booking({
        eventId: testEventId.toString() as any,
        email: 'test@example.com',
      });
      const savedBooking = await booking.save();

      expect(savedBooking.eventId.toString()).toBe(testEventId.toString());
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long email addresses', async () => {
      const longEmail = 'a'.repeat(50) + '@' + 'b'.repeat(50) + '.com';
      const booking = new Booking({
        eventId: testEventId,
        email: longEmail,
      });
      const savedBooking = await booking.save();

      expect(savedBooking.email).toBe(longEmail);
    });

    it('should handle email with maximum valid TLD length', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user@example.museum',
      });
      const savedBooking = await booking.save();

      expect(savedBooking.email).toBe('user@example.museum');
    });

    it('should handle concurrent bookings for same event', async () => {
      const bookingPromises = [];
      for (let i = 0; i < 10; i++) {
        const booking = new Booking({
          eventId: testEventId,
          email: `user${i}@example.com`,
        });
        bookingPromises.push(booking.save());
      }

      const savedBookings = await Promise.all(bookingPromises);
      expect(savedBookings).toHaveLength(10);
      expect(new Set(savedBookings.map(b => b._id.toString())).size).toBe(10);
    });

    it('should handle booking after event is deleted', async () => {
      await Event.deleteOne({ _id: testEventId });

      const booking = new Booking({
        eventId: testEventId,
        email: 'test@example.com',
      });

      await expect(booking.save()).rejects.toThrow('Referenced event does not exist');
    });

    it('should allow updating booking email', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'original@example.com',
      });
      const savedBooking = await booking.save();

      savedBooking.email = 'updated@example.com';
      const updatedBooking = await savedBooking.save();

      expect(updatedBooking.email).toBe('updated@example.com');
    });

    it('should reject update with invalid email', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'original@example.com',
      });
      const savedBooking = await booking.save();

      savedBooking.email = 'invalid-email';
      
      await expect(savedBooking.save()).rejects.toThrow('Invalid email format');
    });

    it('should handle special characters in email local part', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user.name+tag@example.com',
      });
      const savedBooking = await booking.save();

      expect(savedBooking.email).toBe('user.name+tag@example.com');
    });

    it('should handle hyphenated domain names', async () => {
      const booking = new Booking({
        eventId: testEventId,
        email: 'user@test-domain.com',
      });
      const savedBooking = await booking.save();

      expect(savedBooking.email).toBe('user@test-domain.com');
    });
  });

  describe('Query Operations', () => {
    it('should find bookings by eventId', async () => {
      await Booking.create([
        { eventId: testEventId, email: 'user1@example.com' },
        { eventId: testEventId, email: 'user2@example.com' },
        { eventId: testEventId, email: 'user3@example.com' },
      ]);

      const bookings = await Booking.find({ eventId: testEventId });
      expect(bookings).toHaveLength(3);
    });

    it('should find booking by email', async () => {
      const email = 'unique@example.com';
      await Booking.create({ eventId: testEventId, email });

      const booking = await Booking.findOne({ email });
      expect(booking).toBeDefined();
      expect(booking!.email).toBe(email);
    });

    it('should count bookings for an event', async () => {
      await Booking.create([
        { eventId: testEventId, email: 'user1@example.com' },
        { eventId: testEventId, email: 'user2@example.com' },
      ]);

      const count = await Booking.countDocuments({ eventId: testEventId });
      expect(count).toBe(2);
    });

    it('should delete booking by id', async () => {
      const booking = await Booking.create({
        eventId: testEventId,
        email: 'delete@example.com',
      });

      await Booking.deleteOne({ _id: booking._id });
      const found = await Booking.findById(booking._id);
      expect(found).toBeNull();
    });
  });
});