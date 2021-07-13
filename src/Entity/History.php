<?php

namespace App\Entity;

use App\Repository\HistoryRepository;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=HistoryRepository::class)
 * @ORM\HasLifecycleCallbacks()
 */
class History {

    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=255)
     */
    private $action;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $subject_id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $subject_context;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $object_id;

    /**
     * @ORM\Column(type="string", length=255, nullable=true)
     */
    private $object_context;

    /**
     * @ORM\Column(type="array", nullable=true)
     */
    private $meta = [];

    /**
     * @ORM\Column(type="datetime")
     */
    private $created_at;

    public function getId(): ?int {
        return $this->id;
    }

    public function getAction(): ?string {
        return $this->action;
    }

    public function setAction(string $action): self {
        $this->action = $action;

        return $this;
    }

    public function getSubjectId(): ?string {
        return $this->subject_id;
    }

    public function setSubjectId(?string $subject_id): self {
        $this->subject_id = $subject_id;

        return $this;
    }

    public function getSubjectContext(): ?string {
        return $this->subject_context;
    }

    public function setSubjectContext(?string $subject_context): self {
        $this->subject_context = $subject_context;

        return $this;
    }

    public function getObjectId(): ?string {
        return $this->object_id;
    }

    public function setObjectId(?string $object_id): self {
        $this->object_id = $object_id;

        return $this;
    }

    public function getObjectContext(): ?string {
        return $this->object_context;
    }

    public function setObjectContext(?string $object_context): self {
        $this->object_context = $object_context;

        return $this;
    }

    public function getMeta(): ?array {
        return $this->meta;
    }

    public function setMeta(?array $meta): self {
        $this->meta = $meta;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeInterface $created_at): self {
        $this->created_at = $created_at;

        return $this;
    }

    /**
     * @ORM\PrePersist
     * @ORM\PreUpdate
     */
    public function updatedTimestamps(): void {
        if ($this->getCreatedAt() === null) {
            $this->setCreatedAt(new \DateTime('now'));
        }
    }

}
