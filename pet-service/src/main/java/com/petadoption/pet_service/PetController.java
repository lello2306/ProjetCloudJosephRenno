package com.petadoption.pet_service;

import org.springframework.web.bind.annotation.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

@RestController
@RequestMapping("/api/pets")
@CrossOrigin(origins = "*")
public class PetController {

    private final Map<Long, Pet> pets = new HashMap<>();
    private final AtomicLong idCounter = new AtomicLong(1);

    public PetController() {
        addPet(new Pet(null, "Buddy", "dog", 3, true));
        addPet(new Pet(null, "Whiskers", "cat", 2, true));
        addPet(new Pet(null, "Coco", "rabbit", 1, true));
    }

    @GetMapping
    public List<Pet> getAllPets() {
        return new ArrayList<>(pets.values());
    }

    @GetMapping("/{id}")
    public Pet getPet(@PathVariable Long id) {
        return pets.get(id);
    }

    @PostMapping
    public Pet addPet(@RequestBody Pet pet) {
        long id = idCounter.getAndIncrement();
        pet.setId(id);
        pets.put(id, pet);
        return pet;
    }

    @PutMapping("/{id}/adopt")
    public Pet markAdopted(@PathVariable Long id) {
        Pet pet = pets.get(id);
        if (pet != null) {
            pet.setAvailable(false);
        }
        return pet;
    }
}
