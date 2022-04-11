import { Injectable, Inject } from "@nestjs/common";
import { UserRepository } from "src/domain/ports/user.repository";
import Event from "../models/event";
import { EventRepository } from "../ports/event.repository";

@Injectable()
export default class EventService {
  constructor(
    @Inject("UserRepository") private userRepository: UserRepository,
    @Inject("EventRepository") private eventRepository: EventRepository
  ) {}

  /**
   * Create consent change event
   * @param userId
   * @param emailNotifications
   * @param smsNotifications
   * @returns
   */
  public async createEvent(
    userId: string,
    emailNotifications: boolean,
    smsNotifications: boolean
  ): Promise<Event> {
    await this.userRepository.findUserById(userId);
    const event = new Event(userId, emailNotifications, smsNotifications);
    return this.eventRepository.createEvent(event);
  }
}
