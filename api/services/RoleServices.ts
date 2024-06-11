import Role from "../models/Role";

export default class RoleService {
  static async getRoles() {
    try {
      const roles = await Role.find();
      return { error: false, data: roles };
    } catch (error) {
      console.log(error);
      return { error: true, data: error };
    }
  }
}
