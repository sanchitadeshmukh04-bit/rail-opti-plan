from fastapi import APIRouter

from models.schemas import (
    OptimizationRequest,
    OptimizationResponse,
)

from optimizer.scheduler import (
    optimize,
    summarize,
)


router = APIRouter(
    tags=["Optimization"]
)


@router.post(
    "/optimize",
    response_model=OptimizationResponse,
)
def generate_optimized_plan(
    request: OptimizationRequest,
):

    result = optimize(
        tasks=[
            task.model_dump()
            for task in request.tasks
        ],
        trains=[
            train.model_dump()
            for train in request.trains
        ],
        assets=[
            asset.model_dump()
            for asset in request.assets
        ],
        resources=[
            resource.model_dump()
            for resource in request.resources
        ],
    )

    metrics = summarize(
        result["blocks"]
    )

    return {
        "blocks": result["blocks"],
        "unassigned": result["unassigned"],
        "metrics": metrics,
    }