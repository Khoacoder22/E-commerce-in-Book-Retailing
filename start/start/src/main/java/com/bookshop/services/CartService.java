package com.bookshop.services;

import com.bookshop.entities.CartItem;
import com.bookshop.entities.Product;
import com.bookshop.repositories.CartRepository;
import com.bookshop.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private ProductRepository productRepository;

    private static final Logger logger = Logger.getLogger(CartService.class.getName());

    // Lấy tất cả các mặt hàng trong giỏ hàng
    public List<CartItem> getCartItems() {
        return cartRepository.findAll();
    }

    // Thêm sản phẩm vào giỏ hàng
    public void addToCart(Long productId, int quantity) {
        logger.info("Adding product with ID: " + productId + " to the cart with quantity: " + quantity);

        // Tìm product từ cơ sở dữ liệu
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + productId));

        // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
        CartItem existingCartItem = cartRepository.findByProduct(product);

        if (existingCartItem != null) {
            // Nếu sản phẩm đã có trong giỏ, tăng số lượng
            existingCartItem.setQuantity(existingCartItem.getQuantity() + quantity);
            cartRepository.save(existingCartItem);
            logger.info("Updated quantity of existing product in the cart.");
        } else {
            // Nếu sản phẩm chưa có trong giỏ, tạo mới
            CartItem newCartItem = new CartItem();
            newCartItem.setProduct(product);
            newCartItem.setQuantity(quantity);
            cartRepository.save(newCartItem);
            logger.info("Added new product to the cart.");
        }
    }

    // Cập nhật số lượng sản phẩm trong giỏ hàng
    public void updateCartItem(Long id, CartItem updatedCart) {
        Optional<CartItem> optionalCartItem = cartRepository.findById(id);
        if (optionalCartItem.isPresent()) {
            CartItem cartItem = optionalCartItem.get();
            cartItem.setQuantity(updatedCart.getQuantity());
            cartRepository.save(cartItem);
            logger.info("Updated cart item with ID: " + id);
        } else {
            logger.warning("Cart item with ID: " + id + " not found.");
        }
    }

    // Xóa một mặt hàng khỏi giỏ hàng
    public void deleteCartItem(Long id) {
        if (cartRepository.existsById(id)) {
            cartRepository.deleteById(id);
            logger.info("Deleted cart item with ID: " + id);
        } else {
            logger.warning("Cart item with ID: " + id + " does not exist.");
        }
    }

    // Xóa tất cả các mặt hàng trong giỏ hàng
    public void clearCart() {
        cartRepository.deleteAll();
        logger.info("Cleared all items from the cart.");
    }
}
