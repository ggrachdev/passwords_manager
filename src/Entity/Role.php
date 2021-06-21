<?php

namespace App\Entity;

use App\Repository\RoleRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=RoleRepository::class)
 */
class Role
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $role_key;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $role_name;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $role_color;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRoleKey(): ?string
    {
        return $this->role_key;
    }

    public function setRoleKey(string $role_key): self
    {
        $this->role_key = $role_key;

        return $this;
    }

    public function getRoleName(): ?string
    {
        return $this->role_name;
    }

    public function setRoleName(string $role_name): self
    {
        $this->role_name = $role_name;

        return $this;
    }

    public function getRoleColor(): ?string
    {
        return $this->role_color;
    }

    public function setRoleColor(string $role_color): self
    {
        $this->role_color = $role_color;

        return $this;
    }
}
