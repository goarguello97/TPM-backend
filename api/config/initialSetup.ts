import Photo from "../models/Photo";
import Role from "../models/Role";
import dotenv from "dotenv";

dotenv.config();

const AVATAR = process.env.AVATAR as string;

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

const createAvatarDefault = async () => {
  try {
    const count = await Photo.countDocuments();
    if (count > 0) return;
    await new Photo({
      title: "default",
      imageUrl: AVATAR,
    }).save();
  } catch (error) {
    console.log(error);
  }
};

export { createRoles, createAvatarDefault };
