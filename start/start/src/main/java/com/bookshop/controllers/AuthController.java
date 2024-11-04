package com.bookshop.controllers;

import com.bookshop.entities.User;
import com.bookshop.services.AuthService;
import com.bookshop.services.MyUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        boolean success = authService.login(user.getUsername(), user.getPassword());
        if (success) {
            MyUserDetails authenticatedUser = authService.getAuthenticatedUser();
            // Kiểm tra xem vai trò của người dùng có phải là admin không
            boolean isAdmin = authenticatedUser.getAuthorities().stream()
                    .anyMatch(role -> role.getAuthority().equals("ROLE_ADMIN"));

            // Trả về thông tin thành công và isAdmin cho frontend
            return ResponseEntity.status(HttpStatus.OK)
                    .body(Map.of("success", true, "isAdmin", isAdmin));
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "Invalid credentials"));
        }
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User registeredUser = authService.register(user.getUsername(), user.getPassword(), user.getRole());
        if (registeredUser != null) {
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("success", true, "user", registeredUser));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "User already exists"));
        }
    }
}
