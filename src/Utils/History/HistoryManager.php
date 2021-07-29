<?php

namespace App\Utils\History;

use Doctrine\ORM\EntityManagerInterface;
use App\Entity\History;
use App\Entity\User;
use App\Entity\Password;
use App\Entity\Project;
use App\Entity\ProjectFolder;
use App\Entity\Role;

class HistoryManager {

    private $entityManager;
    private $historyRepository;

    public function __construct(EntityManagerInterface $em) {
        $this->entityManager = $em;
        $this->historyRepository = $em->getRepository(History::class);
    }

    public function getEntityManager() {
        return $this->entityManager;
    }

    public function getHistoryRepository() {
        return $this->historyRepository;
    }
    
    // Roles permission
    public function logToggleProjectPermissionEvent($permission, $newValue, User $user, User $forUser, Project $project, array $meta = []) {
        
        if($newValue === true)
        {
            $newValue = "true";
        }
        else if($newValue === false)
        {
            $newValue = "false";
        }
        
        $history = new History();
        $history->setAction('toggle permission project');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectId($forUser->getId());
        $history->setObjectContext('user');
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'OBJECT_USER_NAME' => $forUser->getFullName(),
                    'PROJECT_NAME' => $project->getName(),
                    'PROJECT_ID' => $project->getId(),
                    'PERMISSION' => $permission,
                    'NEW_PERMISSION_VALUE' => $newValue
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }
    
    public function logToggleProjectFolderPermissionEvent($permission, $newValue, User $user, User $forUser, ProjectFolder $folder, array $meta = []) {
        
        if($newValue === true)
        {
            $newValue = "true";
        }
        else if($newValue === false)
        {
            $newValue = "false";
        }
        
        $history = new History();
        $history->setAction('toggle permission folder');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectId($forUser->getId());
        $history->setObjectContext('user');
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'OBJECT_USER_NAME' => $forUser->getFullName(),
                    'PROJECT_NAME' => $folder->getProject()->getName(),
                    'PROJECT_ID' => $folder->getProject()->getId(),
                    'PROJECT_FOLDER_ID' => $folder->getId(),
                    'PERMISSION' => $permission,
                    'NEW_PERMISSION_VALUE' => $newValue
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }
    
    // Roles events
    public function logAddRoleEvent(User $user, Role $role, array $meta = []) {
        $history = new History();
        $history->setAction('create');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectContext('role');
        $history->setObjectId($role->getRoleKey());
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'ROLE_NAME' => $role->getName(),
                    'ROLE_COLOR' => $role->getColor()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }

    public function logRemoveRoleEvent(User $user, Role $role, array $meta = []) {
        $history = new History();
        $history->setAction('remove');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectContext('role');
        $history->setObjectId($role->getRoleKey());
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'ROLE_NAME' => $role->getName(),
                    'ROLE_COLOR' => $role->getColor()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }

    public function logUpdateRoleEvent(User $user, Role $role, array $meta = []) {
        $history = new History();
        $history->setAction('update');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectContext('role');
        $history->setObjectId($role->getRoleKey());
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'ROLE_NAME' => $role->getName(),
                    'ROLE_COLOR' => $role->getColor()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }

    // Password Events
    public function logAddPasswordEvent(User $user, Password $password, array $meta = []) {
        $history = new History();
        $history->setAction('create');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectContext('password');
        $history->setObjectId($password->getId());
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'PROJECT_NAME' => $password->getFolder()->getProject()->getName(),
                    'FOLDER_NAME' => $password->getFolder()->getName(),
                    'FOLDER_ID' => $password->getFolder()->getId(),
                    'PROJECT_ID' => $password->getFolder()->getProject()->getId(),
                    'PASSWORD_NAME' => $password->getName()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }

    public function logUpdatePasswordEvent(User $user, Password $password, array $meta = []) {
        $history = new History();
        $history->setAction('update');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectContext('password');
        $history->setObjectId($password->getId());
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'PROJECT_NAME' => $password->getFolder()->getProject()->getName(),
                    'FOLDER_NAME' => $password->getFolder()->getName(),
                    'FOLDER_ID' => $password->getFolder()->getId(),
                    'PROJECT_ID' => $password->getFolder()->getProject()->getId(),
                    'PASSWORD_NAME' => $password->getName()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }

