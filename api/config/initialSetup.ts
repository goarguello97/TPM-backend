import Role from "../models/Role";

const createRoles = async () => {
  try {
    const count = await Role.countDocuments();
    if (count > 0) return;
    await Promise.all([
      new Role({ role: "MENTEE" }).save(),
      new Role({ role: "MENTOR" }).save(),
      new Role({ role: "ADMIN" }).save(),
    ]);
  } catch (error) {
    console.log(error);
  }
};

export default createRoles;
