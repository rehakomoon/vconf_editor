from logging import getLogger

from fastapi import APIRouter, Form, UploadFile, HTTPException
from fastapi.responses import FileResponse
from starlette.background import BackgroundTasks

from app.schemas.paper import Paper
from app.latex import latex

router = APIRouter()
logger = getLogger(__name__)


@router.post("/v1/pdf/create", response_class=FileResponse)
async def create_pdf(
    data: str = Form(),
    files: list[UploadFile] = Form(),
    background_tasks: BackgroundTasks = None,
) -> FileResponse:
    try:
        paper = Paper.model_validate_json(data)
    except Exception as e:
        logger.error(e)
        http_exception = HTTPException(status_code=422, detail="invalid_request_field")
        raise http_exception

    # latexの処理
    pdf_file_path = await latex.typeset(paper, files, background_tasks)

    return FileResponse(pdf_file_path)
