import json
import tempfile
from pathlib import Path
from logging import getLogger

from fastapi import APIRouter, Form, UploadFile, HTTPException
from fastapi.responses import FileResponse

from app.schemas.paper import Paper

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

    working_dir = Path(tempfile.mkdtemp())
    print("working_dir:", working_dir)

    # 一旦ダミーのファイルを返す
    result = {"result": "ok"}
    out_file = f"{working_dir}/result.txt"
    with open(out_file, "w") as f:
        txt = json.dumps(result)
        f.write(txt)

    return FileResponse(out_file)
