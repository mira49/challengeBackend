import { Body, Controller, Post } from "@nestjs/common";
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
    await this.evenService.createEvent(
      createConsentsReq.userId,
      createConsentsReq.emailNotifications,
      createConsentsReq.smsNotifications
    );
    return EventVM.getEventVM(createConsentsReq.userId, []);
  }
}
