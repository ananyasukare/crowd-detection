from fastapi import APIRouter
from app.api.v1.endpoints import auth, offices, tokens, admin, super_admin

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(offices.router, prefix="/offices", tags=["offices"])
api_router.include_router(tokens.router, prefix="/tokens", tags=["tokens"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
api_router.include_router(super_admin.router, prefix="/super-admin", tags=["super-admin"])
