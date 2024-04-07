from fastapi import APIRouter
from fastapi.responses import FileResponse

router = APIRouter()


@router.get("/")
async def root():
    return {"message": "Hello World"}


@router.get("/testform")
async def testform():
    return FileResponse("./app/testform.html")
