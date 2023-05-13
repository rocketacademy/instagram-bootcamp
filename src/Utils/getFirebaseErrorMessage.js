export default function getFirebaseErrorMessage(error) {
  switch (error.code) {
    case "auth/email-already-in-use":
      return "The email address is already in use.";
    case "auth/invalid-email":
      return "The email address is invalid.";
    case "auth/weak-password":
      return "The password is too weak.";
    case "auth/user-not-found":
      return "There is no user record corresponding to this identifier.";
    case "auth/wrong-password":
      return "The password is invalid.";
    case "auth/too-many-requests":
      return "Too many unsuccessful login attempts. Please try again later.";
    case "auth/network-request-failed":
      return "A network error has occurred. Please try again later.";
    default:
      return error.message;
  }
}
