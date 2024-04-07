import tempfile
import shutil
from pathlib import Path
from logging import getLogger

from fastapi import APIRouter, Form, UploadFile, HTTPException
from fastapi.responses import FileResponse

from app.schemas.paper import Paper
from app.latex import latex

router = APIRouter()
logger = getLogger(__name__)


@router.post("/v1/pdf/create", response_class=FileResponse)
async def create_pdf(
    data: str = Form(),
    files: list[UploadFile] = Form(),
) -> FileResponse:
    try:
        paper = Paper.model_validate_json(data)
    except Exception as e:
        logger.error(e)
        http_exception = HTTPException(status_code=422, detail="invalid_request_field")
        raise http_exception

    # generate temporary working directory
    # give a unique name to the working directory
    working_dir = Path(tempfile.mkdtemp())
    logger.info("working_dir:", working_dir)

    # リクエストされたファイルを保存
    saved_file_paths = save_files(working_dir, files)

    # latexの処理
    pdf_file_path = await latex.typeset(paper, saved_file_paths)

    return FileResponse(pdf_file_path)

def save_file(file, filename):
        with open(filename, "wb") as f:
            shutil.copyfileobj(file.file, f)

def save_files(working_dir: Path, files: list[UploadFile]) -> list[str]:
    saved_file_paths = []
    for i, file in enumerate(files):
        if file.size == 0:
            shutil.copy(
                Path("/template") / f"figure{i + 1}_dummy.png",
                working_dir / f"fig{i}.png",
            )
        else:
            save_file_path = f"{working_dir}/fig{i}.png"
            save_file(file, save_file_path)
            saved_file_paths.append(save_file_path)
    return saved_file_paths
