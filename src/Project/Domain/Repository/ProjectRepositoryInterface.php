<?php

namespace App\Project\Domain\Repository;

interface ProjectRepositoryInterface {
    public function findById($id);
    public function findByParams(array $params, array $sortParams);
}
