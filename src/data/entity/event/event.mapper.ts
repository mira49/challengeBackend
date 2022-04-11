import Event from "../../../domain/models/event";
import { EventEntity } from "./event.entity";

export default class EventMapper {
  /**
   * Get Event from EventEntity
   * @param eventEntity
   * @returns
   */
  public static toDomain(eventEntity: EventEntity): Event {
    return eventEntity
      ? new Event(
          eventEntity.id,
          eventEntity.emailNotifications,
          eventEntity.smsNotifications,
          eventEntity.userId,
          new Date(eventEntity.createAt)
        )
      : null;
  }

  /**
   * Get Event[] from EventEntity[]
   * @param eventEntity
   * @returns
   */
  public static toDomains(eventEntities: EventEntity[]): Event[] {
    const events = new Array<Event>();
    eventEntities.forEach(eventEntity => {
      const event = this.toDomain(eventEntity);
      events.push(event);
    });
    return events;
  }
}
