import User from "../models/User";

export default class UserServices {
  static async getUsers() {
    try {
      const response = await User.find();
      return { error: false, data: response };
    } catch (error) {
      console.log(error);
      return { error: true, data: error };
    }
  }

  static async addUser(user: any) {
    try {
      const response = await User.create(user);
      return { error: false, data: response };
    } catch (error) {
      console.log(error);
      return { error: true, data: error };
    }
  }
}
