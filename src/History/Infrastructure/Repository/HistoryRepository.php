<?php

namespace App\History\Infrastructure\Repository;

use App\History\Domain\History;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\History\Domain\Repository\HistoryRepositoryInterface;

/**
 * @method History|null find($id, $lockMode = null, $lockVersion = null)
 * @method History|null findOneBy(array $criteria, array $orderBy = null)
 * @method History[]    findAll()
 * @method History[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class HistoryRepository extends ServiceEntityRepository implements HistoryRepositoryInterface {

    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, History::class);
    }

    public function getTotalCount(): int {
        return $this->createQueryBuilder('u')
                ->select('count(u.id)')
                ->getQuery()
                ->getSingleScalarResult();
    }

    public function getElementOnPage(int $pageNumber, int $countElementOnPage = 100): array {
        return $this->createQueryBuilder('p')
                ->setMaxResults($countElementOnPage)
                ->orderBy('p.id', 'DESC')
                ->setFirstResult(($pageNumber - 1) * $countElementOnPage)
                ->getQuery()->getResult();
    }

    // /**
    //  * @return History[] Returns an array of History objects
    //  */
    /*
      public function findByExampleField($value)
      {
      return $this->createQueryBuilder('h')
      ->andWhere('h.exampleField = :val')
      ->setParameter('val', $value)
      ->orderBy('h.id', 'ASC')
      ->setMaxResults(10)
      ->getQuery()
      ->getResult()
      ;
      }
     */

    /*
      public function findOneBySomeField($value): ?History
      {
      return $this->createQueryBuilder('h')
      ->andWhere('h.exampleField = :val')
      ->setParameter('val', $value)
      ->getQuery()
      ->getOneOrNullResult()
      ;
      }
     */
}
