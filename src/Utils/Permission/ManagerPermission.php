<?php

namespace App\Utils\Permission;

use App\Entity\Permission;
use Doctrine\ORM\EntityManagerInterface;

class ManagerPermission {

    private $entityManager;
    private $permissionRepository;

    public function __construct(EntityManagerInterface $em) {
        $this->entityManager = $em;
        $this->permissionRepository = $em->getRepository(Permission::class);
    }

    public function getPermissionRepository() {
        return $this->permissionRepository;
    }

    public function addPermissionForFolder(int $folderId, int $userId, string $permission, $value = "true") {

        $permissionEntity = new Permission();
        $permissionEntity->setForContext('USER');
        $permissionEntity->setForId($userId);
        $permissionEntity->setPermission($permission);
        $permissionEntity->setValue($value);
        $permissionEntity->setTargetContext('FOLDER');
        $permissionEntity->setTargetId($folderId);

        if (!$this->hasPermission($permission, $value, $userId, 'USER', $folderId, 'FOLDER')) {
            $this->entityManager->persist($permissionEntity);
            $this->entityManager->flush();
        }

        return $permissionEntity;
    }

    public function removePermissionForFolder(int $folderId, int $userId, string $permission, $value = "true") {

        $removed = false;
        $permissionEntity = $this->hasPermission($permission, $value, $userId, 'USER', $folderId, 'FOLDER');

        if ($permission) {
            $this->entityManager->remove($permissionEntity);
            $this->entityManager->flush();
            $removed = true;
        }

        return $removed;
    }

    public function addPermissionForRole($role, string $permission, $value = "true") {

        $permissionEntity = new Permission();
        $permissionEntity->setForContext('ROLE');
        $permissionEntity->setForId($role);
        $permissionEntity->setPermission($permission);
        $permissionEntity->setValue($value);
        $permissionEntity->setTargetContext('GLOBAL');
        $permissionEntity->setTargetId(null);

        if (!$this->hasPermission($permission, $value, $role, 'USER', null, 'FOLDER')) {
            $this->entityManager->persist($permissionEntity);
            $this->entityManager->flush();
        }

        return $permissionEntity;
    }

    public function removePermissionForRole($role, string $permission, $value = "true") {

        $removed = false;
        $permissionEntity = $this->hasPermission($permission, $value, $role, 'USER', null, 'FOLDER');

        if ($permission) {
            $this->entityManager->remove($permissionEntity);
            $this->entityManager->flush();
            $removed = true;
        }

        return $removed;
    }

    public function addPermissionForProject(int $projectId, int $userId, string $permission, $value = "true") {

        $permissionEntity = new Permission();
        $permissionEntity->setForContext('USER');
        $permissionEntity->setForId($userId);
        $permissionEntity->setPermission($permission);
        $permissionEntity->setValue($value);
        $permissionEntity->setTargetContext('PROJECT');
        $permissionEntity->setTargetId($projectId);

        if (!$this->hasPermission($permission, $value, $userId, 'USER', $projectId, 'FOLDER')) {
            $this->entityManager->persist($permissionEntity);
            $this->entityManager->flush();
        }

        return $permissionEntity;
    }

    public function removePermissionForProject(int $projectId, int $userId, string $permission, $value = "true") {

        $removed = false;
        $permissionEntity = $this->hasPermission($permission, $value, $userId, 'USER', $projectId, 'FOLDER');

        if ($permission) {
            $this->entityManager->remove($permissionEntity);
            $this->entityManager->flush();
            $removed = true;
        }

        return $removed;
    }

    public function removeAllForProject(int $projectId) {
        $removed = false;
        
        $entities = $this->getPermissionRepository()->findFromProject($projectId);
        
        if(!empty($entities)) {
            foreach ($entities as $entity) {
                $this->entityManager->remove($entity);
            }
            $this->entityManager->flush();
            $removed = true;
        }
        
        return $removed;
    }

    public function removeAllForRole(string $roleId) {
        $removed = false;
        
        $entities = $this->getPermissionRepository()->findFromRole($roleId);
        
        if(!empty($entities)) {
            foreach ($entities as $entity) {
                $this->entityManager->remove($entity);
            }
            $this->entityManager->flush();
            $removed = true;
        }
        
        return $removed;
    }

    public function removeAllForFolder(int $folderId) {
        $removed = false;
        
        $entities = $this->getPermissionRepository()->findFromFolder($folderId);
        
        if(!empty($entities)) {
            foreach ($entities as $entity) {
                $this->entityManager->remove($entity);
            }
            $this->entityManager->flush();
            $removed = true;
        }
        
        return $removed;
    }

    public function removeAllForUser(int $userId) {
        $removed = false;
        
        $entities = $this->getPermissionRepository()->findFromUserWithoutRoles($userId);
        
        if(!empty($entities)) {
            foreach ($entities as $entity) {
                $this->entityManager->remove($entity);
            }
            $this->entityManager->flush();
            $removed = true;
        }
        
        return $removed;
    }

    public function hasPermission($permission, $value, $forId, $forContext, $targetId, $targetContext) {
        return $this->getPermissionRepository()->findBy([
                'permission' => $permission,
                'value' => $value,
                'for_id' => $forId,
                'for_context' => $forContext,
                'target_id' => $targetId,
                'target_context' => $targetContext
        ]);
    }

}
