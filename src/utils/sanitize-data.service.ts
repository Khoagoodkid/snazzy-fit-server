export class SanitizeDataService {
    static sanitizeUser(user: any) {
       const { password, ...userData } = user.toObject();
       return userData;
    }
}
