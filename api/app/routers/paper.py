import json
import tempfile
from pathlib import Path

from fastapi import APIRouter, Form, UploadFile
from fastapi.responses import FileResponse

router = APIRouter()


@router.post("/v1/pdf/create", response_class=FileResponse)
async def create_pdf(
    data: str = Form(),
    files: list[UploadFile] = Form(),
) -> FileResponse:
    working_dir = Path(tempfile.mkdtemp())
    print("working_dir:", working_dir)

    # 一旦ダミーのファイルを返す
    result = {"result": "ok"}
    out_file = f"{working_dir}/result.txt"
    with open(out_file, "w") as f:
        txt = json.dumps(result)
        f.write(txt)

    return FileResponse(out_file)
