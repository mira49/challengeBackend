import { Body, Controller, Logger, Post } from "@nestjs/common";
import EventService from "../../domain/services/event.service";
import CreateConsentsReq from "./entities/CreateConsentsReq";
import EventVM from "./entities/EventVM";

@Controller("api/v1/events")
export default class EventController {
  constructor(private readonly evenService: EventService) {}

  @Post()
  async createEvent(
    @Body() createConsentsReq: CreateConsentsReq
  ): Promise<EventVM> {
    Logger.log("Create event for user with id : " + createConsentsReq.userId);
    await this.evenService.createEvent(
      createConsentsReq.userId,
      createConsentsReq.emailNotifications,
      createConsentsReq.smsNotifications
    );
    const events = await this.evenService.getEventsByUserId(
      createConsentsReq.userId
    );
    return EventVM.getEventVM(createConsentsReq.userId, events);
  }
}
