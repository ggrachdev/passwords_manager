<?php

namespace App\Repository;

use App\Entity\Permission;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method Permission|null find($id, $lockMode = null, $lockVersion = null)
 * @method Permission|null findOneBy(array $criteria, array $orderBy = null)
 * @method Permission[]    findAll()
 * @method Permission[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class PermissionRepository extends ServiceEntityRepository {

    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, Permission::class);
    }

    public function findFromUser(User $user) {
        return $this->createQueryBuilder('p')
            ->andWhere('p.for_id = :for_id AND p.for_context=:for_context_user OR p.for_id IN (:for_id_roles) AND p.for_context=:for_context_role AND p.target_context=:target_context_global')
            ->setParameter('for_id', $user->getId())
            ->setParameter('for_id_roles', $user->getRoles())
            ->setParameter('for_context_user', 'USER')
            ->setParameter('for_context_role', 'ROLE')
            ->setParameter('target_context_global', 'GLOBAL')
            ->orderBy('p.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }
    
    public function findFromFolder(int $folderId) {
        return $this->createQueryBuilder('p')
            ->andWhere('p.target_id = :target_id AND p.target_contex=:target_context')
            ->setParameter('target_id', $folderId)
            ->setParameter('target_context', 'FOLDER')
            ->orderBy('p.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findFromRole(string $roleId) {
        return $this->createQueryBuilder('p')
            ->andWhere('p.for_id = :for_id AND p.for_context=:for_context')
            ->setParameter('for_id', $roleId)
            ->setParameter('for_context', 'ROLE')
            ->orderBy('p.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findFromProject(int $projectId) {
        return $this->createQueryBuilder('p')
            ->andWhere('p.target_id = :target_id AND p.target_contex=:target_context')
            ->setParameter('target_id', $projectId)
            ->setParameter('target_context', 'PROJECT')
            ->orderBy('p.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

    public function findFromUserWithoutRoles(int $userId) {
        return $this->createQueryBuilder('p')
            ->andWhere('p.for_id = :for_id AND p.for_context=:for_context_user')
            ->setParameter('for_id', $userId)
            ->setParameter('for_context_user', 'USER')
            ->orderBy('p.id', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }

    // /**
    //  * @return Permission[] Returns an array of Permission objects
    //  */
    /*
      public function findByExampleField($value)
      {
      return $this->createQueryBuilder('p')
      ->andWhere('p.exampleField = :val')
      ->setParameter('val', $value)
      ->orderBy('p.id', 'ASC')
      ->setMaxResults(10)
      ->getQuery()
      ->getResult()
      ;
      }
     */

    /*
      public function findOneBySomeField($value): ?Permission
      {
      return $this->createQueryBuilder('p')
      ->andWhere('p.exampleField = :val')
      ->setParameter('val', $value)
      ->getQuery()
      ->getOneOrNullResult()
      ;
      }
     */
}
