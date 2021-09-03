<?php

namespace App\History\Domain\Repository;

interface HistoryRepositoryInterface {
    public function getTotalCount(): int;
    public function getElementOnPage(int $pageNumber, int $countElementOnPage = 100): array;
}
