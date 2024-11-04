package com.bookshop.repositories;

import com.bookshop.entities.CartItem;
import com.bookshop.entities.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CartRepository extends JpaRepository<CartItem, Long> {
    CartItem findByProduct(Product product);

    List<CartItem> findByProductId(Long productId);
}

