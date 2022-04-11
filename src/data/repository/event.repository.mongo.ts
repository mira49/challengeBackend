import { InjectModel } from "@nestjs/mongoose";
import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { EventRepository } from "src/domain/ports/event.repository";
import Event from "src/domain/models/event";
import { EventEntity } from "../entity/event/event.entity";
import EventMapper from "../entity/event/event.mapper";

@Injectable()
export default class EventRepositoryMongo implements EventRepository {
  constructor(
    @InjectModel("Event") private readonly eventModel: Model<EventEntity>
  ) {}

  public async createEvent(eventTocreate: Event): Promise<Event> {
    const eventCreated = new this.eventModel(eventTocreate);
    return EventMapper.toDomain(await eventCreated.save());
  }
}
