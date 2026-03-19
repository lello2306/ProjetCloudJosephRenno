package com.petadoption.pet_service;

public class Pet {
    private Long id;
    private String name;
    private String species; // "dog", "cat", "rabbit"...
    private int age;
    private boolean available;

    // Default constructor (needed for JSON deserialization)
    public Pet() {}

    public Pet(Long id, String name, String species, int age, boolean available) {
        this.id = id;
        this.name = name;
        this.species = species;
        this.age = age;
        this.available = available;
    }

    // Getters and setters for every field
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSpecies() { return species; }
    public void setSpecies(String species) { this.species = species; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }
}