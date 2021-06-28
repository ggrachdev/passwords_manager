<?php

namespace App\Entity;

use App\Repository\ProjectRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass=ProjectRepository::class)
 */
class Project
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
    private $name;

    /**
     * @ORM\OneToMany(targetEntity=ProjectFolder::class, mappedBy="project", orphanRemoval=true)
     */
    private $project;

    public function __construct()
    {
        $this->project = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection|ProjectFolder[]
     */
    public function getProject(): Collection
    {
        return $this->project;
    }

    public function addProject(ProjectFolder $project): self
    {
        if (!$this->project->contains($project)) {
            $this->project[] = $project;
            $project->setProject($this);
        }

        return $this;
    }

    public function removeProject(ProjectFolder $project): self
    {
        if ($this->project->removeElement($project)) {
            // set the owning side to null (unless already changed)
            if ($project->getProject() === $this) {
                $project->setProject(null);
            }
        }

        return $this;
    }
}
