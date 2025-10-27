import mongoose from 'mongoose';
import { Event, type IEvent, type EventDocument } from '../event.model';

describe('Event Model', () => {
  const validEventData: Partial<IEvent> = {
    title: 'Tech Conference 2025',
    description: 'An amazing tech conference',
    overview: 'Join us for cutting-edge tech talks',
    image: 'https://example.com/image.jpg',
    venue: 'Convention Center',
    location: 'San Francisco, CA',
    date: '2025-12-15',
    time: '09:00',
    mode: 'hybrid',
    audience: 'Developers and Tech Enthusiasts',
    agenda: ['Registration', 'Keynote', 'Workshops', 'Networking'],
    organizer: 'Tech Events Inc.',
    tags: ['technology', 'conference', 'networking'],
  };

  describe('Schema Validation', () => {
    it('should create a valid event with all required fields', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();

      expect(savedEvent._id).toBeDefined();
      expect(savedEvent.title).toBe(validEventData.title);
      expect(savedEvent.slug).toBe('tech-conference-2025');
      expect(savedEvent.description).toBe(validEventData.description);
      expect(savedEvent.createdAt).toBeDefined();
      expect(savedEvent.updatedAt).toBeDefined();
    });

    it('should fail validation when title is missing', async () => {
      const eventData = { ...validEventData, title: undefined };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail validation when description is missing', async () => {
      const eventData = { ...validEventData, description: undefined };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail validation when overview is missing', async () => {
      const eventData = { ...validEventData, overview: undefined };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail validation when image is missing', async () => {
      const eventData = { ...validEventData, image: undefined };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail validation when venue is missing', async () => {
      const eventData = { ...validEventData, venue: undefined };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail validation when location is missing', async () => {
      const eventData = { ...validEventData, location: undefined };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail validation when date is missing', async () => {
      const eventData = { ...validEventData, date: undefined };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail validation when time is missing', async () => {
      const eventData = { ...validEventData, time: undefined };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail validation when mode is missing', async () => {
      const eventData = { ...validEventData, mode: undefined };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail validation when audience is missing', async () => {
      const eventData = { ...validEventData, audience: undefined };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail validation when organizer is missing', async () => {
      const eventData = { ...validEventData, organizer: undefined };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });

    it('should trim whitespace from string fields', async () => {
      const eventData = {
        ...validEventData,
        title: '  Trimmed Title  ',
        venue: '  Trimmed Venue  ',
      };
      const event = new Event(eventData);
      const savedEvent = await event.save();

      expect(savedEvent.title).toBe('Trimmed Title');
      expect(savedEvent.venue).toBe('Trimmed Venue');
    });
  });

  describe('Slug Generation', () => {
    it('should generate slug from title on creation', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('tech-conference-2025');
    });

    it('should handle title with special characters', async () => {
      const eventData = { ...validEventData, title: 'Tech & AI: 2025 Edition!' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('tech-ai-2025-edition');
    });

    it('should handle title with multiple spaces', async () => {
      const eventData = { ...validEventData, title: 'Multiple    Spaces   Here' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('multiple-spaces-here');
    });

    it('should handle title with underscores', async () => {
      const eventData = { ...validEventData, title: 'Event_With_Underscores' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('event-with-underscores');
    });

    it('should handle title with diacritics', async () => {
      const eventData = { ...validEventData, title: 'Café Résumé Naïve' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('cafe-resume-naive');
    });

    it('should handle uppercase titles', async () => {
      const eventData = { ...validEventData, title: 'UPPERCASE TITLE' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('uppercase-title');
    });

    it('should handle mixed case titles', async () => {
      const eventData = { ...validEventData, title: 'MiXeD CaSe TiTlE' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('mixed-case-title');
    });

    it('should regenerate slug when title changes', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('tech-conference-2025');

      savedEvent.title = 'Updated Conference Name';
      const updatedEvent = await savedEvent.save();
      expect(updatedEvent.slug).toBe('updated-conference-name');
    });

    it('should not regenerate slug when other fields change', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();
      const originalSlug = savedEvent.slug;

      savedEvent.description = 'Updated description';
      const updatedEvent = await savedEvent.save();
      expect(updatedEvent.slug).toBe(originalSlug);
    });

    it('should handle title with leading and trailing hyphens', async () => {
      const eventData = { ...validEventData, title: '---Event Title---' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.slug).toBe('event-title');
    });

    it('should enforce unique slugs', async () => {
      const event1 = new Event(validEventData);
      await event1.save();

      const event2 = new Event(validEventData);
      await expect(event2.save()).rejects.toThrow();
    });
  });

  describe('Date Normalization', () => {
    it('should normalize ISO date format', async () => {
      const eventData = { ...validEventData, date: '2025-12-15T10:30:00.000Z' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.date).toBe('2025-12-15');
    });

    it('should normalize date from timestamp', async () => {
      const eventData = { ...validEventData, date: new Date('2025-12-15').toISOString() };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.date).toBe('2025-12-15');
    });

    it('should accept simple YYYY-MM-DD format', async () => {
      const eventData = { ...validEventData, date: '2025-12-15' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.date).toBe('2025-12-15');
    });

    it('should fail validation for invalid date format', async () => {
      const eventData = { ...validEventData, date: 'invalid-date' };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('Invalid date format');
    });

    it('should fail validation for empty date string', async () => {
      const eventData = { ...validEventData, date: '' };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });

    it('should normalize date with different formats', async () => {
      const eventData = { ...validEventData, date: '12/15/2025' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  describe('Time Normalization', () => {
    it('should normalize 24-hour time format', async () => {
      const eventData = { ...validEventData, time: '14:30' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('14:30');
    });

    it('should normalize time without minutes', async () => {
      const eventData = { ...validEventData, time: '9' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('09:00');
    });

    it('should normalize AM time', async () => {
      const eventData = { ...validEventData, time: '9:30am' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('09:30');
    });

    it('should normalize PM time', async () => {
      const eventData = { ...validEventData, time: '2:30pm' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('14:30');
    });

    it('should normalize 12am as midnight', async () => {
      const eventData = { ...validEventData, time: '12am' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('00:00');
    });

    it('should normalize 12pm as noon', async () => {
      const eventData = { ...validEventData, time: '12pm' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('12:00');
    });

    it('should handle 1am correctly', async () => {
      const eventData = { ...validEventData, time: '1am' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('01:00');
    });

    it('should handle 11pm correctly', async () => {
      const eventData = { ...validEventData, time: '11pm' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('23:00');
    });

    it('should handle time with uppercase AM/PM', async () => {
      const eventData = { ...validEventData, time: '9:30 AM' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('09:30');
    });

    it('should pad single-digit hours', async () => {
      const eventData = { ...validEventData, time: '9:00' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('09:00');
    });

    it('should fail validation for invalid time format', async () => {
      const eventData = { ...validEventData, time: 'invalid-time' };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('Invalid time format');
    });

    it('should fail validation for out-of-range hours', async () => {
      const eventData = { ...validEventData, time: '25:00' };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('Invalid time value');
    });

    it('should fail validation for out-of-range minutes', async () => {
      const eventData = { ...validEventData, time: '10:65' };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('Invalid time value');
    });

    it('should fail validation for empty time string', async () => {
      const eventData = { ...validEventData, time: '' };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });
  });

  describe('Agenda Validation', () => {
    it('should accept valid agenda array', async () => {
      const eventData = { ...validEventData, agenda: ['Item 1', 'Item 2', 'Item 3'] };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.agenda).toEqual(['Item 1', 'Item 2', 'Item 3']);
    });

    it('should fail validation for empty agenda array', async () => {
      const eventData = { ...validEventData, agenda: [] };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('Agenda must contain at least one non-empty string');
    });

    it('should fail validation for agenda with empty strings', async () => {
      const eventData = { ...validEventData, agenda: ['Item 1', '', 'Item 3'] };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('Agenda must contain at least one non-empty string');
    });

    it('should fail validation for agenda with only whitespace', async () => {
      const eventData = { ...validEventData, agenda: ['Item 1', '   ', 'Item 3'] };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('Agenda must contain at least one non-empty string');
    });

    it('should fail validation for non-array agenda', async () => {
      const eventData = { ...validEventData, agenda: 'not an array' as any };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail validation for agenda with non-string items', async () => {
      const eventData = { ...validEventData, agenda: ['Item 1', 123, 'Item 3'] as any };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });
  });

  describe('Tags Validation', () => {
    it('should accept valid tags array', async () => {
      const eventData = { ...validEventData, tags: ['tech', 'ai', 'conference'] };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.tags).toEqual(['tech', 'ai', 'conference']);
    });

    it('should fail validation for empty tags array', async () => {
      const eventData = { ...validEventData, tags: [] };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('Tags must contain at least one non-empty string');
    });

    it('should fail validation for tags with empty strings', async () => {
      const eventData = { ...validEventData, tags: ['tech', '', 'ai'] };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('Tags must contain at least one non-empty string');
    });

    it('should fail validation for tags with only whitespace', async () => {
      const eventData = { ...validEventData, tags: ['tech', '   ', 'ai'] };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('Tags must contain at least one non-empty string');
    });

    it('should fail validation for non-array tags', async () => {
      const eventData = { ...validEventData, tags: 'not an array' as any };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });

    it('should fail validation for tags with non-string items', async () => {
      const eventData = { ...validEventData, tags: ['tech', 456, 'ai'] as any };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow();
    });
  });

  describe('Mode Validation', () => {
    it('should accept "online" mode', async () => {
      const eventData = { ...validEventData, mode: 'online' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.mode).toBe('online');
    });

    it('should accept "offline" mode', async () => {
      const eventData = { ...validEventData, mode: 'offline' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.mode).toBe('offline');
    });

    it('should accept "hybrid" mode', async () => {
      const eventData = { ...validEventData, mode: 'hybrid' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.mode).toBe('hybrid');
    });

    it('should accept custom mode strings', async () => {
      const eventData = { ...validEventData, mode: 'virtual-reality' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.mode).toBe('virtual-reality');
    });

    it('should trim mode field', async () => {
      const eventData = { ...validEventData, mode: '  online  ' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.mode).toBe('online');
    });
  });

  describe('Pre-save Hook Validation', () => {
    it('should reject event with empty title after trim', async () => {
      const eventData = { ...validEventData, title: '   ' };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('title is required and must be a non-empty string');
    });

    it('should reject event with empty description after trim', async () => {
      const eventData = { ...validEventData, description: '   ' };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('description is required and must be a non-empty string');
    });

    it('should reject event with empty overview after trim', async () => {
      const eventData = { ...validEventData, overview: '   ' };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('overview is required and must be a non-empty string');
    });

    it('should reject event with empty image after trim', async () => {
      const eventData = { ...validEventData, image: '   ' };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('image is required and must be a non-empty string');
    });

    it('should reject event with empty venue after trim', async () => {
      const eventData = { ...validEventData, venue: '   ' };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('venue is required and must be a non-empty string');
    });

    it('should reject event with empty location after trim', async () => {
      const eventData = { ...validEventData, location: '   ' };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('location is required and must be a non-empty string');
    });

    it('should reject event with empty mode after trim', async () => {
      const eventData = { ...validEventData, mode: '   ' };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('mode is required and must be a non-empty string');
    });

    it('should reject event with empty audience after trim', async () => {
      const eventData = { ...validEventData, audience: '   ' };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('audience is required and must be a non-empty string');
    });

    it('should reject event with empty organizer after trim', async () => {
      const eventData = { ...validEventData, organizer: '   ' };
      const event = new Event(eventData);
      await expect(event.save()).rejects.toThrow('organizer is required and must be a non-empty string');
    });
  });

  describe('Timestamps', () => {
    it('should automatically add createdAt timestamp', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();
      expect(savedEvent.createdAt).toBeDefined();
      expect(savedEvent.createdAt).toBeInstanceOf(Date);
    });

    it('should automatically add updatedAt timestamp', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();
      expect(savedEvent.updatedAt).toBeDefined();
      expect(savedEvent.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt on modification', async () => {
      const event = new Event(validEventData);
      const savedEvent = await event.save();
      const originalUpdatedAt = savedEvent.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 10));

      savedEvent.description = 'Updated description';
      const updatedEvent = await savedEvent.save();

      expect(updatedEvent.updatedAt).toBeDefined();
      expect(updatedEvent.updatedAt!.getTime()).toBeGreaterThan(originalUpdatedAt!.getTime());
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long strings within limits', async () => {
      const longString = 'A'.repeat(1000);
      const eventData = {
        ...validEventData,
        description: longString,
      };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.description).toBe(longString);
    });

    it('should handle multiple events with different titles', async () => {
      const event1 = new Event({ ...validEventData, title: 'Event One' });
      const event2 = new Event({ ...validEventData, title: 'Event Two' });

      const saved1 = await event1.save();
      const saved2 = await event2.save();

      expect(saved1.slug).toBe('event-one');
      expect(saved2.slug).toBe('event-two');
    });

    it('should handle agenda with single item', async () => {
      const eventData = { ...validEventData, agenda: ['Single Item'] };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.agenda).toEqual(['Single Item']);
    });

    it('should handle tags with single item', async () => {
      const eventData = { ...validEventData, tags: ['single-tag'] };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.tags).toEqual(['single-tag']);
    });

    it('should handle special characters in organizer field', async () => {
      const eventData = { ...validEventData, organizer: 'O\'Reilly Media & Co.' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.organizer).toBe('O\'Reilly Media & Co.');
    });

    it('should handle URL with query parameters in image field', async () => {
      const eventData = { ...validEventData, image: 'https://example.com/image.jpg?size=large&quality=high' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.image).toBe('https://example.com/image.jpg?size=large&quality=high');
    });

    it('should handle location with special characters', async () => {
      const eventData = { ...validEventData, location: 'São Paulo, Brazil' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.location).toBe('São Paulo, Brazil');
    });

    it('should handle midnight time edge case', async () => {
      const eventData = { ...validEventData, time: '00:00' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('00:00');
    });

    it('should handle end of day time edge case', async () => {
      const eventData = { ...validEventData, time: '23:59' };
      const event = new Event(eventData);
      const savedEvent = await event.save();
      expect(savedEvent.time).toBe('23:59');
    });
  });
});