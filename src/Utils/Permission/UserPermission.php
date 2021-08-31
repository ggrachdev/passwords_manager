<?php

namespace App\Utils\Permission;

use App\Authorization\Domain\User;
use App\Project\Domain\Password;
use App\Authorization\Infrastructure\Repository\PermissionRepository;

class UserPermission {

    private $user;
    private $permissionRepository;
    private $listPermissions;

    /**
     * @param User $user
     * @param PermissionRepository $repository
     */
    public function __construct(User $user, PermissionRepository $repository) {
        $this->user = $user;
        $this->permissionRepository = $repository;
        $this->listPermissions = $repository->findFromUser($user);
    }

    public function getListPermissions() {
        return $this->listPermissions;
    }

    public function getUser() {
        return $this->user;
    }

    public function getPermissionsForFolder($folderId) {
        return [
            'can_edit' => $this->canEditFolder($folderId),
            'can_watch' => $this->canWatchFolder($folderId),
            'can_remove' => $this->canRemoveFolder($folderId),
            'can_add_password' => $this->canAddPasswordInFolder($folderId),
            'can_edit_passwords' => $this->canEditPasswordInFolder($folderId),
            'can_remove_passwords' => $this->canRemovePasswordInFolder($folderId),
        ];
    }

    public function getPermissionsGlobal() {
        return [
            'can_add_users' => $this->canAddUsers(),
            'can_edit_users' => $this->canEditUsers(),
            'can_create_projects' => $this->canCreateProjects(),
            'can_compromise_passwords_users' => $this->canСompromisePasswordsUsers(),
            'can_watch_users' => $this->canWatchUsers(),
            'can_remove_users' => $this->canRemoveUsers()
        ];
    }

    public function getPermissionsForProject($projectId) {
        return [
            'can_edit' => $this->canEditProject($projectId),
            'can_watch' => $this->canWatchProject($projectId),
            'can_remove' => $this->canRemoveProject($projectId)
        ];
    }

    // Global

    public function canСompromisePasswordsUsers() {

        $can = false;

        if (!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if (
                    $permission->getPermission() === 'can_compromise_passwords_users' &&
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'GLOBAL' ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                ) {
                    $can = true;
                    break;
                }
            }
        }

        return $can;
    }

    public function canCreateProjects() {

        $can = false;

        if (!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if (
                    $permission->getPermission() === 'can_create_projects' &&
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'GLOBAL' ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                ) {
                    $can = true;
                    break;
                }
            }
        }

        return $can;
    }

    public function canAddUsers() {

        $can = false;

        if (!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if (
                    $permission->getPermission() === 'can_add_users' &&
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'GLOBAL' ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                ) {
                    $can = true;
                    break;
                }
            }
        }

        return $can;
    }

    public function canEditUsers() {

        $can = false;

        if (!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if (
                    $permission->getPermission() === 'can_edit_users' &&
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'GLOBAL' ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                ) {
                    $can = true;
                    break;
                }
            }
        }

        return $can;
    }

    public function canWatchUsers() {

        $can = false;

        if (!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if (
                    $permission->getPermission() === 'can_watch_users' &&
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'GLOBAL' ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                ) {
                    $can = true;
                    break;
                }
            }
        }

        return $can;
    }

    public function canRemoveUsers() {

        $can = false;

        if (!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if (
                    $permission->getPermission() === 'can_remove_users' &&
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'GLOBAL' ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                ) {
                    $can = true;
                    break;
                }
            }
        }

        return $can;
    }

    // Folder
    public function canEditFolder($folderId) {

        $can = false;

        if (!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if (
                    $permission->getPermission() === 'can_edit' &&
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'FOLDER' &&
                    $permission->getTargetId() == $folderId ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                ) {
                    $can = true;
                    break;
                }
            }
        }

        return $can;
    }

    public function canAddPasswordInFolder($folderId) {

        $can = false;

        if (!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if (
                    $permission->getPermission() === 'can_add_password' &&
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'FOLDER' &&
                    $permission->getTargetId() == $folderId ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                ) {
                    $can = true;
                    break;
                }
            }
        }

        return $can;
    }

    public function canEditPasswordInFolder($folderId) {

        $can = false;

        if (!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if (
                    $permission->getPermission() === 'can_edit_passwords' &&
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'FOLDER' &&
                    $permission->getTargetId() == $folderId ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                ) {
                    $can = true;
                    break;
                }
            }
        }

        return $can;
    }

    public function canRemovePasswordInFolder($folderId) {

        $can = false;

        if (!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if (
                    $permission->getPermission() === 'can_remove_passwords' &&
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'FOLDER' &&
                    $permission->getTargetId() == $folderId ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                ) {
                    $can = true;
                    break;
                }
            }
        }

        return $can;
    }

    public function canRemoveFolder($folderId) {

        $can = false;

        if (!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if (
                    $permission->getPermission() === 'can_remove' &&
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'FOLDER' &&
                    $permission->getTargetId() == $folderId ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                ) {
                    $can = true;
                    break;
                }
            }
        }

        return $can;
    }

    public function canWatchFolder($folderId) {

        $can = false;

        if (!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if (
                    $permission->getPermission() === 'can_watch' &&
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'FOLDER' &&
                    $permission->getTargetId() == $folderId ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                ) {
                    $can = true;
                    break;
                }
            }
        }

        return $can;
    }

    // Project
    public function canEditProject($projectId) {

        $can = false;

        if (!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if (
                    $permission->getPermission() === 'can_edit' &&
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'PROJECT' &&
                    $permission->getTargetId() == $projectId ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                ) {
                    $can = true;
                    break;
                }
            }
        }

        return $can;
    }

    public function canRemoveProject($projectId) {

        $can = false;

        if (!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if (
                    $permission->getPermission() === 'can_remove' &&
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'PROJECT' &&
                    $permission->getTargetId() == $projectId ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                ) {
                    $can = true;
                    break;
                }
            }
        }

        return $can;
    }

    public function canWatchProject($projectId) {

        $can = false;

        if (!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if (
                    $permission->getPermission() === 'can_watch' &&
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'PROJECT' &&
                    $permission->getTargetId() == $projectId ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                ) {
                    $can = true;
                    break;
                }
            }
        }

        return $can;
    }

    // Passwords
    public function canEditPassword(Password $password) {
        return $this->canEditPasswordInFolder($password->getFolder()->getId());
    }

    public function canRemovePassword(Password $password) {
        return $this->canRemovePasswordInFolder($password->getFolder()->getId());
    }

    public function canWatchPassword(Password $password) {
        return $this->canWatchFolder($password->getFolder()->getId());
    }

    // History
    public function canShowHistory() {
        return true;
    }

    // Permissions
    public function canChangePermissionsUser() {
        return true;
    }

    public function canChangePermissionsRoles() {
        return true;
    }

}
