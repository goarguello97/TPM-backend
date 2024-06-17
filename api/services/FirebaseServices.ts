import { auth, firestoreAdmin } from "../config/firebase";
export default class FirebaseService {
  static async getUsersFirebase() {
    try {
      const listUsersResult = await auth.listUsers();
      const users = listUsersResult.users.map((userRecord) => {
        return userRecord.toJSON();
      });
      return { error: false, data: users };
    } catch (error) {
      console.log(error);
      return { error: true, data: error };
    }
  }

  static async getUserByEmail(email: string) {
    try {
      const user = await auth.getUserByEmail(email);
      if (user) {
        return true;
      }
    } catch (error) {
      return false;
    }
  }

  static async getUserByUsername(username: string) {
    try {
      const usersRef = firestoreAdmin.collection("users");
      const snapshot = await usersRef.where("username", "==", username).get();

      if (snapshot.empty) {
        return { error: false, data: false };
      }
      return { error: false, data: true };
    } catch (error) {
      console.log(error);
      return { error: true, data: error };
    }
  }

  static async addUserFirebase(
    email: string,
    username: string,
    password: string
  ) {
    try {
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: username,
      });

      await firestoreAdmin.collection("users").doc(userRecord.uid).set({
        username,
        email,
      });
      return { error: false, data: userRecord };
    } catch (error) {
      console.log(error);
      return { error: true, data: error };
    }
  }

  static async deteleAllUsers() {
    try {
      const listUsers = await auth.listUsers();

      for (const user of listUsers.users) {
        await auth.deleteUser(user.uid);
      }

      const listUserCollection = firestoreAdmin.collection("users");
      const snapshot = await listUserCollection.get();

      for (const doc of snapshot.docs) {
        await doc.ref.delete();
      }
      return { error: false, data: true };
    } catch (error) {
      console.log(error);
      return { error: true, data: error };
    }
  }
}
