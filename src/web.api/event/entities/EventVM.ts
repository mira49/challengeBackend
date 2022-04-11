import Event from "src/domain/models/event";
import { ConsentObject } from "src/web.api/user/entities/UserVM";

export enum ConsentType {
  email = "email_notifications",
  sms = "sms_notifications"
}
export default class EventVM {
  user: { id: string };

  consents: ConsentObject[];

  static getEventVM(userId: string, consents: ConsentObject[]): EventVM {
    const eventVM = new EventVM();
    eventVM.user = { id: userId };
    eventVM.consents = consents;
    return eventVM;
  }
}
