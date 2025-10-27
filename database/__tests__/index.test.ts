import * as dbIndex from '../index';
import { Event } from '../event.model';
import { Booking } from '../booking.model';

describe('Database Index', () => {
  describe('Exports', () => {
    it('should export Event model', () => {
      expect(dbIndex.Event).toBeDefined();
      expect(dbIndex.Event).toBe(Event);
    });

    it('should export Booking model', () => {
      expect(dbIndex.Booking).toBeDefined();
      expect(dbIndex.Booking).toBe(Booking);
    });

    it('should export both models', () => {
      const exports = Object.keys(dbIndex);
      expect(exports).toContain('Event');
      expect(exports).toContain('Booking');
      expect(exports).toHaveLength(2);
    });

    it('should export models that are instances of Mongoose Model', () => {
      expect(typeof dbIndex.Event).toBe('function');
      expect(typeof dbIndex.Booking).toBe('function');
    });
  });

  describe('Model Functionality', () => {
    it('should be able to create Event instance from exported model', () => {
      const event = new dbIndex.Event({
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
        agenda: ['Item 1'],
        organizer: 'Test Organizer',
        tags: ['test'],
      });

      expect(event).toBeDefined();
      expect(event.title).toBe('Test Event');
    });

    it('should be able to create Booking instance from exported model', () => {
      const booking = new dbIndex.Booking({
        eventId: '507f1f77bcf86cd799439011',
        email: 'test@example.com',
      });

      expect(booking).toBeDefined();
      expect(booking.email).toBe('test@example.com');
    });
  });
});