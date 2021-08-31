<?php

namespace App\Utils\History;

use App\History\Domain\History;

class HistoryDescriptionAdapter {

    public static function getDescription(History $history): string {
        $context = $history->getSubjectContext();
        $object = ucwords($history->getObjectContext());
        $action = ucwords($history->getAction());
        
        return self::{str_replace(' ', '', $context.$action.$object)}($history);
    }
    
    private static function userUpdateProject(History $history)
    {
        $meta = $history->getMeta();
        return '<b>'.$meta['SUBJECT_USER_NAME'].'</b> обновил проект <b>'.$meta['PROJECT_NAME'].'</b>';
    }
    
    private static function userCreateProject(History $history)
    {
        $meta = $history->getMeta();
        return '<b>'.$meta['SUBJECT_USER_NAME'].'</b> создал проект <b>'.$meta['PROJECT_NAME'].'</b>';
    }
    
    private static function userCreateProjectFolder(History $history)
    {
        $meta = $history->getMeta();
        $folderId = isset($meta['FOLDER_ID']) ? $meta['FOLDER_ID'] : null;
        return '<b>'.$meta['SUBJECT_USER_NAME'].'</b> создал папку <a href="/projects/project-'.$meta['PROJECT_ID'].'/folder-'.$folderId.'/"><b>'.$meta['PROJECT_FOLDER_NAME'].'</b></a> в проекте <b>'.$meta['PROJECT_NAME'].'</b>';
    }
    
    private static function userUpdateProjectFolder(History $history)
    {
        $meta = $history->getMeta();
        $folderId = isset($meta['FOLDER_ID']) ? $meta['FOLDER_ID'] : null;
        return '<b>'.$meta['SUBJECT_USER_NAME'].'</b> обновил папку <a target="_blank" href="/projects/project-'.$meta['PROJECT_ID'].'/folder-'.$folderId.'/"><b>'.$meta['PROJECT_FOLDER_NAME'].'</b></a> в проекте <b>'.$meta['PROJECT_NAME'].'</b>';
    }
    
    private static function userRemoveProjectFolder(History $history)
    {
        $meta = $history->getMeta();
        $folderId = isset($meta['FOLDER_ID']) ? $meta['FOLDER_ID'] : null;
        return '<b>'.$meta['SUBJECT_USER_NAME'].'</b> удалил папку <b>'.$meta['PROJECT_FOLDER_NAME'].'</b></a> в проекте <b>'.$meta['PROJECT_NAME'].'</b>';
    }
    
    private static function userTogglePermissionProject(History $history)
    {
        $meta = $history->getMeta();
        $permission = $meta['PERMISSION'];
        
        if ($meta['PERMISSION'] === 'add_all_permissions') {
            return '<b>' . $meta['SUBJECT_USER_NAME'] . '</b> дал все права доступа для проекта <b>' . $meta['PROJECT_NAME'] . '</b> для пользователя <b>' . $meta['OBJECT_USER_NAME'] . '</b>';
        } else if ($meta['PERMISSION'] === 'remove_all_permissions') {
            return '<b>' . $meta['SUBJECT_USER_NAME'] . '</b> удалил все права доступа для проекта <b>' . $meta['PROJECT_NAME'] . '</b> для пользователя <b>' . $meta['OBJECT_USER_NAME'] . '</b>';
        } else {
            return '<b>' . $meta['SUBJECT_USER_NAME'] . '</b> обновил право доступа <b>' . $meta['PERMISSION'] . ' = '.$meta['NEW_PERMISSION_VALUE'].' </b> для проекта <b>' . $meta['PROJECT_NAME'] . '</b> для пользователя <b>' . $meta['OBJECT_USER_NAME'] . '</b>';
        }
    }
    
    private static function userTogglePermissionProjectUser(History $history)
    {
        return self::userTogglePermissionProject($history);
    }
    
