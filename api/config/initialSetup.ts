import Photo from "../models/Photo";
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

const createAvatarDefault = async () => {
  try {
    const count = await Photo.countDocuments();
    if (count > 0) return;
    await new Photo({
      title: "default",
      imageUrl:
        "https://firebasestorage.googleapis.com/v0/b/the-perfect-mentor-64369.appspot.com/o/avatars%2Fd1e317d1-de86-4c01-9af9-f7353b9d1629.jpg?alt=media&token=0207e6bf-6c4d-4295-83ed-abf0a763d783",
    }).save();
  } catch (error) {
    console.log(error);
  }
};

export { createRoles, createAvatarDefault };
