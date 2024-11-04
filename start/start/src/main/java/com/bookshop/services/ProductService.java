package com.bookshop.services;

import com.bookshop.entities.CartItem;
import com.bookshop.entities.Product;
import com.bookshop.repositories.CartRepository;
import com.bookshop.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartRepository cartRepository;

    public Page<Product> getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAll(pageable);
    }

    public Page<Product> getProductsSortedByPriceAsc(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAllByOrderByPriceAsc(pageable);
    }

    public Page<Product> getProductsSortedByPriceDesc(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findAllByOrderByPriceDesc(pageable);
    }

    public Product createProduct(Product product) {
        if (product.getQuantity() == null) {
            product.setQuantity(0);
        }
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Product updatedProduct) {
        Optional<Product> productOptional = productRepository.findById(id);
        if (productOptional.isEmpty()) {
            throw new RuntimeException("Product with ID " + id + " not found.");
        }
        Product existingProduct = productOptional.get();
        existingProduct.setName(updatedProduct.getName());
        existingProduct.setPrice(updatedProduct.getPrice());
        existingProduct.setQuantity(updatedProduct.getQuantity());
        Product savedProduct = productRepository.save(existingProduct);

        List<CartItem> cartItems = cartRepository.findByProductId(id);
        cartItems.forEach(cartItem -> {
            cartItem.setProduct(savedProduct);
            cartRepository.save(cartItem);
        });
        return savedProduct;
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product with ID " + id + " not found.");
        }
        List<CartItem> cartItems = cartRepository.findByProductId(id);
        if (!cartItems.isEmpty()) {
            cartRepository.deleteAll(cartItems);
        }
        productRepository.deleteById(id);
    }

    @Transactional
    public void reduceProductQuantity(Long productId, int quantity) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        if (product.getQuantity() < quantity) {
            throw new RuntimeException("Not enough stock for product: " + product.getName());
        }
        product.setQuantity(product.getQuantity() - quantity);
        productRepository.save(product);
    }

    public Product findById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product with ID " + id + " not found."));
    }

    public Product save(Product product) {
        return productRepository.save(product);
    }

    public Page<Product> searchBooks(String query, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return productRepository.findByNameContainingIgnoreCase(query, pageable);
    }
}
