package com.bookshop.configs;

import com.bookshop.entities.User;
import com.bookshop.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class AdminDataLoader implements CommandLineRunner {

    @Autowired
    private AuthService authService;

    @Override
    public void run(String... args) throws Exception {
        // Kiểm tra xem admin đã tồn tại chưa
        if (authService.findByUsername("isKHOA") == null) {
            authService.register("isKHOA", "isKHOA", "ADMIN");
        }
    }
}
