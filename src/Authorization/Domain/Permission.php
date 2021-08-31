<?php

namespace App\Authorization\Domain;

use App\Authorization\Infrastructure\Repository\PermissionRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=PermissionRepository::class)
 */
class Permission
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
    private $permission;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $value;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $for_id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $for_context;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $target_id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $target_context;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getPermission(): ?string
    {
        return $this->permission;
    }

    public function setPermission(string $permission): self
    {
        $this->permission = $permission;

        return $this;
    }

    public function getValue(): ?string
    {
        return $this->value;
    }

    public function setValue(string $value): self
    {
        $this->value = $value;

        return $this;
    }

    public function getForId(): ?string
    {
        return $this->for_id;
    }

    public function setForId(string $for_id): self
    {
        $this->for_id = $for_id;

        return $this;
    }

    public function getForContext(): ?string
    {
        return $this->for_context;
    }

    public function setForContext(string $for_context): self
    {
        $this->for_context = $for_context;

        return $this;
    }

    public function getTargetId(): ?string
    {
        return $this->target_id;
    }

    public function setTargetId(?string $target_id): self
    {
        $this->target_id = $target_id;

        return $this;
    }

    public function getTargetContext(): ?string
    {
        return $this->target_context;
    }

    public function setTargetContext(string $target_context): self
    {
        $this->target_context = $target_context;

        return $this;
    }
}
