package dtu.doan.service;

public interface AccountService {
    void changePassword(String username, String oldPassword, String newPassword, String confirmPassword);

}
