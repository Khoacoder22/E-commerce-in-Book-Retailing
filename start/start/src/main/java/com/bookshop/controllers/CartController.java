package com.bookshop.controllers;

import com.bookshop.entities.CartItem;
import com.bookshop.services.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCart() {
        List<CartItem> cartItems = cartService.getCartItems();
        return ResponseEntity.status(HttpStatus.OK).body(cartItems);
    }

    @PostMapping
    public ResponseEntity<List<CartItem>> addToCart(@RequestBody CartItem cartItem) {
        // Kiểm tra nếu product là null
        if (cartItem.getProduct() == null) {
            throw new IllegalArgumentException("Product cannot be null");
        }

        cartService.addToCart(cartItem.getProduct().getId(), cartItem.getQuantity());
        List<CartItem> cartItems = cartService.getCartItems();
        return ResponseEntity.status(HttpStatus.OK).body(cartItems);
    }

    @PutMapping("/{id}")
    public ResponseEntity<List<CartItem>> editCart(@PathVariable Long id, @RequestBody CartItem updatedCart) {
        cartService.updateCartItem(id, updatedCart);
        List<CartItem> cartItems = cartService.getCartItems();
        return ResponseEntity.status(HttpStatus.OK).body(cartItems);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<List<CartItem>> deleteFromCart(@PathVariable Long id) {
        cartService.deleteCartItem(id);
        List<CartItem> cartItems = cartService.getCartItems();
        return ResponseEntity.status(HttpStatus.OK).body(cartItems);
    }

    @DeleteMapping
    public ResponseEntity<List<CartItem>> clearCart() {
        cartService.clearCart();
        List<CartItem> cartItems = cartService.getCartItems();
        return ResponseEntity.status(HttpStatus.OK).body(cartItems);
    }
}