    public function logRemovePasswordEvent(User $user, Password $password, array $meta = []) {
        $history = new History();
        $history->setAction('remove');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectContext('password');
        $history->setObjectId($password->getId());
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'PROJECT_NAME' => $password->getFolder()->getProject()->getName(),
                    'FOLDER_NAME' => $password->getFolder()->getName(),
                    'FOLDER_ID' => $password->getFolder()->getId(),
                    'PROJECT_ID' => $password->getFolder()->getProject()->getId(),
                    'PASSWORD_NAME' => $password->getName()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }

    // ProjectFolder Events
    public function logAddProjectFolderEvent(User $user, ProjectFolder $folder, array $meta = []) {
        $history = new History();
        $history->setAction('create');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectContext('project folder');
        $history->setObjectId($folder->getId());
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'PROJECT_NAME' => $folder->getProject()->getName(),
                    'PROJECT_ID' => $folder->getProject()->getId(),
                    'PROJECT_FOLDER_NAME' => $folder->getName()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }

    public function logRemoveProjectFolderEvent(User $user, ProjectFolder $folder, array $meta = []) {
        $history = new History();
        $history->setAction('remove');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectContext('project folder');
        $history->setObjectId($folder->getId());
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'PROJECT_NAME' => $folder->getProject()->getName(),
                    'PROJECT_ID' => $folder->getProject()->getId(),
                    'PROJECT_FOLDER_NAME' => $folder->getName()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }

    public function logUpdateProjectFolderEvent(User $user, ProjectFolder $folder, array $meta = []) {
        $history = new History();
        $history->setAction('update');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectContext('project folder');
        $history->setObjectId($folder->getId());
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'PROJECT_NAME' => $folder->getProject()->getName(),
                    'PROJECT_ID' => $folder->getProject()->getId(),
                    'PROJECT_FOLDER_NAME' => $folder->getName()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }

    // Project Events
    public function logAddProjectEvent(User $user, Project $project, array $meta = []) {
        $history = new History();
        $history->setAction('create');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectContext('project');
        $history->setObjectId($project->getId());
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'PROJECT_NAME' => $project->getName()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }

    public function logRemoveProjectEvent(User $user, Project $project, array $meta = []) {
        $history = new History();
        $history->setAction('remove');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectContext('project');
        $history->setObjectId($project->getId());
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'PROJECT_NAME' => $project->getName()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }

    public function logUpdateProjectEvent(User $user, Project $project, array $meta = []) {
        $history = new History();
        $history->setAction('update');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectContext('project');
        $history->setObjectId($project->getId());
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'PROJECT_NAME' => $project->getName()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }

    // User Events
    public function logRegistrationUserEvent(User $user, User $registeredUser, array $meta = []) {
        $history = new History();
        $history->setAction('create');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectContext('user');
        $history->setObjectId($registeredUser->getId());
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'OBJECT_USER_NAME' => $registeredUser->getFullName()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }
    
    public function logUserSuccessLogin(User $user, array $meta = []) {
        $history = new History();
        $history->setAction('success login');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }
    
    public function logUserFailLogin(string $login, array $meta = []) {
        $history = new History();
        $history->setAction('fail login');
        $history->setSubjectContext('user');
        $history->setMeta(
            array_merge(
                [
                    'LOGIN' => $login
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }

    public function logRemoveUserEvent(User $user, User $removedUser, array $meta = []) {
        $history = new History();
        $history->setAction('remove');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectContext('user');
        $history->setObjectId($removedUser->getId());
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'OBJECT_USER_NAME' => $removedUser->getFullName()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }

    public function logUpdateUserEvent(User $user, User $updatedUser, array $meta = []) {
        $history = new History();
        $history->setAction('update');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectContext('user');
        $history->setObjectId($updatedUser->getId());
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'OBJECT_USER_NAME' => $updatedUser->getFullName()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }

    public function logCompromatedUserEvent(User $user, User $compromatedUser, array $meta = []) {
        $history = new History();
        $history->setAction('compromated');
        $history->setSubjectId($user->getId());
        $history->setSubjectContext('user');
        $history->setObjectContext('user');
        $history->setObjectId($compromatedUser->getId());
        $history->setMeta(
            array_merge(
                [
                    'SUBJECT_USER_NAME' => $user->getFullName(),
                    'OBJECT_USER_NAME' => $compromatedUser->getFullName()
                ],
                $meta)
        );
        $history->setIpExecutor($_SERVER['REMOTE_ADDR']);
        $this->getEntityManager()->persist($history);
        $this->getEntityManager()->flush();
    }

}
