import Event from "src/domain/models/event";
import { ConsentObject } from "src/web.api/user/entities/UserVM";

export enum ConsentType {
  email = "email_notifications",
  sms = "sms_notifications"
}
export default class EventVM {
  user: { id: string };

  consents: ConsentObject[];

  static getEventVM(userId: string, events: Event[]): EventVM {
    const eventVM = new EventVM();
    eventVM.user = { id: userId };
    eventVM.consents = this.getConsents(events);
    return eventVM;
  }

  static getConsents(events: Event[]): ConsentObject[] {
    const consents = [];
    events.map((event, index) => {
      if (event.emailNotifications)
        consents.push({
          id: ConsentType.email,
          enabled: events.length - 1 === index
        });
      if (event.smsNotifications)
        consents.push({
          id: ConsentType.sms,
          enabled: events.length - 1 === index
        });
      return consents;
    });
    return consents;
  }
}
