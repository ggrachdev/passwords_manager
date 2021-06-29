<?php

namespace App\Repository;

use App\Entity\ProjectFolder;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @method ProjectFolder|null find($id, $lockMode = null, $lockVersion = null)
 * @method ProjectFolder|null findOneBy(array $criteria, array $orderBy = null)
 * @method ProjectFolder[]    findAll()
 * @method ProjectFolder[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ProjectFolderRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProjectFolder::class);
    }

    // /**
    //  * @return ProjectFolder[] Returns an array of ProjectFolder objects
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
    public function findOneBySomeField($value): ?ProjectFolder
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
