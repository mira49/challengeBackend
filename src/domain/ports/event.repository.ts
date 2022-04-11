import Event from "../models/event";

export interface EventRepository {
  createEvent(event: Event): Promise<Event>;

  findEventByUserId(userId: string): Promise<Event[]>;
}
