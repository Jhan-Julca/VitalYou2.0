package com.example.vitalyou.repository;

import com.example.vitalyou.model.Food;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodRepository extends JpaRepository<Food, Long> {
    
    @Query("SELECT f FROM Food f WHERE LOWER(f.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Food> findByNameContainingIgnoreCase(@Param("query") String query);
    
    List<Food> findByOrderByNameAsc();
}
