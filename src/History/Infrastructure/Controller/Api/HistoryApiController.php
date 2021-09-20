<?php

namespace App\History\Infrastructure\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use App\Utils\Api\Response\ApiResponse;
use App\Utils\History\HistoryDescriptionAdapter;
use App\History\Domain\Repository\HistoryRepositoryInterface;

class HistoryApiController extends AbstractController {

    /**
     * @Route("/api/history/get/page-{page}", name="api_get_history")
     */
    public function getHistory($page, HistoryRepositoryInterface $historyRepository): Response {
        $response = new ApiResponse();

        if ($this->isGranted('ROLE_ADMIN') && $page > 0) {
            $responseData = [
                'count_pages' => 0,
                'total_count' => 0,
                'now_page' => $page,
                'history' => []
            ];

            $countTotal = $historyRepository->getTotalCount();
            $countPages = floor($countTotal / 50) + ($countTotal % 50 > 0 ? 1 : 0);

            $responseData['count_pages'] = $countPages;
            $responseData['total_count'] = $countTotal;

            $historyList = $historyRepository->getElementOnPage($page, 50);

            if (!empty($historyList)) {
                foreach ($historyList as $history) {
                    $responseData['history'][] = [
                        'id' => $history->getId(),
                        'action' => $history->getAction(),
                        'subject_context' => $history->getSubjectContext(),
                        'subject_id' => $history->getSubjectId(),
                        'object_context' => $history->getObjectContext(),
                        'object_id' => $history->getObjectId(),
                        'ip' => $history->getIpExecutor(),
                        'meta' => [
                            'id' => $history->getId(),
                            'action' => $history->getAction(),
                            'subject_context' => $history->getSubjectContext(),
                            'subject_id' => $history->getSubjectId(),
                            'object_context' => $history->getObjectContext(),
                            'object_id' => $history->getObjectId(),
                            'meta' => $history->getMeta(),
                            'ip' => $history->getIpExecutor()
                        ],
                        'date' => $history->getCreatedAt()->format('Y-m-d H:i:s'),
                        'desc' => HistoryDescriptionAdapter::getDescription($history)
                    ];
                }
            }

            $response->setSuccess();
            $response->setData($responseData);
        }

        return $response->generate();
    }

}