    private static function userTogglePermissionProjectFolder(History $history)
    {
        $meta = $history->getMeta();
        $permission = $meta['PERMISSION'];
        
        if(!isset($meta['PROJECT_FOLDER_NAME']))
        {
            $meta['PROJECT_FOLDER_NAME'] = '(перейти на папку)';
        }
        
        if(!isset($meta['PROJECT_FOLDER_ID']))
        {
            $meta['PROJECT_FOLDER_ID'] = null;
        }
        
        if ($meta['PERMISSION'] === 'add_all_permissions') {
            return '<b>' . $meta['SUBJECT_USER_NAME'] . '</b> дал все права доступа для проекта <b>' . $meta['PROJECT_NAME'] . '</b> для папки <a target="_blank" href="/projects/project-'.$meta['PROJECT_ID'].'/folder-'.$meta['PROJECT_FOLDER_ID'].'/"><b>'.$meta['PROJECT_FOLDER_NAME'].'</b></a> для пользователя <b>' . $meta['OBJECT_USER_NAME'] . '</b>';
        } else if ($meta['PERMISSION'] === 'remove_all_permissions') {
            return '<b>' . $meta['SUBJECT_USER_NAME'] . '</b> удалил все права доступа для проекта <b>' . $meta['PROJECT_NAME'] . '</b> для папки <a target="_blank" href="/projects/project-'.$meta['PROJECT_ID'].'/folder-'.$meta['PROJECT_FOLDER_ID'].'/"><b>'.$meta['PROJECT_FOLDER_NAME'].'</b></a> для пользователя <b>' . $meta['OBJECT_USER_NAME'] . '</b>';
        } else {
            return '<b>' . $meta['SUBJECT_USER_NAME'] . '</b> обновил право доступа <b>' . $meta['PERMISSION'] . ' = '.$meta['NEW_PERMISSION_VALUE'].' </b> для проекта <b>' . $meta['PROJECT_NAME'] . '</b> для папки <a target="_blank" href="/projects/project-'.$meta['PROJECT_ID'].'/folder-'.$meta['PROJECT_FOLDER_ID'].'/"><b>'.$meta['PROJECT_FOLDER_NAME'].'</b></a> для пользователя <b>' . $meta['OBJECT_USER_NAME'] . '</b>';
        }
    }
    
    private static function userTogglePermissionFolderUser(History $history)
    {
        return self::userTogglePermissionProjectFolder($history);
    }
    
    private static function userUpdatePassword(History $history)
    {
        $meta = $history->getMeta();
        return '<b>'.$meta['SUBJECT_USER_NAME'].'</b> обновил пароль с названием <b>'.$meta['PASSWORD_NAME'].'</b> в проекте <b>'.$meta['PROJECT_NAME'].'</b> в папке <a target="_blank" href="/projects/project-'.$meta['PROJECT_ID'].'/folder-'.$meta['FOLDER_ID'].'/"><b>'.$meta['FOLDER_NAME'].'</b></a>';
    }
    
    private static function userCompromatedUser(History $history)
    {
        $meta = $history->getMeta();
        return '<b>'.$meta['SUBJECT_USER_NAME'].'</b> скомпрометировал пароли, которые видел пользователь <b>'.$meta['OBJECT_USER_NAME'].'</b>';
    }
    
    private static function userRemoveProject(History $history)
    {
        $meta = $history->getMeta();
        return '<b>'.$meta['SUBJECT_USER_NAME'].'</b> удалил проект <b>'.$meta['PROJECT_NAME'].'</b>';
    }
    
    private static function userUpdateUser(History $history)
    {
        $meta = $history->getMeta();
        return '<b>'.$meta['SUBJECT_USER_NAME'].'</b> обновил данные пользователя <b>'.$meta['OBJECT_USER_NAME'].'</b>';
    }
    
    private static function userUpdateRole(History $history)
    {
        $meta = $history->getMeta();
        return '<b>'.$meta['SUBJECT_USER_NAME'].'</b> обновил данные/права роли <b>'.$meta['ROLE_NAME'].'</b>';
    }
    
    private static function userCreateUser(History $history)
    {
        $meta = $history->getMeta();
        return '<b>'.$meta['SUBJECT_USER_NAME'].'</b> создал пользователя <b>'.$meta['OBJECT_USER_NAME'].'</b>';
    }
    
    private static function userCreatePassword(History $history)
    {
        $meta = $history->getMeta();
        return '<b>'.$meta['SUBJECT_USER_NAME'].'</b> создал пароль с названием <b>'.$meta['PASSWORD_NAME'].'</b> в проекте <b>'.$meta['PROJECT_NAME'].'</b> в папке <a target="_blank" href="/projects/project-'.$meta['PROJECT_ID'].'/folder-'.$meta['FOLDER_ID'].'/"><b>'.$meta['FOLDER_NAME'].'</b></a>';
    }
    
    private static function userRemovePassword(History $history)
    {
        $meta = $history->getMeta();
        return '<b>'.$meta['SUBJECT_USER_NAME'].'</b> удалил пароль с названием <b>'.$meta['PASSWORD_NAME'].'</b> в проекте <b>'.$meta['PROJECT_NAME'].'</b> в папке <a target="_blank" href="/projects/project-'.$meta['PROJECT_ID'].'/folder-'.$meta['FOLDER_ID'].'/"><b>'.$meta['FOLDER_NAME'].'</b></a>';
    }
    
    private static function userFailLogin(History $history)
    {
        $meta = $history->getMeta();
        return 'Кто-то не смог авторизоваться под логином <b>'.$meta['LOGIN'].'</b>';
    }
    
    private static function userSuccessLogin(History $history)
    {
        $meta = $history->getMeta();
        return '<b>'.$meta['SUBJECT_USER_NAME'].'</b> успешно авторизовался';
    }

}
