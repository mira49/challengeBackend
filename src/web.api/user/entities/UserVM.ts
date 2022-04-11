import User from 'src/domain/models/user';
export type ConsentObject = { id: string; enabled: boolean };

export default class UserVM {
  id: string;

  email: string;

  consents: ConsentObject[];

  static getUserVM(user: User, consents: ConsentObject[]): UserVM {
    const userVM = new UserVM();
    userVM.id = user.id;
    userVM.email = user.email;
    userVM.consents = consents;
    return userVM;
  }
}
