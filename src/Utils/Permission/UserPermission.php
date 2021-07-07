<?php

namespace App\Utils\Permission;

use App\Entity\User;
use App\Repository\PermissionRepository;

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
    
    public function getPermissionsForFolder($folderId)
    {
        return [
            'can_edit' => $this->canEditFolder($folderId),
            'can_watch' => $this->canWatchFolder($folderId),
            'can_remove' => $this->canRemoveFolder($folderId),
            'can_add_password' => $this->canAddPasswordInFolder($folderId)
        ];
    }
    
    public function getPermissionsGlobal()
    {
        return [
            'can_add_users' => $this->canAddUsers(),
            'can_edit_users' => $this->canEditUsers(),
            'can_compromise_passwords_users' => $this->canСompromisePasswordsUsers(),
            'can_watch_users' => $this->canWatchUsers(),
            'can_remove_users' => $this->canRemoveUsers()
        ];
    }
    
    public function getPermissionsForProject($projectId)
    {
        return [
            'can_edit' => $this->canEditProject($projectId),
            'can_watch' => $this->canWatchProject($projectId),
            'can_remove' => $this->canRemoveProject($projectId)
        ];
    }
    
    // Global

    public function canСompromisePasswordsUsers() {
        
        $can = false;
        
        if(!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if(
                    $permission->getPermission() === 'can_compromise_passwords_users' && 
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'GLOBAL' ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                )
                {
                    $can = true;
                    break;
                }
            }
        }
        
        return $can;
    }

    public function canCreateProjects() {
        
        $can = false;
        
        if(!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if(
                    $permission->getPermission() === 'can_create_projects' && 
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'GLOBAL' ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                )
                {
                    $can = true;
                    break;
                }
            }
        }
        
        return $can;
    }
    
    public function canAddUsers() {
        
        $can = false;
        
        if(!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if(
                    $permission->getPermission() === 'can_add_users' && 
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'GLOBAL' ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                )
                {
                    $can = true;
                    break;
                }
            }
        }
        
        return $can;
    }
    public function canEditUsers() {
        
        $can = false;
        
        if(!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if(
                    $permission->getPermission() === 'can_edit_users' && 
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'GLOBAL' ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                )
                {
                    $can = true;
                    break;
                }
            }
        }
        
        return $can;
    }
    public function canWatchUsers() {
        
        $can = false;
        
        if(!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if(
                    $permission->getPermission() === 'can_watch_users' && 
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'GLOBAL' ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                )
                {
                    $can = true;
                    break;
                }
            }
        }
        
        return $can;
    }
    public function canRemoveUsers() {
        
        $can = false;
        
        if(!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if(
                    $permission->getPermission() === 'can_remove_users' && 
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'GLOBAL' ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                )
                {
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
        
        if(!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if(
                    $permission->getPermission() === 'can_edit_folder' && 
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'FOLDER' &&
                    $permission->getTargetId() == $folderId ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                )
                {
                    $can = true;
                    break;
                }
            }
        }
        
        return $can;
    }

    public function canRemoveFolder($folderId) {
        
        $can = false;
        
        if(!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if(
                    $permission->getPermission() === 'can_remove_folder' && 
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'FOLDER' &&
                    $permission->getTargetId() == $folderId ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                )
                {
                    $can = true;
                    break;
                }
            }
        }
        
        return $can;
    }

    public function canWatchFolder($folderId) {
        
        $can = false;
        
        if(!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if(
                    $permission->getPermission() === 'can_watch_folder' && 
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'FOLDER' &&
                    $permission->getTargetId() == $folderId ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                )
                {
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
        
        if(!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if(
                    $permission->getPermission() === 'can_edit_project' && 
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'PROJECT' &&
                    $permission->getTargetId() == $projectId ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                )
                {
                    $can = true;
                    break;
                }
            }
        }
        
        return $can;
    }

    public function canRemoveProject($projectId) {
        
        $can = false;
        
        if(!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if(
                    $permission->getPermission() === 'can_remove_project' && 
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'PROJECT' &&
                    $permission->getTargetId() == $projectId ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                )
                {
                    $can = true;
                    break;
                }
            }
        }
        
        return $can;
    }

    public function canWatchProject($projectId) {
        
        $can = false;
        
        if(!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if(
                    $permission->getPermission() === 'can_watch_project' && 
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'PROJECT' &&
                    $permission->getTargetId() == $projectId ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                )
                {
                    $can = true;
                    break;
                }
            }
        }
        
        return $can;
    }

    // Passwords
    public function canEditPassword($passwordId) {
        return true;
    }

    public function canAddPasswordInFolder($folderId) {
        
        $can = false;
        
        if(!empty($this->getListPermissions())) {
            foreach ($this->getListPermissions() as $permission) {
                if(
                    $permission->getPermission() === 'can_add_password_in_folder' && 
                    $permission->getValue() == true &&
                    $permission->getTargetContext() == 'FOLDER' &&
                    $permission->getTargetId() == $folderId ||
                    in_array('ROLE_ADMIN', $this->getUser()->getRoles())
                )
                {
                    $can = true;
                    break;
                }
            }
        }
        
        return $can;
    }

    public function canRemovePassword($passwordId) {
        return true;
    }

    public function canWatchPassword($passwordId) {
        return true;
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
