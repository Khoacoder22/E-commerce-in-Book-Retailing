package com.bookshop.controllers;

import com.bookshop.entities.Product;
import com.bookshop.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<Page<Product>> getProducts(
            @RequestParam(value = "sort", required = false) String sort,
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {

        Page<Product> products;

        if (query != null && !query.isEmpty()) {
            products = productService.searchBooks(query, page, size);
        } else if ("asc".equalsIgnoreCase(sort)) {
            products = productService.getProductsSortedByPriceAsc(page, size);
        } else if ("desc".equalsIgnoreCase(sort)) {
            products = productService.getProductsSortedByPriceDesc(page, size);
        } else {
            products = productService.getAllProducts(page, size);
        }

        return ResponseEntity.ok(products);
    }

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        Product savedProduct = productService.createProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> editProduct(
            @PathVariable Long id,
            @RequestBody Product updatedProduct) {
        try {
            Product savedProduct = productService.updateProduct(id, updatedProduct);
            return ResponseEntity.ok(savedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body("Product deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Product not found");
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Product>> searchBooks(
            @RequestParam("query") String query,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "5") int size) {
        Page<Product> products = productService.searchBooks(query, page, size);
        return ResponseEntity.ok(products);
    }

    @PostMapping("/{id}/reduce")
    public ResponseEntity<String> reduceProductQuantity(
            @PathVariable Long id,
            @RequestParam int quantity) {
        System.out.println("Received request to reduce quantity for product ID: " + id + " by " + quantity);
        try {
            productService.reduceProductQuantity(id, quantity);
            System.out.println("Quantity reduced successfully for product ID: " + id);
            return ResponseEntity.ok("Quantity reduced successfully");
        } catch (RuntimeException e) {
            System.err.println("Error reducing quantity for product ID: " + id + ". Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}
